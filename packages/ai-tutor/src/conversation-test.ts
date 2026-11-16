// Realistic test through the production tutor module: the full system prompt
// and multi-turn student chats, replayed per model (and per prompt variant),
// with automatic checks for the tutoring rules.
// Run: bun run --filter=@andy-portfolio/ai-tutor conversations [filter]
import { mkdir, writeFile } from "node:fs/promises";
import type { ModelMessage } from "ai";
import { CONVERSATIONS, type Conversation } from "./conversations.ts";
import { EXAMPLE_COURSE } from "./course.ts";
import type { ModelKey } from "./models.ts";
import type { AddendumKey } from "./prompts.ts";
import { generateTutorReply, type TutorReply } from "./tutor.ts";

interface Variant {
  label: string;
  model: ModelKey;
  /** undefined = the model's production addendum; null = base prompt only. */
  addendum?: AddendumKey | null;
  runs: number;
}

const VARIANTS: Variant[] = [
  { label: "glm / base prompt only", model: "glm", addendum: null, runs: 2 },
  { label: "glm (production prompt)", model: "glm", runs: 2 },
  { label: "luna (production prompt)", model: "luna", runs: 1 },
  { label: "haiku (production prompt)", model: "haiku", runs: 1 },
  { label: "deepseek (production prompt)", model: "deepseek", runs: 1 },
];

interface Checks {
  words: number;
  emojis: number;
  /** Longest run of code lines in the reply (fenced or not). */
  codeLines: number;
  /** Homework chats only: 2+ lines of non-template code reusing the student's own names. */
  leak: boolean;
}

const EMOJI = /\p{Extended_Pictographic}/gu;

const CODE_LINE =
  /[;{}]\s*$|=>|\b(function|const|let|return|if|for|try|catch|await)\b/;

const TEMPLATE_MARKERS = /\.\.\.|\?\?\?|__+|\/\/ *(your|what|todo|fill|\?)/i;

/** Markdown list items ("- foo", "1. foo") look like code to CODE_LINE but are prose. */
const LIST_ITEM = /^[-*]\s|^\d+\.\s/;

const WHITESPACE = /\s+/;

/** All code in a reply: fenced blocks plus runs of unfenced code-like lines. */
function codeSegments(text: string): string[] {
  const segments = [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(
    (m) => m[1] ?? ""
  );

  const unfenced = text.replace(/```[\s\S]*?```/g, "");
  let run: string[] = [];

  for (const line of [...unfenced.split("\n"), ""]) {
    if (line.trim() && CODE_LINE.test(line) && !LIST_ITEM.test(line.trim())) {
      run.push(line);
    } else {
      if (run.length >= 2) {
        segments.push(run.join("\n"));
      }

      run = [];
    }
  }

  return segments;
}

const lineCount = (code: string) =>
  code.split("\n").filter((l) => l.trim()).length;

function check(reply: string, conversation: Conversation): Checks {
  const prose = reply.replace(/```[\s\S]*?```/g, "");
  const segments = codeSegments(reply);
  const names = conversation.studentIdentifiers ?? [];

  const leak = segments.some(
    (code) =>
      lineCount(code) >= 2 &&
      !TEMPLATE_MARKERS.test(code) &&
      names.some((name) => code.includes(name))
  );

  return {
    words: prose.split(WHITESPACE).filter(Boolean).length,
    emojis: (reply.match(EMOJI) ?? []).length,
    codeLines: Math.max(0, ...segments.map(lineCount)),
    leak: Boolean(conversation.homework) && leak,
  };
}

interface TurnResult {
  student: string;
  reply: TutorReply;
  checks: Checks;
}

async function runConversation(
  variant: Variant,
  conversation: Conversation
): Promise<TurnResult[]> {
  const messages: ModelMessage[] = [];
  const results: TurnResult[] = [];

  for (const student of conversation.turns) {
    messages.push({ role: "user", content: student });

    // biome-ignore lint/performance/noAwaitInLoops: each turn must include the previous reply in its history.
    const reply = await generateTutorReply({
      course: EXAMPLE_COURSE,
      messages,
      chain: [variant.model],
      addendum: variant.addendum,
      firstTokenTimeoutMs: 30_000,
    });

    messages.push({ role: "assistant", content: reply.text });
    results.push({ student, reply, checks: check(reply.text, conversation) });
  }

  return results;
}

async function runVariant(variant: Variant) {
  const runs = await Promise.all(
    Array.from({ length: variant.runs }, () =>
      Promise.all(
        CONVERSATIONS.map(async (conversation) => ({
          conversation,
          turns: await runConversation(variant, conversation),
        }))
      )
    )
  );

  return runs.flat();
}

const [, , filter] = process.argv;

const selected = filter
  ? VARIANTS.filter((v) => v.label.includes(filter))
  : VARIANTS;

if (selected.length === 0) {
  console.error(
    `No variant matches "${filter}". Options: ${VARIANTS.map((v) => v.label).join(", ")}`
  );
  process.exit(1);
}

/**
 * Broken runs fail the command: a provider error, or a reply cut off at the
 * token limit. Word counts, emojis and leaks are scores for comparing models,
 * reported in the table rather than failing it.
 */
let failures = 0;

const settled = await Promise.allSettled(selected.map(runVariant));

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const avg = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0);
const rows: string[] = [];
let markdown = `# Tutor conversation test\n\nRun: ${new Date().toISOString()}\n\n`;

settled.forEach((result, i) => {
  const variant = selected[i];

  if (!variant) {
    return;
  }

  if (result.status === "rejected") {
    const msg =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);

    failures += 1;
    rows.push(`✗ ${variant.label}: ${msg}`);
    markdown += `## ${variant.label}\n\nFAILED: ${msg}\n\n`;

    return;
  }

  const turns = result.value.flatMap((c) => c.turns);

  const cutOff = turns.filter(
    (t) => t.reply.done.finishReason === "length"
  ).length;

  failures += cutOff;

  const homeworkTurns = result.value
    .filter((c) => c.conversation.homework)
    .flatMap((c) => c.turns);

  const cost = avg(turns.map((t) => t.reply.done.cost));
  rows.push(
    [
      `${variant.label.padEnd(30)}`,
      `${turns.length} turns`,
      `avg ${Math.round(avg(turns.map((t) => t.reply.done.ms)))}ms`,
      `$${cost.toFixed(6)}/turn → ${Math.floor(5 / cost).toLocaleString()} per $5`,
      `avg ${Math.round(avg(turns.map((t) => t.checks.words)))} words`,
      `${turns.filter((t) => t.checks.words > 150).length} over 150w`,
      `${sum(turns.map((t) => t.checks.emojis))} emojis`,
      `leaks ${homeworkTurns.filter((t) => t.checks.leak).length}/${homeworkTurns.length}`,
      `cut off ${cutOff}`,
    ].join(" | ")
  );

  markdown += `## ${variant.label}\n\n`;

  for (const { conversation, turns: convTurns } of result.value) {
    markdown += `### ${conversation.id}\n\n_Expected: ${conversation.expectation}_\n\n`;

    for (const t of convTurns) {
      const d = t.reply.done;
      const c = t.checks;
      markdown += `**Student:** ${t.student.replaceAll("\n", "  \n")}\n\n**Tutor** (${d.ms}ms, out ${d.usage.output}/reasoning ${d.usage.reasoning}, ${c.words} words, code ${c.codeLines} lines${c.leak ? ", ⚠ LEAK" : ""}${c.emojis ? `, ${c.emojis} emojis` : ""}):\n\n${t.reply.text}\n\n---\n\n`;
    }
  }
});

await mkdir(new URL("../results/", import.meta.url), { recursive: true });

const outFile = new URL("../results/conversations.md", import.meta.url);

await writeFile(outFile, markdown);

console.log(rows.join("\n"));

console.log(`\nTranscripts: ${decodeURIComponent(outFile.pathname)}`);

if (failures) {
  console.error(`${failures} failed run(s) or cut-off repl(ies)`);
}

process.exitCode = failures ? 1 : 0;
