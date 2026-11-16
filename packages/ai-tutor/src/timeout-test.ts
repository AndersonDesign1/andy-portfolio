// Offline checks for the mid-reply time limits, using AI SDK mock models.
// After text reaches the student, a stall or an over-long reply must stop the
// request and must NOT hand over to the next model (that would garble the answer).
// Run: bun run --filter=@andy-portfolio/ai-tutor timeouts
import { MockLanguageModelV4 } from "ai/test";

import { EXAMPLE_COURSE } from "./course.ts";
import type { ModelProfile } from "./models.ts";
import {
  generateTutorReply,
  streamTutorReply,
  type TutorEvent,
  TutorUnavailableError,
} from "./tutor.ts";

const messages = [{ role: "user" as const, content: "what is a closure?" }];

const usage = {
  inputTokens: {
    total: 10,
    noCache: 10,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

/** Records whether the SDK aborted the provider call. */
interface AbortProbe {
  aborted: boolean;
}

/** Sends one word, then goes silent until the request is aborted. */
function stallingModel(probe: AbortProbe) {
  return new MockLanguageModelV4({
    doStream: ({ abortSignal }) =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue({ type: "text-start", id: "t" });
            controller.enqueue({
              type: "text-delta",
              id: "t",
              delta: "A closure ",
            });
            abortSignal?.addEventListener("abort", () => {
              probe.aborted = true;
              controller.error(abortSignal.reason);
            });
          },
        }),
      }),
  });
}

/** Keeps sending a word every 20ms and never finishes. */
function endlessModel(probe: AbortProbe) {
  return new MockLanguageModelV4({
    doStream: ({ abortSignal }) =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue({ type: "text-start", id: "t" });

            const interval = setInterval(() => {
              controller.enqueue({
                type: "text-delta",
                id: "t",
                delta: "more ",
              });
            }, 20);

            abortSignal?.addEventListener("abort", () => {
              probe.aborted = true;
              clearInterval(interval);
              controller.error(abortSignal.reason);
            });
          },
        }),
      }),
  });
}

/** A healthy reply that finishes normally. */
function healthyModel() {
  return new MockLanguageModelV4({
    doStream: () =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue({ type: "text-start", id: "t" });
            controller.enqueue({ type: "text-delta", id: "t", delta: "Fine." });
            controller.enqueue({ type: "text-end", id: "t" });
            controller.enqueue({
              type: "finish",
              finishReason: { unified: "stop", raw: undefined },
              usage,
            });
            controller.close();
          },
        }),
      }),
  });
}

function profile(
  key: "luna" | "haiku",
  model: MockLanguageModelV4
): ModelProfile {
  return {
    key,
    provider: "neon",
    modelId: `mock-${key}`,
    price: { input: 0, cacheRead: 0, output: 0 },
    maxOutputTokens: 100,
    create: () => model,
  };
}

let failures = 0;

function expect(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✗"} ${label} — ${detail}`);

  if (!ok) {
    failures += 1;
  }
}

/** Runs the stream to the end, keeping every event and the error it ended with. */
async function collect(
  primary: MockLanguageModelV4,
  limits: { stallTimeoutMs: number; totalTimeoutMs: number }
) {
  const backup = healthyModel();
  const events: TutorEvent[] = [];
  const started = performance.now();
  let failure: Error | undefined;

  try {
    for await (const event of streamTutorReply({
      course: EXAMPLE_COURSE,
      messages,
      chain: ["luna", "haiku"],
      models: {
        luna: profile("luna", primary),
        haiku: profile("haiku", backup),
      },
      ...limits,
    })) {
      events.push(event);
    }
  } catch (error) {
    failure = error instanceof Error ? error : new Error(String(error));
  }

  return {
    backup,
    events,
    failure,
    ms: Math.round(performance.now() - started),
  };
}

function describe(run: Awaited<ReturnType<typeof collect>>) {
  const text = run.events
    .flatMap((e) => (e.type === "text" ? [e.text] : []))
    .join("");

  return {
    text,
    started: run.events.some((e) => e.type === "start" && e.model === "luna"),
    fellBack: run.events.some((e) => e.type === "fallback"),
    stoppedWithError:
      Boolean(run.failure) && !(run.failure instanceof TutorUnavailableError),
    backupCalls: run.backup.doStreamCalls.length,
  };
}

const TIMEOUT_MESSAGE = /timeout|timed out/i;

/**
 * A real time-limit stop: the SDK aborted the provider call, the error names a
 * timeout, and it happened no earlier than the configured limit (so an
 * immediate provider failure can't pass) and well before the 5s other limit.
 */
function stoppedByLimit(
  run: Awaited<ReturnType<typeof collect>>,
  probe: AbortProbe,
  limitMs: number
): boolean {
  return (
    probe.aborted &&
    TIMEOUT_MESSAGE.test(run.failure?.message ?? "") &&
    run.ms >= limitMs &&
    run.ms < 1500
  );
}

// 1. Reply starts, then stalls → stops after the stall limit, no handover.
const stallProbe: AbortProbe = { aborted: false };

const stall = await collect(stallingModel(stallProbe), {
  stallTimeoutMs: 150,
  totalTimeoutMs: 5000,
});

const stallResult = describe(stall);

expect(
  "stall after first words stops the reply",
  stallResult.started &&
    stallResult.stoppedWithError &&
    stoppedByLimit(stall, stallProbe, 150),
  `got "${stallResult.text.trim()}", provider aborted: ${stallProbe.aborted}, stopped after ${stall.ms}ms (limit 150ms): ${stall.failure?.message ?? "no error"}`
);

expect(
  "stall does not hand over to the next model",
  stallResult.backupCalls === 0 && !stallResult.fellBack,
  `backup model called ${stallResult.backupCalls} time(s)`
);

// 2. Reply keeps streaming past the total limit → stops at the total limit, no handover.
const endlessProbe: AbortProbe = { aborted: false };

const endless = await collect(endlessModel(endlessProbe), {
  stallTimeoutMs: 5000,
  totalTimeoutMs: 300,
});

const endlessResult = describe(endless);

expect(
  "over-long reply stops at the total limit",
  endlessResult.started &&
    endlessResult.stoppedWithError &&
    stoppedByLimit(endless, endlessProbe, 300),
  `streamed ${endlessResult.text.split(" ").length - 1} words, provider aborted: ${endlessProbe.aborted}, stopped after ${endless.ms}ms (limit 300ms): ${endless.failure?.message ?? "no error"}`
);

expect(
  "over-long reply does not hand over to the next model",
  endlessResult.backupCalls === 0 && !endlessResult.fellBack,
  `backup model called ${endlessResult.backupCalls} time(s)`
);

// 3. Control: a healthy reply under the same tight limits finishes normally.
const reply = await generateTutorReply({
  course: EXAMPLE_COURSE,
  messages,
  chain: ["luna"],
  models: { luna: profile("luna", healthyModel()) },
  stallTimeoutMs: 150,
  totalTimeoutMs: 300,
});

expect(
  "healthy reply finishes under the limits",
  reply.text === "Fine." && reply.done.finishReason === "stop",
  `"${reply.text}" (${reply.done.finishReason})`
);

console.log(
  failures ? `\n${failures} check(s) failed` : "\nAll timeout checks passed"
);

process.exitCode = failures ? 1 : 0;
