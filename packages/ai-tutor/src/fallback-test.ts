// Checks routing and every fallback trigger against the real providers.
// Run: bun run --filter=@andy-portfolio/ai-tutor fallbacks
import { MemoryBudgetStore, currentPeriod } from "./budget.ts";
import { EXAMPLE_COURSE } from "./course.ts";
import { classifyRequest } from "./route.ts";
import { generateTutorReply, TutorUnavailableError } from "./tutor.ts";

const course = EXAMPLE_COURSE;
const general = [
  { role: "user" as const, content: "what does typeof null return?" },
];
const homework = [
  {
    role: "user" as const,
    content:
      "my assignment 2 is broken pls fix\n\nfunction grade(s) {\n  if (s == 90) return 'A'\n}",
  },
];

let failures = 0;
function expect(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✗"} ${label} — ${detail}`);
  if (!ok) {
    failures += 1;
  }
}

// 1. Routing
expect(
  "classify general",
  classifyRequest(general) === "general",
  classifyRequest(general)
);
expect(
  "classify homework",
  classifyRequest(homework) === "homework",
  classifyRequest(homework)
);

const generalReply = await generateTutorReply({ course, messages: general });
expect(
  "general → luna",
  generalReply.model === "luna",
  `answered by ${generalReply.model}`
);

const homeworkReply = await generateTutorReply({ course, messages: homework });
expect(
  "homework → haiku",
  homeworkReply.model === "haiku",
  `answered by ${homeworkReply.model}`
);

// 2. Neon budget used up → OpenRouter
const budget = new MemoryBudgetStore();
await budget.add("neon", currentPeriod(), 999);
const overBudget = await generateTutorReply({
  course,
  messages: general,
  budget,
});
expect(
  "neon over budget → deepseek",
  overBudget.model === "deepseek" &&
    overBudget.fallbacks.every((f) => f.reason === "budget"),
  `answered by ${overBudget.model}; skipped ${overBudget.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")}`
);
const spent = await budget.spent("openrouter", currentPeriod());
expect(
  "spend recorded",
  spent > 0,
  `openrouter spend now $${spent.toFixed(6)}`
);

// 3. Neon down (bad credential) → OpenRouter
const realToken = process.env.NEON_AI_GATEWAY_TOKEN;
process.env.NEON_AI_GATEWAY_TOKEN = "nt_live_invalid";
const neonDown = await generateTutorReply({ course, messages: general });
process.env.NEON_AI_GATEWAY_TOKEN = realToken;
expect(
  "neon down → deepseek",
  neonDown.model === "deepseek",
  `answered by ${neonDown.model}; ${neonDown.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")}`
);

// 4. Too slow to start → timeout, and a clear error once every model is exhausted
try {
  await generateTutorReply({
    course,
    messages: general,
    chain: ["luna", "deepseek"],
    firstTokenTimeoutMs: 1,
  });
  expect("all models time out", false, "unexpectedly answered");
} catch (error) {
  const attempts = error instanceof TutorUnavailableError ? error.attempts : [];
  expect(
    "all models time out → TutorUnavailableError",
    attempts.length === 2 && attempts.every((a) => a.reason === "timeout"),
    attempts.map((a) => `${a.model}:${a.reason}`).join(", ")
  );
}

console.log(
  failures ? `\n${failures} check(s) failed` : "\nAll fallback checks passed"
);
process.exitCode = failures ? 1 : 0;
