// Checks the Postgres budget store against the real Neon database, then a full
// tutor reply recorded through it. Test rows use a "test-" period and are deleted afterwards.
// Run: bun run --filter=@andy-portfolio/ai-tutor budget
import { EXAMPLE_COURSE } from "./course.ts";
import { ensureBudgetTable, PostgresBudgetStore } from "./postgres-budget.ts";
import { generateTutorReply } from "./tutor.ts";

const store = new PostgresBudgetStore();
const period = `test-${Date.now()}`;
let failures = 0;

function expect(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✗"} ${label} — ${detail}`);

  if (!ok) {
    failures += 1;
  }
}

try {
  await ensureBudgetTable(store.sql);
  await ensureBudgetTable(store.sql);
  expect("table setup is repeatable", true, "tutor_spend exists");

  expect(
    "empty period reads 0",
    (await store.spent("neon", period)) === 0,
    "no row yet"
  );

  // 20 concurrent adds must not lose any increments.
  await Promise.all(
    Array.from({ length: 20 }, () => store.add("neon", period, 0.000_25))
  );
  const neonTotal = await store.spent("neon", period);
  expect(
    "concurrent adds are atomic",
    Math.abs(neonTotal - 0.005) < 1e-9,
    `$${neonTotal} after 20 × $0.00025`
  );

  expect(
    "providers are separate",
    (await store.spent("openrouter", period)) === 0,
    "openrouter still 0"
  );

  // Over the cap → Neon skipped, OpenRouter answers and its cost lands in the table.
  await store.add("neon", period, 999);

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: [{ role: "user", content: "what does typeof null return?" }],
    budget: {
      spent: (provider) => store.spent(provider, period),
      add: (provider, _p, usd) => store.add(provider, period, usd),
    },
  });

  const openrouterTotal = await store.spent("openrouter", period);
  expect(
    "cap enforced from Postgres",
    reply.model === "deepseek" && openrouterTotal > 0,
    `answered by ${reply.model}; openrouter spend recorded $${openrouterTotal.toFixed(6)}`
  );
} finally {
  await store.sql`DELETE FROM tutor_spend WHERE period = ${period}`;
  console.log(`\nCleaned up test rows for ${period}`);
}

console.log(
  failures ? `${failures} check(s) failed` : "All budget checks passed"
);

process.exitCode = failures ? 1 : 0;
