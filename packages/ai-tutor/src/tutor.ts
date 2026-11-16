import { type ModelMessage, type SystemModelMessage, streamText } from "ai";
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
  /** Older turns beyond this are dropped to keep input cost flat. Default 12 (6 exchanges). */
  maxHistoryMessages?: number;
  /** Force a specific chain, e.g. ["glm"] in tests. Defaults to the route for the message. */
  chain?: ModelKey[];
  /** Override the model's prompt addendum (null = base prompt only). Used to compare prompt variants. */
  addendum?: AddendumKey | null;
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

function classifyError(error: unknown): FallbackReason {
  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? error.statusCode
      : undefined;
  const message = error instanceof Error ? error.message : String(error);
  if (
    status === 429 ||
    /rate limit|too many requests|REQUEST_LIMIT_EXCEEDED/i.test(message)
  ) {
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

/**
 * Streams a tutor reply, falling back down the model chain when a model is over budget,
 * errors, is rate limited, is too slow to start, or returns nothing.
 * Fallback only happens before the first text arrives; once a model starts answering, it finishes.
 */
export async function* streamTutorReply(
  request: TutorRequest
): AsyncGenerator<TutorEvent> {
  const caps = request.caps ?? DEFAULT_CAPS;
  const period = currentPeriod();
  const route = request.chain ? "forced" : classifyRequest(request.messages);
  const chain = request.chain ?? ROUTES[route === "forced" ? "general" : route];
  const messages = cleanHistory(
    request.messages,
    request.maxHistoryMessages ?? 12
  );
  const attempts: TutorUnavailableError["attempts"] = [];

  for (const key of chain) {
    const profile: ModelProfile = MODELS[key];

    if (
      request.budget &&
      (await request.budget.spent(profile.provider, period)) >=
        caps[profile.provider]
    ) {
      attempts.push({ model: key, reason: "budget" });
      yield { type: "fallback", model: key, reason: "budget" };
      continue;
    }

    const timeout = new AbortController();
    const timer = setTimeout(
      () => timeout.abort(),
      request.firstTokenTimeoutMs ?? 10_000
    );
    const signal = request.signal
      ? AbortSignal.any([request.signal, timeout.signal])
      : timeout.signal;
    const started = performance.now();
    let answering = false;

    try {
      const result = streamText({
        model: profile.create(),
        instructions: instructionsFor(
          profile,
          request.course,
          request.addendum
        ),
        messages,
        maxOutputTokens: profile.maxOutputTokens,
        providerOptions: profile.providerOptions,
        abortSignal: signal,
        maxRetries: 0,
        // Errors are handled from fullStream below; stop the SDK also logging them.
        onError: () => undefined,
      });

      let finish: { usage: UsageCounts; finishReason: string } | undefined;
      for await (const part of result.fullStream) {
        if (part.type === "text-delta" && part.text.length > 0) {
          if (!answering) {
            answering = true;
            clearTimeout(timer);
            yield { type: "start", model: key, route };
          }
          yield { type: "text", text: part.text };
        } else if (part.type === "error") {
          throw part.error;
        } else if (part.type === "abort") {
          throw new Error("aborted");
        } else if (part.type === "finish") {
          const u = part.totalUsage;
          finish = {
            finishReason: part.finishReason,
            usage: {
              input: u.inputTokens ?? 0,
              cacheRead: u.inputTokenDetails.cacheReadTokens ?? 0,
              cacheWrite: u.inputTokenDetails.cacheWriteTokens ?? 0,
              output: u.outputTokens ?? 0,
              reasoning: u.outputTokenDetails.reasoningTokens ?? 0,
            },
          };
        }
      }

      if (!answering) {
        attempts.push({ model: key, reason: "empty" });
        yield { type: "fallback", model: key, reason: "empty" };
        continue;
      }

      const usage = finish?.usage ?? {
        input: 0,
        cacheRead: 0,
        cacheWrite: 0,
        output: 0,
        reasoning: 0,
      };
      const metadata = await result.providerMetadata;
      const billed = (
        metadata?.openrouter as { usage?: { cost?: number } } | undefined
      )?.usage?.cost;
      const cost = billed ?? estimateCost(profile.price, usage);
      await request.budget?.add(profile.provider, period, cost);

      yield {
        type: "done",
        model: key,
        usage,
        cost,
        costIsBilled: billed !== undefined,
        ms: Math.round(performance.now() - started),
        finishReason: finish?.finishReason ?? "unknown",
      };
      return;
    } catch (error) {
      if (request.signal?.aborted) {
        throw error;
      }
      if (answering) {
        // Text already reached the student; switching models mid-answer would garble it.
        throw error;
      }
      const reason = timeout.signal.aborted ? "timeout" : classifyError(error);
      const detail =
        error instanceof Error ? error.message.slice(0, 200) : undefined;
      attempts.push({ model: key, reason, detail });
      yield { type: "fallback", model: key, reason, detail };
    } finally {
      clearTimeout(timer);
    }
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
