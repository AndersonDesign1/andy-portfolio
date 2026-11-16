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
  /** Older turns beyond this are dropped to keep input cost flat. Default 12 (6 exchanges). */
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

function classifyError(error: Error): FallbackReason {
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

  const trimmed = chat.slice(-max);

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

/** Providers already at their monthly cap, read in one batch before trying any model. */
async function providersOverBudget(
  request: TutorRequest,
  profiles: ModelProfile[],
  period: string
): Promise<Set<Provider>> {
  const { budget } = request;

  if (!budget) {
    return new Set();
  }

  const caps = request.caps ?? DEFAULT_CAPS;
  const providers = [...new Set(profiles.map((p) => p.provider))];

  const spent = await Promise.all(
    providers.map((provider) => budget.spent(provider, period))
  );

  return new Set(
    providers.filter((provider, i) => (spent[i] ?? 0) >= caps[provider])
  );
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
  messages: ModelMessage[],
  signal: AbortSignal
) {
  return streamText({
    model: profile.create(),
    instructions: instructionsFor(profile, request.course, request.addendum),
    messages,
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
      throw new Error("aborted");
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
 * Streams one model's reply. Returns a FailedAttempt when the next model should
 * be tried (nothing reached the student yet); throws once text has been sent,
 * because switching models mid-answer would garble it.
 */
async function* attemptModel(
  key: ModelKey,
  profile: ModelProfile,
  request: TutorRequest,
  context: AttemptContext
): AsyncGenerator<TutorEvent, FailedAttempt | undefined> {
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

  try {
    const result = startStream(profile, request, context.messages, signal);

    const { answered, finish } = yield* relayReply(
      result.fullStream,
      { type: "start", model: key, route: context.route },
      () => {
        answering = true;
        clearTimeout(timer);
      }
    );

    if (!answered) {
      return { reason: "empty" };
    }

    const usage = finish?.usage ?? NO_USAGE;
    const billed = billedCost(await result.providerMetadata);
    const cost = billed ?? estimateCost(profile.price, usage);

    await request.budget?.add(profile.provider, context.period, cost);

    yield {
      type: "done",
      model: key,
      usage,
      cost,
      costIsBilled: billed !== undefined,
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

    return {
      reason: firstWord.signal.aborted ? "timeout" : classifyError(failure),
      detail: failure.message.slice(0, 200),
    };
  } finally {
    clearTimeout(timer);
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

  const overBudget = await providersOverBudget(
    request,
    profiles.map(([, profile]) => profile),
    period
  );

  const context = {
    messages: cleanHistory(request.messages, request.maxHistoryMessages ?? 12),
    period,
    route,
  };

  const attempts: TutorUnavailableError["attempts"] = [];

  for (const [key, profile] of profiles) {
    const failed: FailedAttempt | undefined = overBudget.has(profile.provider)
      ? { reason: "budget" }
      : yield* attemptModel(key, profile, request, context);

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

/**
 * Plain-text streaming Response for an API route. The model that answered is
 * reported through onDone (for logging and saving the conversation), not headers,
 * because headers are sent before the fallback chain settles.
 */
export function tutorTextResponse(
  request: TutorRequest,
  onDone?: (
    event: Extract<TutorEvent, { type: "done" }>
  ) => void | Promise<void>
): Response {
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of streamTutorReply(request)) {
          if (event.type === "text") {
            controller.enqueue(encoder.encode(event.text));
          } else if (event.type === "done") {
            await onDone?.(event);
          }
        }

        controller.close();
      } catch (error) {
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
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
