# @andy-portfolio/ai-tutor

The AI layer for the student tutor: system prompts, model routing, fallbacks and spend caps. There's no UI here yet; an app imports `streamTutorReply` or `tutorTextResponse`.

## Use it

```ts
import { tutorTextResponse } from "@andy-portfolio/ai-tutor";
import { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import type { CourseContext } from "@andy-portfolio/ai-tutor/prompts";

const budget = new PostgresBudgetStore(); // reads DATABASE_URL

export async function POST(request: Request) {
  const { messages } = await request.json(); // [{ role: "user" | "assistant", content }]
  return tutorTextResponse({ course, messages, budget }, (done) => {
    console.log(done.model, done.cost); // save to the conversation for share links
  });
}
```

`streamTutorReply` yields events instead (`start`, `text`, `fallback`, `done`) if the app needs to show which model answered. `generateTutorReply` returns the whole reply at once.

Imports come from the module that owns them (there's no barrel file):

| Import path | Exports |
|---|---|
| `@andy-portfolio/ai-tutor` | `streamTutorReply`, `generateTutorReply`, `tutorTextResponse`, `TutorUnavailableError`, request/event types |
| `@andy-portfolio/ai-tutor/postgres-budget` | `PostgresBudgetStore`, `ensureBudgetTable`, `BUDGET_TABLE_SQL` |
| `@andy-portfolio/ai-tutor/budget` | `BudgetStore`, `MemoryBudgetStore`, `DEFAULT_CAPS`, `currentPeriod` |
| `@andy-portfolio/ai-tutor/prompts` | `CourseContext`, `buildSystemPrompt`, `MODEL_ADDENDA` |
| `@andy-portfolio/ai-tutor/models` | `MODELS`, `ROUTES`, `ModelKey`, `ModelProfile` |
| `@andy-portfolio/ai-tutor/route` | `classifyRequest`, `looksLikeCode` |

## How a message is routed

| Message | Order tried |
|---|---|
| General question | GPT-6 Luna (Neon) → Claude Haiku 5.5 (Neon) → DeepSeek V4.1 Flash (OpenRouter) → GLM 5.3 Flash (OpenRouter) |
| Pasted code or mentions an assignment | Claude Haiku 5.5 (Neon) → GPT-6 Luna (Neon) → DeepSeek → GLM |

The tutor moves to the next model when the current one:

- is over its monthly spend cap (`DEFAULT_CAPS`: Neon $4, OpenRouter $5)
- errors or is rate limited (Neon allows roughly 33 answers a minute per model)
- sends no text within 10 seconds (`firstTokenTimeoutMs`)
- returns an empty reply

Fallback only happens before the first word reaches the student. Once a model has started answering, a pause longer than 15 seconds (`stallTimeoutMs`) or a reply longer than 60 seconds (`totalTimeoutMs`) stops the request with an error instead of switching models mid-answer. If every model fails, `tutorTextResponse` sends a short "try again or message your teacher" note; `streamTutorReply` throws `TutorUnavailableError`.

Only the last 12 messages are sent (`maxHistoryMessages`), so long chats don't grow in cost.

## Spend tracking

`PostgresBudgetStore` keeps one row per provider per month in a `tutor_spend` table on the Neon branch. Each reply adds its cost with a single atomic upsert, so serverless instances share one total and simultaneous replies never lose an increment. Create the table once before first use: run `ensureBudgetTable(budget.sql)` or the `BUDGET_TABLE_SQL` statement. It's already created on `student-submissions` / `main`.

To see this month's spend:

```sql
SELECT provider, period, usd, requests FROM tutor_spend ORDER BY period DESC, provider;
```

`MemoryBudgetStore` is available for local scripts. Its totals reset on restart.

## Prompts

`src/prompts.ts` builds every model's prompt from:

1. **Base rules**, shared by all models: hard rules (no full assignment solutions, under 150 words, code examples of 8 lines or fewer), how to explain, and how to handle pasted assignment code.
2. **The teacher's course**, as a `CourseContext`: notes, graded assignments, logistics. `src/course.ts` is the example course.
3. **A short per-model addendum** that fixes habits seen in testing: Haiku runs long, Luna skips examples, DeepSeek is loose with definitions, and GLM leaks code and uses emojis.

The base prompt comes first and stays identical between requests, so providers bill it at the cached rate (about 85–95% of input tokens in testing).

## Environment

| Variable | Where | Source |
|---|---|---|
| `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN` | `packages/ai-tutor/.env.local` | `neon link` / `neon deploy` (project `student-submissions`, branch `main`) |
| `DATABASE_URL` | `packages/ai-tutor/.env.local` | Same `neon link` / `neon env pull` |
| `OPENROUTER_API_KEY` | repo root `.env.local` | OpenRouter dashboard |

## Tests

`timeouts` runs offline against AI SDK mock models. The others call the real providers and cost a few cents at most.

```bash
bun run --filter=@andy-portfolio/ai-tutor timeouts        # mid-reply stall and total limits; no handover once text has started
bun run --filter=@andy-portfolio/ai-tutor fallbacks       # routing + every fallback trigger
bun run --filter=@andy-portfolio/ai-tutor budget          # Postgres spend store; test rows are deleted afterwards
bun run --filter=@andy-portfolio/ai-tutor conversations   # 4 scripted student chats per model, rule checks
bun run --filter=@andy-portfolio/ai-tutor typecheck
```

`conversations` writes full transcripts to `results/conversations.md` (gitignored). Pass a word to run only matching models, e.g. `conversations glm`.

## Prices

Prices in `src/models.ts` were checked on 2026-11-16. Recorded OpenRouter costs come from its billing data; Neon costs are list price × tokens.
