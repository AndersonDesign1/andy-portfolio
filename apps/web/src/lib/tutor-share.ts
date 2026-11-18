import { createHash, randomBytes } from "node:crypto";

import type { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import { z } from "zod";

import { chatMessageSchema } from "@/lib/tutor-messages";
import type { ChatMessageInput } from "@/lib/tutor-messages";

/**
 * Shared /ai chats. A share is a snapshot of question/answer pairs that lives
 * for 24 hours. Every answer in it must be one the tutor really sent: the
 * route records a fingerprint of each finished reply (bound to its question),
 * so an edited "Andy's AI said…" transcript can't be shared from this site.
 */
export const SHARE_TTL_HOURS = 24;

/**
 * Fingerprints outlive shares, so a chat continued from a share (up to a day
 * old) can still be shared again.
 */
const REPLY_TTL_HOURS = 48;

/** Pairs in one share: 20 questions and their answers. */
export const MAX_SHARED_MESSAGES = 40;

const SHARE_ID_PATTERN = /^[\w-]{12}$/u;

const TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS tutor_reply (
  hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
)`,
  `CREATE TABLE IF NOT EXISTS tutor_share (
  id text PRIMARY KEY,
  messages jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
)`,
];

/** Let the sampled cleanup find old rows without scanning; created after their tables. */
const INDEXES_SQL = [
  "CREATE INDEX IF NOT EXISTS tutor_reply_created_at ON tutor_reply (created_at)",
  "CREATE INDEX IF NOT EXISTS tutor_share_expires_at ON tutor_share (expires_at)",
];

const PRUNE_SQL = [
  "DELETE FROM tutor_share WHERE expires_at < now()",
  `DELETE FROM tutor_reply WHERE created_at < now() - interval '${REPLY_TTL_HOURS} hours'`,
];

/** About 1 in 20 writes clears out expired rows. */
const PRUNE_SHARE = 0.05;

let tablesReady: Promise<unknown> | undefined;

const runAll = (store: PostgresBudgetStore, statements: string[]) =>
  Promise.all(statements.map((statement) => store.sql.query(statement)));

/** Create the tables once per instance; a failed attempt is retried next time. */
const ensureTables = async (store: PostgresBudgetStore) => {
  tablesReady ??= (async () => {
    await runAll(store, TABLES_SQL);
    await runAll(store, INDEXES_SQL);
  })();

  try {
    await tablesReady;
  } catch (error) {
    tablesReady = undefined;
    throw error;
  }
};

const maybePrune = async (store: PostgresBudgetStore) => {
  if (Math.random() >= PRUNE_SHARE) {
    return;
  }

  try {
    await runAll(store, PRUNE_SQL);
  } catch {
    // Best effort; a later write retries.
  }
};

/**
 * Both sides trimmed, as the request schema trims them, and JSON-encoded so
 * the boundary between question and reply can't be shifted (a delimiter
 * character could be smuggled into either side).
 */
export const replyHash = (question: string, reply: string): string =>
  createHash("sha256")
    .update(JSON.stringify([question.trim(), reply.trim()]))
    .digest("hex");

/** Remembers that the tutor sent `reply` to `question`. Never throws. */
export const recordReply = async (
  store: PostgresBudgetStore,
  question: string,
  reply: string
): Promise<void> => {
  if (!reply.trim()) {
    return;
  }

  try {
    await ensureTables(store);
    await store.sql.query(
      // The same answer to the same question again restarts its clock, so the
      // sampled cleanup can't drop a fingerprint that was just delivered.
      "INSERT INTO tutor_reply (hash) VALUES ($1) ON CONFLICT (hash) DO UPDATE SET created_at = now()",
      [replyHash(question, reply)]
    );
    await maybePrune(store);
  } catch (error) {
    console.error("[tutor] couldn't record reply for sharing", error);
  }
};

/**
 * Wraps the tutor's streamed reply: passes every byte through unchanged and,
 * once the stream finishes normally (not cancelled, not errored) with a
 * model's answer (`answered`, not the "couldn't answer" note), records the
 * full text. The record is written before the stream closes, so the page can
 * share the answer as soon as it has it.
 */
export const recordingReply = (
  response: Response,
  store: PostgresBudgetStore,
  question: string,
  answered: () => boolean
): Response => {
  if (!response.body) {
    return response;
  }

  const decoder = new TextDecoder();
  let text = "";

  const recorder = new TransformStream<Uint8Array, Uint8Array>({
    async flush() {
      text += decoder.decode();

      if (answered()) {
        await recordReply(store, question, text);
      }
    },
    transform(chunk, controller) {
      text += decoder.decode(chunk, { stream: true });
      controller.enqueue(chunk);
    },
  });

  return new Response(response.body.pipeThrough(recorder), {
    headers: response.headers,
    status: response.status,
  });
};

/** Alternating question/answer pairs, starting with a question. */
export const shareRequestSchema = z.strictObject({
  messages: z
    .array(chatMessageSchema)
    .min(2)
    .max(MAX_SHARED_MESSAGES)
    .refine(
      (messages) =>
        messages.length % 2 === 0 &&
        messages.every(
          (message, index) =>
            message.role === (index % 2 === 0 ? "user" : "assistant")
        ),
      { message: "Messages must be question and answer pairs" }
    ),
});

const hashRows = z.array(z.object({ hash: z.string() }));

/**
 * Only the question/answer pairs whose answer the tutor recorded. Anything
 * else is dropped rather than failing the whole share: a "couldn't answer"
 * note or an edited answer never verifies, so it can't be shared, but the
 * real answers around it still can.
 */
export const verifiedPairs = async (
  store: PostgresBudgetStore,
  messages: ChatMessageInput[]
): Promise<ChatMessageInput[]> => {
  await ensureTables(store);

  const pairs = messages.flatMap((message, index) => {
    const question = messages[index - 1];

    return message.role === "assistant" && question
      ? [{ answer: message, question }]
      : [];
  });

  const hashes = pairs.map(({ answer, question }) =>
    replyHash(question.content, answer.content)
  );

  const found = new Set(
    hashRows
      .parse(
        await store.sql.query(
          "SELECT hash FROM tutor_reply WHERE hash = ANY($1::text[])",
          [hashes]
        )
      )
      .map((row) => row.hash)
  );

  return pairs.flatMap(({ answer, question }, index) =>
    found.has(hashes[index] ?? "") ? [question, answer] : []
  );
};

/** Saves the snapshot and returns its id. */
export const createShare = async (
  store: PostgresBudgetStore,
  messages: ChatMessageInput[]
): Promise<string> => {
  await ensureTables(store);

  const id = randomBytes(9).toString("base64url");

  await store.sql.query(
    `INSERT INTO tutor_share (id, messages, expires_at)
     VALUES ($1, $2::jsonb, now() + interval '${SHARE_TTL_HOURS} hours')`,
    [id, JSON.stringify(messages)]
  );
  await maybePrune(store);

  return id;
};

const shareRows = z.array(
  z.object({
    expires_at: z
      .union([z.string(), z.date()])
      .transform((value) => new Date(value).toISOString()),
    messages: z.array(chatMessageSchema),
  })
);

export interface SharedChat {
  messages: ChatMessageInput[];
  expiresAt: string;
}

/** The share if it exists and hasn't expired; undefined otherwise. */
export const getShare = async (
  store: PostgresBudgetStore,
  id: string
): Promise<SharedChat | undefined> => {
  if (!SHARE_ID_PATTERN.test(id)) {
    return undefined;
  }

  await ensureTables(store);

  const [row] = shareRows.parse(
    await store.sql.query(
      "SELECT messages, expires_at FROM tutor_share WHERE id = $1 AND expires_at > now()",
      [id]
    )
  );

  return row && { expiresAt: row.expires_at, messages: row.messages };
};
