// Offline unit checks with AI SDK mock models: routing, the empty / rate-limit /
// timeout fallbacks, spend on empty replies, the history limit and response
// cancellation. No provider is called.
// Run: bun run --filter=@andy-portfolio/ai-tutor unit
import { APICallError, type ModelMessage } from "ai";
import { MockLanguageModelV4 } from "ai/test";

import { currentPeriod, MemoryBudgetStore } from "./budget.ts";
import { EXAMPLE_COURSE } from "./course.ts";
import type { ModelProfile } from "./models.ts";
import { classifyRequest } from "./route.ts";
import { generateTutorReply, tutorTextResponse } from "./tutor.ts";

let failures = 0;

function expect(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✗"} ${label} — ${detail}`);

  if (!ok) {
    failures += 1;
  }
}

const usage = {
  inputTokens: {
    total: 1000,
    noCache: 1000,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: 200, text: 0, reasoning: 200 },
};

const finish = {
  type: "finish" as const,
  finishReason: { unified: "stop" as const, raw: undefined },
  usage,
};

function profile(
  key: "luna" | "haiku",
  model: MockLanguageModelV4
): ModelProfile {
  return {
    key,
    provider: key === "luna" ? "neon" : "openrouter",
    modelId: `mock-${key}`,
    price: { input: 0.1, cacheRead: 0.01, output: 0.5 },
    maxOutputTokens: 100,
    create: () => model,
  };
}

/** A healthy reply that finishes normally. */
function healthyModel(text = "Fine.") {
  return new MockLanguageModelV4({
    doStream: () =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue({ type: "text-start", id: "t" });
            controller.enqueue({ type: "text-delta", id: "t", delta: text });
            controller.enqueue({ type: "text-end", id: "t" });
            controller.enqueue(finish);
            controller.close();
          },
        }),
      }),
  });
}

const user = (content: string): ModelMessage[] => [{ role: "user", content }];
const ask = user("what is a closure?");

// 1. Routing: real snippet shapes vs prose that uses code-ish words.
const routes: [string, string, "general" | "homework"][] = [
  [
    "prose with if/return",
    "Can you explain if a loop is better for this?\nShould I return the value or print it?",
    "general",
  ],
  [
    "prose with for",
    "What is the for loop for?\nI keep forgetting when to use it",
    "general",
  ],
  ["unfenced assignment + call", "x = 1\nprint(x)", "homework"],
  ["unfenced calls", 'print("hello")\nprint("world")', "homework"],
  [
    "JS declarations",
    "const total = 0\nfor (const item of items) {",
    "homework",
  ],
  ["fenced block", "why is this wrong?\n```js\nlet a = 1\n```", "homework"],
  ["assignment mention", "is assignment 3 due friday?", "homework"],
];

for (const [label, text, expected] of routes) {
  const got = classifyRequest(user(text));
  expect(`route: ${label}`, got === expected, `${got} (expected ${expected})`);
}

// 2. Empty reply: falls back, and its tokens are still charged to the budget.
{
  const budget = new MemoryBudgetStore();

  const empty = new MockLanguageModelV4({
    doStream: () =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue(finish);
            controller.close();
          },
        }),
      }),
  });

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: ask,
    chain: ["luna", "haiku"],
    models: {
      luna: profile("luna", empty),
      haiku: profile("haiku", healthyModel()),
    },
    budget,
  });

  const neonSpend = await budget.spent("neon", currentPeriod());
  const expectedSpend = (1000 * 0.1 + 200 * 0.5) / 1e6;

  expect(
    "empty reply falls back",
    reply.model === "haiku" && reply.fallbacks[0]?.reason === "empty",
    reply.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")
  );
  expect(
    "empty reply's tokens are still charged",
    Math.abs(neonSpend - expectedSpend) < 1e-12,
    `neon spend $${neonSpend.toFixed(6)} (expected $${expectedSpend.toFixed(6)})`
  );
}

// 3. Rate limit (HTTP 429): falls back with reason rate_limit, reservation released.
{
  const budget = new MemoryBudgetStore();

  const limited = new MockLanguageModelV4({
    doStream: () =>
      Promise.reject(
        new APICallError({
          message: "Too Many Requests",
          url: "https://example.test/v1/chat/completions",
          requestBodyValues: {},
          statusCode: 429,
        })
      ),
  });

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: ask,
    chain: ["luna", "haiku"],
    models: {
      luna: profile("luna", limited),
      haiku: profile("haiku", healthyModel()),
    },
    budget,
  });

  const neonSpend = await budget.spent("neon", currentPeriod());

  expect(
    "429 falls back as rate_limit",
    reply.model === "haiku" && reply.fallbacks[0]?.reason === "rate_limit",
    reply.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")
  );
  expect(
    "rate-limited attempt releases its reservation",
    neonSpend === 0,
    `neon spend $${neonSpend}`
  );
}

// 4. Thinking that stalls before any answer text: SDK stall limit → reason timeout.
{
  const thinksThenStalls = new MockLanguageModelV4({
    doStream: ({ abortSignal }) =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            controller.enqueue({ type: "reasoning-start", id: "r" });
            controller.enqueue({
              type: "reasoning-delta",
              id: "r",
              delta: "hmm",
            });
            abortSignal?.addEventListener("abort", () =>
              controller.error(abortSignal.reason)
            );
          },
        }),
      }),
  });

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: ask,
    chain: ["luna", "haiku"],
    models: {
      luna: profile("luna", thinksThenStalls),
      haiku: profile("haiku", healthyModel()),
    },
    firstTokenTimeoutMs: 5000,
    stallTimeoutMs: 100,
  });

  expect(
    "stall during hidden thinking is reported as timeout",
    reply.model === "haiku" && reply.fallbacks[0]?.reason === "timeout",
    reply.fallbacks
      .map((f) => `${f.model}:${f.reason} (${f.detail ?? ""})`)
      .join(", ")
  );
}

// 5. History limit: 0 sends only the current question; 2 sends the last two messages.
{
  const history: ModelMessage[] = [
    { role: "user", content: "q1" },
    { role: "assistant", content: "a1" },
    { role: "user", content: "q2" },
    { role: "assistant", content: "a2" },
    { role: "user", content: "q3" },
  ];

  const cases = [
    [0, ["q3"]],
    [2, ["q3"]],
    [3, ["q2", "a2", "q3"]],
  ] as const;

  const runs = await Promise.all(
    cases.map(async ([limit, expected]) => {
      const model = healthyModel();

      await generateTutorReply({
        course: EXAMPLE_COURSE,
        messages: history,
        chain: ["luna"],
        models: { luna: profile("luna", model) },
        maxHistoryMessages: limit,
      });

      const sent = (model.doStreamCalls[0]?.prompt ?? []).flatMap((message) =>
        message.role === "user" || message.role === "assistant"
          ? message.content.flatMap((part) =>
              part.type === "text" ? [part.text] : []
            )
          : []
      );

      return { limit, expected, sent };
    })
  );

  for (const { limit, expected, sent } of runs) {
    expect(
      `history limit ${limit}`,
      JSON.stringify(sent) === JSON.stringify(expected),
      `sent ${JSON.stringify(sent)} (expected ${JSON.stringify(expected)}; a leading tutor reply is dropped)`
    );
  }
}

// 6. Cancelling the HTTP response aborts the provider call and tries no fallback.
{
  let providerAborted = false;
  const backup = healthyModel();

  const waiting = new MockLanguageModelV4({
    doStream: ({ abortSignal }) =>
      Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings: [] });
            abortSignal?.addEventListener("abort", () => {
              providerAborted = true;
              controller.error(abortSignal.reason);
            });
          },
        }),
      }),
  });

  const response = tutorTextResponse({
    course: EXAMPLE_COURSE,
    messages: ask,
    chain: ["luna", "haiku"],
    models: { luna: profile("luna", waiting), haiku: profile("haiku", backup) },
    firstTokenTimeoutMs: 5000,
  });

  const reader = response.body?.getReader();
  const pending = reader?.read();

  await new Promise((resolve) => setTimeout(resolve, 50));
  await reader?.cancel("student closed the page");
  await pending;
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(
    "cancelling the response aborts the provider call",
    providerAborted && backup.doStreamCalls.length === 0,
    `provider aborted: ${providerAborted}; backup called ${backup.doStreamCalls.length} time(s)`
  );
}

// 7. A failing onDone hook (e.g. saving the chat) must not error a delivered reply.
{
  const response = tutorTextResponse(
    {
      course: EXAMPLE_COURSE,
      messages: ask,
      chain: ["luna"],
      models: { luna: profile("luna", healthyModel("Here is the answer.")) },
    },
    () => Promise.reject(new Error("database is down"))
  );

  let body = "";
  let streamFailed = false;

  try {
    body = await response.text();
  } catch {
    streamFailed = true;
  }

  expect(
    "failing onDone keeps the delivered reply intact",
    !streamFailed && body === "Here is the answer.",
    `body "${body}", stream ${streamFailed ? "errored" : "closed normally"}`
  );
}

console.log(
  failures ? `\n${failures} check(s) failed` : "\nAll unit checks passed"
);

process.exitCode = failures ? 1 : 0;
