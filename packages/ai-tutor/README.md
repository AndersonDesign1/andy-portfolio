# @andy-portfolio/ai-tutor

The AI layer for the student tutor: system prompts, model routing, fallbacks and spend caps. There's no UI here yet; an app imports `streamTutorReply` or `tutorTextResponse`.

## Use it

```ts
import { tutorTextResponse } from "@andy-portfolio/ai-tutor";
import { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import type { CourseContext } from "@andy-portfolio/ai-tutor/prompts";

// Each teacher's course; see src/course.ts for a full example.
const course: CourseContext = {
  tutorName: "Andy's Tutor",
  teacherName: "Andy",
  courseName: "Andy's beginner JavaScript course",
  audience: "beginners, many learning on a phone",
  language: "JavaScript",
  notes: "### Week 1: Values, variables and types\n- ...",
  assignments: "1. Tip calculator (Week 1-2): ...",
  logistics: "- Office hours: Tuesdays and Thursdays, 6-7pm WAT",
};

const budget = new PostgresBudgetStore(); // reads DATABASE_URL

export async function POST(request: Request) {
  const { messages } = await request.json(); // [{ role: "user" | "assistant", content }]

  return tutorTextResponse({ course, messages, budget }, (done) => {
    console.log(done.model, done.cost); // save to the conversation for share links
  });
}
```

`streamTutorReply` yields events instead (`start`, `text`, `fallback`, `done`) if the app needs to show which model answered. `generateTutorReply` returns the whole reply at once. If the student closes the page, cancelling the `tutorTextResponse` body aborts the provider call and tries no further models.

Imports come from the module that owns them (there's no barrel file):

| Import path                                | Exports                                                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `@andy-portfolio/ai-tutor`                 | `streamTutorReply`, `generateTutorReply`, `tutorTextResponse`, `TutorUnavailableError`, request/event types |
| `@andy-portfolio/ai-tutor/postgres-budget` | `PostgresBudgetStore`, `ensureBudgetTable`, `BUDGET_TABLE_SQL`                                              |
| `@andy-portfolio/ai-tutor/budget`          | `BudgetStore`, `MemoryBudgetStore`, `DEFAULT_CAPS`, `currentPeriod`                                         |
| `@andy-portfolio/ai-tutor/prompts`         | `CourseContext`, `buildSystemPrompt`, `MODEL_ADDENDA`                                                       |
| `@andy-portfolio/ai-tutor/models`          | `MODELS`, `ROUTES`, `ModelKey`, `ModelProfile`                                                              |
| `@andy-portfolio/ai-tutor/route`           | `classifyRequest`, `looksLikeCode`                                                                          |

## How a message is routed

| Message                               | Order tried                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| General question                      | GPT-6 Luna (Neon) → Claude Haiku 5.5 (Neon) → DeepSeek V4.1 Flash (OpenRouter) → GLM 5.3 Flash (OpenRouter) |
| Pasted code or mentions an assignment | Claude Haiku 5.5 (Neon) → GPT-6 Luna (Neon) → DeepSeek → GLM                                                |

"Pasted code" means a fenced code block or at least two lines with code-only syntax (`x = 1`, `print(x)`, `if (`, `for i in range(3):`, a line ending in `;` or `{`). Prose that merely uses words like "if" or "return" stays on the general route.

The route looks at the student's last 3 messages, so a follow-up in a homework chat ("what does handle errors mean?") stays on the homework route even with no code in it.

The tutor moves to the next model when the current one:

- can't fit its worst-case cost under the monthly cap (`DEFAULT_CAPS`: Neon $4, OpenRouter $5); caps apply **only when a `budget` store is passed**
- errors or is rate limited (Neon allows roughly 33 answers a minute per model)
- sends no answer text within 10 seconds (`firstTokenTimeoutMs`); hidden thinking counts toward this wait, so with the defaults a model that is still thinking at 10 seconds is skipped. If `firstTokenTimeoutMs` is set above `stallTimeoutMs` (15 seconds), thinking that pauses longer than `stallTimeoutMs` is also skipped
- returns an empty reply

Fallback only happens before the first word reaches the student. Once a model has started answering, a pause longer than 15 seconds (`stallTimeoutMs`) or a reply longer than 60 seconds (`totalTimeoutMs`) stops the request with an error instead of switching models mid-answer. If every model fails, `tutorTextResponse` sends a short "try again or message your teacher" note; `streamTutorReply` throws `TutorUnavailableError`.

By default only the most recent 12 messages are sent (`maxHistoryMessages`), so long chats don't grow in cost. `0` sends just the current question.

## Spend tracking

Caps are enforced only when the caller passes a `budget` store. Without one, nothing is checked or recorded.

Before each provider call the tutor **reserves** that attempt's worst-case cost (full prompt uncached plus the whole output budget). The reservation is a single atomic statement that only succeeds if the total stays under the cap, so simultaneous replies can't overshoot it. Afterwards it **settles** to the real cost:

| Outcome                                   | Settled to                                                            |
| ----------------------------------------- | --------------------------------------------------------------------- |
| Answered, or finished with an empty reply | real cost (OpenRouter's billed figure, otherwise list price × tokens) |
| Error or rate limit before any output     | 0 (reservation released)                                              |
| Timeout, or failure after text was sent   | the full reservation (tokens were probably billed)                    |

If the store can't be reached when reserving, that model is skipped (fail closed), so a database outage can't turn into unbounded spend. If settling fails after the student already has the reply, the error is logged and the reply still completes; the leftover reservation keeps the cap conservative.

`PostgresBudgetStore` keeps one row per provider per month in a `tutor_spend` table on the Neon branch. Create the table once before first use: run `ensureBudgetTable(budget.sql)` or the `BUDGET_TABLE_SQL` statement. It's already created on `student-submissions` / `main`.

To see this month's spend:

```sql
SELECT provider, period, usd, requests FROM tutor_spend ORDER BY period DESC, provider;
```

`MemoryBudgetStore` is available for local scripts. Its totals reset on restart.

## Prompts

`src/prompts.ts` builds every model's prompt from:

1. **Base rules**, shared by all models:
   - **Hard rules:** no full assignment solutions; replies under `maxWords` (default 150) unless the student asks for more detail; code examples of 8 lines or fewer.
   - **How to explain.**
   - **How to handle pasted assignment code.**
2. **The teacher's course**, as a `CourseContext`: notes, graded assignments, logistics. It's wrapped in tags and marked as reference material, with a closing reminder that the hard rules win, so text inside the course material can't override them. `src/course.ts` is the example course. Three optional fields adapt the prompt to a non-class deployment (the /ai page on the website uses all three, in `apps/web/src/lib/tutor-course.ts`):
   - `intro` replaces the opening "study assistant for <course>" paragraph, e.g. to present the tutor as the teacher's assistant on a personal site.
   - `maxWords` sets the reply-length rule (default 150). Raise it where answers need to teach, not just remind.
   - `explainStyle` is appended to "How to explain": the teacher's own way of explaining (definition, analogy, numbered steps, takeaway).
3. **A short per-model addendum** that fixes habits seen in testing: Haiku runs long, Luna skips examples, DeepSeek is loose with definitions, and GLM leaks code and uses emojis.

The base prompt comes first and stays identical between requests, so providers bill it at the cached rate (about 85–95% of input tokens in testing).

## Environment

The importing app (or its deployment) must provide these. The package doesn't load any `.env` file itself; only its own test scripts read `packages/ai-tutor/.env.local` and the root `.env.local`.

| Variable                                            | Needed for            | Local source for the tests                                                                                      |
| --------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN` | Luna and Haiku        | `packages/ai-tutor/.env.local`, from `neon link` / `neon deploy` (project `student-submissions`, branch `main`) |
| `DATABASE_URL`                                      | `PostgresBudgetStore` | same file, from `neon link` / `neon env pull`                                                                   |
| `OPENROUTER_API_KEY`                                | DeepSeek and GLM      | repo root `.env.local`                                                                                          |

## Tests

`unit` and `timeouts` run offline against AI SDK mock models. The others call the real providers and cost a few cents at most. Every script exits non-zero on failure.

```bash
bun run --filter=@andy-portfolio/ai-tutor unit            # routing, empty / rate-limit / timeout fallbacks, spend, history, cancel
bun run --filter=@andy-portfolio/ai-tutor timeouts        # mid-reply stall and total limits; no handover once text has started
bun run --filter=@andy-portfolio/ai-tutor fallbacks       # live routing, budget, provider-down and first-word timeout fallbacks
bun run --filter=@andy-portfolio/ai-tutor budget          # Postgres reservations under concurrency; test rows are deleted afterwards
bun run --filter=@andy-portfolio/ai-tutor conversations   # 4 scripted student chats per model, scored on rules
bun run --filter=@andy-portfolio/ai-tutor scope           # site assistant's topic limit: 24 off-topic / tech / mixed messages per model
bun run --filter=@andy-portfolio/ai-tutor typecheck
```

`conversations` writes full transcripts to `results/conversations.md` (gitignored). Pass a word to run only matching models, e.g. `conversations glm`; an unknown word fails instead of running nothing. A provider error or a reply cut off at the token limit fails the run. Word counts, emojis and leaks are scores for comparing models, not pass/fail checks.

`scope` uses the site's real course (`apps/web/src/lib/tutor-course.ts`). Off-topic messages pass only if the reply is exactly the refusal sentence; tech questions fail if refused. Replies go to `results/scope.md`. `scope deepseek,glm` limits the models.

## Topic limit

`CourseContext.scope` (`{ topics, refusal }`) adds a topic limit as the first hard rule in the prompt: messages with nothing on topic should get exactly `refusal`, even under "just this once" or role-play pressure; a mixed message should get only its on-topic part; greetings and questions about the teacher stay allowed. It is a model instruction, not a filter: replies stream unchanged, so a model can still slip. `scope` (above) measures how often. Without `scope`, the prompt is unchanged (off-topic questions get a short answer and a nudge back). The /ai site assistant sets it; the class tutor does not.

## Prices

Prices in `src/models.ts` were checked on 2026-11-16. Recorded OpenRouter costs come from its billing data; Neon costs are list price × tokens.
