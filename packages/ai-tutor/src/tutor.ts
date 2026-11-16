import {
  APICallError,
  type LanguageModelUsage,
  type ModelMessage,
  type ProviderMetadata,
  type SystemModelMessage,
  streamText,
} from "ai";
import { z } from "zod";

import {
  type BudgetCaps,
  type BudgetStore,
  currentPeriod,
  DEFAULT_CAPS,
} from "./budget.ts";
import {
  estimateCost,
  type ModelKey,
  type ModelProfile,
  MODELS,
  type Provider,
  ROUTES,
  type UsageCounts,
} from "./models.ts";
import {
  type AddendumKey,
  buildSystemPrompt,
  type CourseContext,
} from "./prompts.ts";
import { classifyRequest } from "./route.ts";

export interface TutorRequest {
  course: CourseContext;
  /** The chat so far, ending with the student's message. Only user/assistant turns are used. */
  messages: ModelMessage[];
  /** Spend tracking. Without it, budget caps are not enforced. */
  budget?: BudgetStore;
  caps?: BudgetCaps;
  /** Give up on a model if no answer text arrives within this time. Default 10s. */
  firstTokenTimeoutMs?: number;
  /** Abort if a started reply pauses longer than this between chunks. Default 15s. */
  stallTimeoutMs?: number;
  /** Abort a model's reply that runs longer than this in total. Default 60s. */
  totalTimeoutMs?: number;
  /**
   * Most recent messages sent, including the current one; older turns are
   * dropped to keep input cost flat. Default 12 (6 exchanges). 0 sends only the
   * current message.
   */
  maxHistoryMessages?: number;
  /** Force a specific chain, e.g. ["glm"] in tests. Defaults to the route for the message. */
  chain?: ModelKey[];
  /** Override the model's prompt addendum (null = base prompt only). Used to compare prompt variants. */
  addendum?: AddendumKey | null;
  /** Replace model profiles, e.g. with AI SDK mock models in tests. */
  models?: Partial<Record<ModelKey, ModelProfile>>;
  signal?: AbortSignal;
}

export type FallbackReason =
  | "budget"
  | "timeout"
  | "empty"
  | "rate_limit"
  | "error";

export type TutorEvent =
  | {
      type: "fallback";
      model: ModelKey;
      reason: FallbackReason;
      detail?: string;
    }
  | { type: "start"; model: ModelKey; route: "general" | "homework" | "forced" }
  | { type: "text"; text: string }
  | {
      type: "done";
      model: ModelKey;
      usage: UsageCounts;
      /** Billed cost from OpenRouter when reported, otherwise list price × tokens. */
      cost: number;
      costIsBilled: boolean;
      ms: number;
      finishReason: string;
    };

export class TutorUnavailableError extends Error {
  readonly attempts: {
    model: ModelKey;
    reason: FallbackReason;
    detail?: string;
  }[];

  constructor(attempts: TutorUnavailableError["attempts"]) {
    super(
      `No tutor model could answer (${attempts.map((a) => `${a.model}: ${a.reason}`).join(", ")})`
    );
    this.name = "TutorUnavailableError";
    this.attempts = attempts;
  }
}

/** Longest pause allowed between chunks once a reply has started. */
const STALL_TIMEOUT_MS = 15_000;

/** Hard ceiling for one model's whole reply (a ~150-word answer takes 2-15s). */
const TOTAL_TIMEOUT_MS = 60_000;

/** OpenRouter's usage accounting, present when a request sets `usage: { include: true }`. */
const openrouterBilling = z.object({ usage: z.object({ cost: z.number() }) });

function billedCost(
  metadata: ProviderMetadata | undefined
): number | undefined {
  const parsed = openrouterBilling.safeParse(metadata?.openrouter);

  return parsed.success ? parsed.data.usage.cost : undefined;
}

/** Rate-limit wording from Neon, OpenRouter and upstream providers. */
const RATE_LIMIT_MESSAGE =
  /rate limit|too many requests|REQUEST_LIMIT_EXCEEDED/i;

/** The SDK aborted the stream, e.g. its stall or total time limit fired. */
class StreamAbortedError extends Error {
  constructor(reason: string | undefined) {
    super(reason ? `aborted: ${reason}` : "aborted");
    this.name = "StreamAbortedError";
  }
}

function classifyError(error: Error): FallbackReason {
  if (error instanceof StreamAbortedError) {
    return "timeout";
  }

  const rateLimited =
    (APICallError.isInstance(error) && error.statusCode === 429) ||
    RATE_LIMIT_MESSAGE.test(error.message);

  if (rateLimited) {
    return "rate_limit";
  }

  return "error";
}

function cleanHistory(messages: ModelMessage[], max: number): ModelMessage[] {
  const chat = messages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  // slice(-0) would return everything. A limit of 0 (or less) means no earlier
  // turns: only the student's current message is sent.
  const trimmed = max > 0 ? chat.slice(-max) : chat.slice(-1);

  // A conversation must start with the student, not a dangling tutor reply.
  return trimmed[0]?.role === "assistant" ? trimmed.slice(1) : trimmed;
}

function instructionsFor(
  profile: ModelProfile,
  course: CourseContext,
  addendum: AddendumKey | null | undefined
): SystemModelMessage {
  return {
    role: "system",
    content: buildSystemPrompt(
      course,
      addendum === undefined ? profile.addendum : (addendum ?? undefined)
    ),
    // Anthropic only caches when asked; the other providers cache automatically.
    providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
  };
}

const NO_USAGE: UsageCounts = {
  input: 0,
  cacheRead: 0,
  cacheWrite: 0,
  output: 0,
  reasoning: 0,
};

function usageFrom(usage: LanguageModelUsage): UsageCounts {
  return {
    input: usage.inputTokens ?? 0,
    cacheRead: usage.inputTokenDetails.cacheReadTokens ?? 0,
    cacheWrite: usage.inputTokenDetails.cacheWriteTokens ?? 0,
    output: usage.outputTokens ?? 0,
    reasoning: usage.outputTokenDetails.reasoningTokens ?? 0,
  };
}

const utf8 = new TextEncoder();

/** Extra room for provider overhead tokens (chat template, role markers). */
const PROMPT_OVERHEAD_TOKENS = 256;

/**
 * Worst-case cost of one attempt: the full output budget plus an upper bound on
 * input tokens, billed uncached. Every token covers at least one UTF-8 byte, so
 * the prompt's byte length (as serialized JSON, which only adds bytes) bounds
 * its token count; ~4 characters per token is only the average and can
 * undercount dense text. The extra input reserved costs fractions of a cent.
 */
function reservationFor(
  profile: ModelProfile,
  instructions: SystemModelMessage,
  messages: ModelMessage[]
): number {
  const promptBytes =
    utf8.encode(instructions.content).length +
    utf8.encode(JSON.stringify(messages)).length;

  return estimateCost(profile.price, {
    ...NO_USAGE,
    input: promptBytes + PROMPT_OVERHEAD_TOKENS,
    output: profile.maxOutputTokens,
  });
}

/**
 * Replace a reservation with the real cost. Accounting must never break a reply
 * the student already has, so a failing store is logged, not thrown; the
 * reservation it leaves behind keeps the cap conservative.
 */
async function settleSpend(
  request: TutorRequest,
  provider: Provider,
  period: string,
  amounts: { reserved: number; actual: number }
): Promise<void> {
  try {
    await request.budget?.settle(
      provider,
      period,
      amounts.reserved,
      amounts.actual
    );
  } catch (error) {
    console.error("ai-tutor: could not settle spend", provider, error);
  }
}

/** Cost of a finished attempt: OpenRouter's billed figure, else list price × tokens. */
async function costOf(
  profile: ModelProfile,
  result: ReturnType<typeof startStream>,
  finish: Finish | undefined
): Promise<{ cost: number; billed: boolean }> {
  const billed = billedCost(await result.providerMetadata);

  return {
    cost: billed ?? estimateCost(profile.price, finish?.usage ?? NO_USAGE),
    billed: billed !== undefined,
  };
}

type Route = Extract<TutorEvent, { type: "start" }>["route"];

/** What one model attempt ended with, when it could not answer. */
interface FailedAttempt {
  reason: FallbackReason;
  detail?: string;
}

interface AttemptContext {
  messages: ModelMessage[];
  period: string;
  route: Route;
}

function startStream(
  profile: ModelProfile,
  request: TutorRequest,
  input: { instructions: SystemModelMessage; messages: ModelMessage[] },
  signal: AbortSignal
) {
  return streamText({
    model: profile.create(),
    instructions: input.instructions,
    messages: input.messages,
    maxOutputTokens: profile.maxOutputTokens,
    providerOptions: profile.providerOptions,
    abortSignal: signal,
    // The first-word wait is attemptModel's own timer: the SDK's `firstChunkMs`
    // also counts hidden reasoning, which the student never sees.
    // These catch a reply that stalls mid-answer or drags on.
    timeout: {
      chunkMs: request.stallTimeoutMs ?? STALL_TIMEOUT_MS,
      totalMs: request.totalTimeoutMs ?? TOTAL_TIMEOUT_MS,
    },
    maxRetries: 0,
    // Errors are handled from fullStream in relayReply; stop the SDK also logging them.
    onError: () => undefined,
  });
}

interface Finish {
  usage: UsageCounts;
  finishReason: string;
}

/**
 * Forwards answer text as events and returns how the stream finished.
 * `onFirstText` runs once, right before the first words are sent.
 * Provider errors and aborts are rethrown.
 */
async function* relayReply(
  fullStream: ReturnType<typeof startStream>["fullStream"],
  start: TutorEvent,
  onFirstText: () => void
): AsyncGenerator<TutorEvent, { answered: boolean; finish?: Finish }> {
  let answered = false;
  let finish: Finish | undefined;

  for await (const part of fullStream) {
    if (part.type === "text-delta" && part.text.length > 0) {
      if (!answered) {
        answered = true;
        onFirstText();
        yield start;
      }

      yield { type: "text", text: part.text };
    } else if (part.type === "error") {
      throw part.error;
    } else if (part.type === "abort") {
      throw new StreamAbortedError(part.reason);
    } else if (part.type === "finish") {
      finish = {
        finishReason: part.finishReason,
        usage: usageFrom(part.totalUsage),
      };
    }
  }

  return { answered, finish };
}

/**
 * Reserve this attempt's worst-case cost before any paid call. Fails closed:
 * if the store cannot be reached the model is skipped, so an outage can't
 * turn into unbounded spend.
 */
async function reserveSpend(
  request: TutorRequest,
  profile: ModelProfile,
  period: string,
  usd: number
): Promise<FailedAttempt | undefined> {
  if (!request.budget) {
    return undefined;
  }

  const cap = (request.caps ?? DEFAULT_CAPS)[profile.provider];

  try {
    const fits = await request.budget.reserve(
      profile.provider,
      period,
      usd,
      cap
    );

    return fits ? undefined : { reason: "budget" };
  } catch (error) {
    return {
      reason: "budget",
      detail: `budget store unavailable: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Streams one model's reply. Returns a FailedAttempt when the next model should
 * be tried (nothing reached the student yet); throws once text has been sent,
 * because switching models mid-answer would garble it.
 *
 * Spend: the worst case is reserved first and always settled. Finished
 * attempts (answered or empty) settle to their real cost; errors before any
 * output release the reservation; timeouts and mid-answer failures keep it,
 * because tokens were probably billed.
 */
async function* attemptModel(
  key: ModelKey,
  profile: ModelProfile,
  request: TutorRequest,
  context: AttemptContext
): AsyncGenerator<TutorEvent, FailedAttempt | undefined> {
  const instructions = instructionsFor(
    profile,
    request.course,
    request.addendum
  );

  const reserved = request.budget
    ? reservationFor(profile, instructions, context.messages)
    : 0;

  const refused = await reserveSpend(
    request,
    profile,
    context.period,
    reserved
  );

  if (refused) {
    return refused;
  }

  const firstWord = new AbortController();

  const timer = setTimeout(
    () => firstWord.abort(),
    request.firstTokenTimeoutMs ?? 10_000
  );

  const signal = request.signal
    ? AbortSignal.any([request.signal, firstWord.signal])
    : firstWord.signal;

  const started = performance.now();
  let answering = false;
  let actual = reserved;

  try {
    const result = startStream(
      profile,
      request,
      { instructions, messages: context.messages },
      signal
    );

    const { answered, finish } = yield* relayReply(
      result.fullStream,
      { type: "start", model: key, route: context.route },
      () => {
        answering = true;
        clearTimeout(timer);
      }
    );

    const { cost, billed } = await costOf(profile, result, finish);
    actual = cost;

    if (!answered) {
      return { reason: "empty" };
    }

    yield {
      type: "done",
      model: key,
      usage: finish?.usage ?? NO_USAGE,
      cost,
      costIsBilled: billed,
      ms: Math.round(performance.now() - started),
      finishReason: finish?.finishReason ?? "unknown",
    };

    return undefined;
  } catch (error) {
    if (request.signal?.aborted || answering) {
      throw error;
    }

    // Providers throw Error subclasses; wrap anything else so it is handled the same way.
    const failure = error instanceof Error ? error : new Error(String(error));

    const reason = firstWord.signal.aborted
      ? "timeout"
      : classifyError(failure);

    if (reason !== "timeout") {
      actual = 0;
    }

    return { reason, detail: failure.message.slice(0, 200) };
  } finally {
    clearTimeout(timer);

    if (request.budget) {
      await settleSpend(request, profile.provider, context.period, {
        reserved,
        actual,
      });
    }
  }
}

/**
 * Streams a tutor reply, falling back down the model chain when a model is over budget,
 * errors, is rate limited, is too slow to start, or returns nothing.
 * Fallback only happens before the first text arrives; once a model starts answering, it finishes.
 */
export async function* streamTutorReply(
  request: TutorRequest
): AsyncGenerator<TutorEvent> {
  const period = currentPeriod();

  const route: Route = request.chain
    ? "forced"
    : classifyRequest(request.messages);

  const chain = request.chain ?? ROUTES[route === "forced" ? "general" : route];

  const profiles = chain.map((key): [ModelKey, ModelProfile] => [
    key,
    request.models?.[key] ?? MODELS[key],
  ]);

  const context = {
    messages: cleanHistory(request.messages, request.maxHistoryMessages ?? 12),
    period,
    route,
  };

  const attempts: TutorUnavailableError["attempts"] = [];

  for (const [key, profile] of profiles) {
    // A cancelled request (e.g. the student closed the page) tries no more models.
    request.signal?.throwIfAborted();

    const failed = yield* attemptModel(key, profile, request, context);

    if (!failed) {
      return;
    }

    attempts.push({ model: key, ...failed });
    yield { type: "fallback", model: key, ...failed };
  }

  throw new TutorUnavailableError(attempts);
}

export interface TutorReply {
  text: string;
  model: ModelKey;
  route: "general" | "homework" | "forced";
  fallbacks: Extract<TutorEvent, { type: "fallback" }>[];
  done: Extract<TutorEvent, { type: "done" }>;
}

/** Collects a full reply. Useful for tests, share-link snapshots, or non-streaming callers. */
export async function generateTutorReply(
  request: TutorRequest
): Promise<TutorReply> {
  let text = "";
  let start: Extract<TutorEvent, { type: "start" }> | undefined;
  let done: Extract<TutorEvent, { type: "done" }> | undefined;
  const fallbacks: TutorReply["fallbacks"] = [];

  for await (const event of streamTutorReply(request)) {
    if (event.type === "text") {
      text += event.text;
    } else if (event.type === "start") {
      start = event;
    } else if (event.type === "fallback") {
      fallbacks.push(event);
    } else {
      done = event;
    }
  }

  if (!(start && done)) {
    throw new Error("Tutor stream ended without a reply");
  }

  return { text, model: start.model, route: start.route, fallbacks, done };
}

type DoneEvent = Extract<TutorEvent, { type: "done" }>;

/**
 * The answer has already streamed by the time onDone runs, so a failing hook
 * (e.g. saving the conversation) must not error the response: the client would
 * see a delivered answer as failed and retry a paid request. Log it instead.
 */
async function runOnDone(
  onDone: ((event: DoneEvent) => void | Promise<void>) | undefined,
  event: DoneEvent
): Promise<void> {
  try {
    await onDone?.(event);
  } catch (error) {
    console.error(
      "ai-tutor: onDone hook failed after the reply was sent",
      error
    );
  }
}

/**
 * Plain-text streaming Response for an API route. The model that answered is
 * reported through onDone (for logging and saving the conversation), not headers,
 * because headers are sent before the fallback chain settles. A failing onDone
 * is logged and never errors the response.
 */
export function tutorTextResponse(
  request: TutorRequest,
  onDone?: (
    event: Extract<TutorEvent, { type: "done" }>
  ) => void | Promise<void>
): Response {
  const encoder = new TextEncoder();
  // Aborted when the client cancels the body, so the provider call stops too.
  const cancelled = new AbortController();

  const signal = request.signal
    ? AbortSignal.any([request.signal, cancelled.signal])
    : cancelled.signal;

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of streamTutorReply({ ...request, signal })) {
          if (cancelled.signal.aborted) {
            return;
          }

          if (event.type === "text") {
            controller.enqueue(encoder.encode(event.text));
          } else if (event.type === "done") {
            await runOnDone(onDone, event);
          }
        }

        controller.close();
      } catch (error) {
        if (cancelled.signal.aborted) {
          return;
        }

        if (error instanceof TutorUnavailableError) {
          controller.enqueue(
            encoder.encode(
              `Sorry, the tutor is unavailable right now. Please try again in a minute, or message ${request.course.teacherName}.`
            )
          );
          controller.close();

          return;
        }

        controller.error(error);
      }
    },
    cancel(reason) {
      cancelled.abort(reason);
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
