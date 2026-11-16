// Checks the Postgres budget store against the real Neon database, then a full
// tutor reply recorded through it. Test rows use a unique "test-" period and
// are deleted afterwards.
// Run: bun run --filter=@andy-portfolio/ai-tutor budget
import { randomUUID } from "node:crypto";

import type { BudgetStore } from "./budget.ts";
import { EXAMPLE_COURSE } from "./course.ts";
import { ensureBudgetTable, PostgresBudgetStore } from "./postgres-budget.ts";
import { generateTutorReply } from "./tutor.ts";

const store = new PostgresBudgetStore();
// Unique per run, so parallel runs never share (or delete) each other's rows.
const period = `test-${Date.now()}-${randomUUID().slice(0, 8)}`;
let failures = 0;

function expect(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✗"} ${label} — ${detail}`);

  if (!ok) {
    failures += 1;
  }
}

/** The store, pinned to this run's test period. */
const testBudget: BudgetStore = {
  spent: (provider) => store.spent(provider, period),
  reserve: (provider, _p, usd, cap) =>
    store.reserve(provider, period, usd, cap),
  settle: (provider, _p, reserved, actual) =>
    store.settle(provider, period, reserved, actual),
  add: (provider, _p, usd) => store.add(provider, period, usd),
};

try {
  await ensureBudgetTable(store.sql);
  await ensureBudgetTable(store.sql);
  expect("table setup is repeatable", true, "tutor_spend exists");

  expect(
    "empty period reads 0",
    (await store.spent("neon", period)) === 0,
    "no row yet"
  );

  // 20 concurrent unconditional adds must not lose any increments.
  await Promise.all(
    Array.from({ length: 20 }, () => store.add("neon", period, 0.000_25))
  );

  const neonTotal = await store.spent("neon", period);

  expect(
    "concurrent adds are atomic",
    Math.abs(neonTotal - 0.005) < 1e-9,
    `$${neonTotal} after 20 × $0.00025`
  );

  // 20 concurrent reservations of $0.0004 against a $0.005 cap: only 12 fit.
  const granted = await Promise.all(
    Array.from({ length: 20 }, () =>
      store.reserve("openrouter", period, 0.0004, 0.005)
    )
  );

  const reservedTotal = await store.spent("openrouter", period);
  const grantedCount = granted.filter(Boolean).length;

  expect(
    "concurrent reservations never exceed the cap",
    grantedCount === 12 && reservedTotal <= 0.005 + 1e-9,
    `${grantedCount}/20 granted, total $${reservedTotal} (cap $0.005)`
  );

  await store.settle("openrouter", period, 0.0004, 0.0001);
  const settled = await store.spent("openrouter", period);

  expect(
    "settle swaps a reservation for the real cost",
    Math.abs(settled - (reservedTotal - 0.0003)) < 1e-9,
    `$${reservedTotal} → $${settled} after settling $0.0004 to $0.0001`
  );

  // Neon over its cap → skipped for budget (not for an error), OpenRouter answers
  // and its cost lands in the table. OpenRouter's cap is raised past the test
  // reservations above so only Neon is blocked.
  await store.add("neon", period, 999);
  const openrouterBefore = await store.spent("openrouter", period);

  const reply = await generateTutorReply({
    course: EXAMPLE_COURSE,
    messages: [{ role: "user", content: "what does typeof null return?" }],
    budget: testBudget,
    caps: { neon: 4, openrouter: 5 },
  });

  const openrouterAfter = await store.spent("openrouter", period);

  const skippedForBudget =
    reply.fallbacks.length === 2 &&
    reply.fallbacks.every((f) => f.reason === "budget");

  expect(
    "cap enforced from Postgres",
    reply.model === "deepseek" &&
      skippedForBudget &&
      openrouterAfter > openrouterBefore,
    `answered by ${reply.model}; skipped ${reply.fallbacks.map((f) => `${f.model}:${f.reason}`).join(", ")}; openrouter +$${(openrouterAfter - openrouterBefore).toFixed(6)}`
  );
} finally {
  // Never let a cleanup failure hide the error that got us here.
  try {
    await store.sql`DELETE FROM tutor_spend WHERE period = ${period}`;
    console.log(`\nCleaned up test rows for ${period}`);
  } catch (cleanupError) {
    failures += 1;
    console.error(
      `\nCould not clean up test rows for ${period}:`,
      cleanupError
    );
  }
}

console.log(
  failures ? `${failures} check(s) failed` : "All budget checks passed"
);
process.exitCode = failures ? 1 : 0;
