// Offline unit checks with AI SDK mock models: routing, the empty / rate-limit /
// timeout fallbacks, spend on empty replies, the history limit and response
// cancellation. No provider is called.
// Run: bun run --filter=@andy-portfolio/ai-tutor unit
import { APICallError, type ModelMessage } from "ai";
import { MockLanguageModelV4 } from "ai/test";

import {
  type BudgetStore,
  currentPeriod,
  MemoryBudgetStore,
} from "./budget.ts";
import { EXAMPLE_COURSE } from "./course.ts";
import type { ModelProfile } from "./models.ts";
import { classifyRequest } from "./route.ts";
import {
  generateTutorReply,
  TutorInputError,
  tutorTextResponse,
} from "./tutor.ts";

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
  ["Python function", "def add(a, b):\n    return a + b", "homework"],
  ["Python loop", "for i in range(3):\n    print(i)", "homework"],
  ["Python if/else", "if score >= 90:\n    grade = 'A'\nelse:", "homework"],
  [
    "prose with a colon",
    "Here is my question:\nWhy does the loop run forever?",
    "general",
  ],
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

  // Spy on the store so "released" is distinguishable from "never reserved".
  const calls: string[] = [];

  const spied: BudgetStore = {
    spent: (provider, period) => budget.spent(provider, period),
    reserve: (provider, period, usd, cap) => {
      calls.push(`reserve:${provider}:${usd > 0 ? "positive" : "zero"}`);
      return budget.reserve(provider, period, usd, cap);
    },
    settle: (provider, period, reserved, actual) => {
      calls.push(
        `settle:${provider}:${reserved > 0 ? "positive" : "zero"}->${actual}`
      );
      return budget.settle(provider, period, reserved, actual);
    },
    add: (provider, period, usd) => budget.add(provider, period, usd),
  };

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: ask,
    chain: ["luna", "haiku"],
    models: {
      luna: profile("luna", limited),
      haiku: profile("haiku", healthyModel()),
    },
    budget: spied,
  });

  const neonSpend = await budget.spent("neon", currentPeriod());
  const neonCalls = calls.filter((c) => c.includes(":neon:"));

  expect(
    "429 falls back as rate_limit",
    reply.model === "haiku" && reply.fallbacks[0]?.reason === "rate_limit",
    reply.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")
  );
  expect(
    "rate-limited attempt reserved, then released its reservation",
    JSON.stringify(neonCalls) ===
      JSON.stringify(["reserve:neon:positive", "settle:neon:positive->0"]) &&
      neonSpend === 0,
    `${neonCalls.join(", ")}; neon spend $${neonSpend}`
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

  const started = performance.now();

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

  const elapsed = Math.round(performance.now() - started);
  const detail = reply.fallbacks[0]?.detail ?? "";

  // Proves the 100ms stall timer fired, not the 5s first-word timer: it fell
  // back well before 5s, and the SDK's chunk-timeout message is in the detail.
  expect(
    "stall during hidden thinking is reported as timeout",
    reply.model === "haiku" &&
      reply.fallbacks[0]?.reason === "timeout" &&
      detail.includes("Chunk timeout") &&
      elapsed >= 100 &&
      elapsed < 2000,
    `${reply.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")} after ${elapsed}ms (stall 100ms, first-word 5000ms): ${detail}`
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
  let onDoneCalled = false;

  const response = tutorTextResponse(
    {
      course: EXAMPLE_COURSE,
      messages: ask,
      chain: ["luna"],
      models: { luna: profile("luna", healthyModel("Here is the answer.")) },
    },
    () => {
      onDoneCalled = true;
      return Promise.reject(new Error("database is down"));
    }
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
    onDoneCalled && !streamFailed && body === "Here is the answer.",
    `onDone called: ${onDoneCalled}; body "${body}", stream ${streamFailed ? "errored" : "closed normally"}`
  );
}

// 9. Malformed amounts are rejected instead of bypassing or poisoning the cap.
{
  const budget = new MemoryBudgetStore();
  const period = currentPeriod();

  const attempts = await Promise.all(
    [
      ["NaN usd", Number.NaN, 1],
      ["negative usd", -1, 1],
      ["NaN cap", 0.01, Number.NaN],
      ["infinite cap", 0.01, Number.POSITIVE_INFINITY],
    ].map(async ([label, usd, cap]) => {
      try {
        await budget.reserve("neon", period, Number(usd), Number(cap));
        return `${label}: accepted`;
      } catch (error) {
        return error instanceof RangeError
          ? `${label}: rejected`
          : `${label}: ${String(error)}`;
      }
    })
  );

  const total = await budget.spent("neon", period);

  expect(
    "NaN, negative and infinite amounts are rejected",
    attempts.every((a) => a.endsWith("rejected")) && total === 0,
    `${attempts.join("; ")}; total $${total}`
  );
}

// 8. Image/file parts: rejected before any model or budget is touched; the
//    classifier alone routes them as homework.
{
  const screenshot: ModelMessage[] = [
    {
      role: "user",
      content: [
        { type: "text", text: "why is this wrong?" },
        {
          type: "image",
          image: new URL("https://example.test/assignment-5.png"),
        },
      ],
    },
  ];

  const budget = new MemoryBudgetStore();
  const model = healthyModel();
  let rejected = "";

  try {
    await generateTutorReply({
      course: EXAMPLE_COURSE,
      messages: screenshot,
      chain: ["luna"],
      models: { luna: profile("luna", model) },
      budget,
    });
  } catch (error) {
    rejected =
      error instanceof TutorInputError
        ? error.message
        : `other: ${String(error)}`;
  }

  const spend = await budget.spent("neon", currentPeriod());

  expect(
    "image parts are rejected before any spend",
    rejected.startsWith("The tutor accepts text only") &&
      model.doStreamCalls.length === 0 &&
      spend === 0,
    `${rejected || "not rejected"}; model called ${model.doStreamCalls.length}×; spend $${spend}`
  );

  const response = tutorTextResponse({
    course: EXAMPLE_COURSE,
    messages: screenshot,
    chain: ["luna"],
    models: { luna: profile("luna", healthyModel()) },
  });

  const body = await response.text();

  expect(
    "the HTTP response explains text-only input",
    body.startsWith("The tutor accepts text only"),
    `"${body}"`
  );

  const route = classifyRequest(screenshot);
  expect(
    "classifier routes media turns as homework",
    route === "homework",
    route
  );
}

// 10. The student leaves while the reservation is in flight: no provider call,
//     and the reservation is released instead of counted as spend.
{
  const budget = new MemoryBudgetStore();
  const leave = new AbortController();
  const model = healthyModel();

  const slowStore: BudgetStore = {
    spent: (provider, period) => budget.spent(provider, period),
    reserve: async (provider, period, usd, cap) => {
      const granted = await budget.reserve(provider, period, usd, cap);
      leave.abort(new Error("student closed the page"));
      return granted;
    },
    settle: (provider, period, reserved, actual) =>
      budget.settle(provider, period, reserved, actual),
    add: (provider, period, usd) => budget.add(provider, period, usd),
  };

  let outcome = "answered";

  try {
    await generateTutorReply({
      course: EXAMPLE_COURSE,
      messages: ask,
      chain: ["luna", "haiku"],
      models: {
        luna: profile("luna", model),
        haiku: profile("haiku", healthyModel()),
      },
      budget: slowStore,
      signal: leave.signal,
    });
  } catch {
    outcome = "cancelled";
  }

  const spend = await budget.spent("neon", currentPeriod());

  expect(
    "cancel during reservation releases it and calls no provider",
    outcome === "cancelled" && model.doStreamCalls.length === 0 && spend === 0,
    `${outcome}; provider called ${model.doStreamCalls.length}×; neon spend $${spend}`
  );
}

console.log(
  failures ? `\n${failures} check(s) failed` : "\nAll unit checks passed"
);
process.exitCode = failures ? 1 : 0;
