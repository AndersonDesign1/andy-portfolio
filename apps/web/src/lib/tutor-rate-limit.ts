import { createHmac, randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";

import type { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import { z } from "zod";

/**
 * Per-visitor limits for the public tutor, shared by every serverless
 * instance through Postgres. Visitors are identified by an HMAC of their IP
 * keyed with a server secret, so no raw (or reversible) address is stored.
 * Expired windows are pruned on a small share of requests.
 */
export const RATE_LIMITS = [
  { max: 8, name: "minute", seconds: 60 },
  { max: 60, name: "hour", seconds: 3600 },
] as const;

const RATE_LIMIT_TABLE_SQL = `CREATE TABLE IF NOT EXISTS tutor_rate_limit (
  visitor text NOT NULL,
  window_name text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (visitor, window_name, window_start)
)`;

/** One row per counted request, so a retried increment can't count it twice. */
const CLAIM_TABLE_SQL = `CREATE TABLE IF NOT EXISTS tutor_rate_limit_claim (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
)`;

/** Lets the sampled cleanup delete old claims without scanning the table. */
const CLAIM_INDEX_SQL =
  "CREATE INDEX IF NOT EXISTS tutor_rate_limit_claim_created_at ON tutor_rate_limit_claim (created_at)";

const RATE_LIMIT_INDEX_SQL =
  "CREATE INDEX IF NOT EXISTS tutor_rate_limit_window_start ON tutor_rate_limit (window_start)";

/** Rows older than the longest window are dead; about 1 in 50 requests deletes them. */
const PRUNE_SQL =
  "DELETE FROM tutor_rate_limit WHERE window_start < now() - interval '2 hours'";

const PRUNE_CLAIMS_SQL =
  "DELETE FROM tutor_rate_limit_claim WHERE created_at < now() - interval '1 hour'";

const PRUNE_SHARE = 0.02;

let tableReady: Promise<unknown> | undefined;

/** `secret` is any server-only value (the route passes DATABASE_URL). */
export const visitorId = (ip: string, secret: string): string =>
  createHmac("sha256", secret)
    .update(`andy-tutor:${ip}`)
    .digest("hex")
    .slice(0, 32);

const createTable = async (store: PostgresBudgetStore) => {
  await store.sql.query(RATE_LIMIT_TABLE_SQL);
  await store.sql.query(RATE_LIMIT_INDEX_SQL);
  await store.sql.query(CLAIM_TABLE_SQL);
  await store.sql.query(CLAIM_INDEX_SQL);
};

/** Create the table once per instance; a failed attempt is retried next time. */
const ensureTable = async (store: PostgresBudgetStore) => {
  if (tableReady) {
    return tableReady;
  }

  tableReady = createTable(store);

  try {
    await tableReady;
  } catch (error) {
    tableReady = undefined;
    throw error;
  }
};

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Neon's HTTP driver occasionally drops a request ("fetch failed"); one retry covers it. */
const RETRY_DELAY_MS = 300;

/**
 * Counts one request in every window, in ONE statement (all or nothing), and
 * only if its request id ($4) hasn't been claimed yet. If a commit's response
 * is lost and the retry runs again, the claim already exists: nothing is
 * incremented and the current counts are read back instead.
 */
const INCREMENT_SQL = `WITH claim AS (
  INSERT INTO tutor_rate_limit_claim (id) VALUES ($4::uuid)
  ON CONFLICT (id) DO NOTHING
  RETURNING id
), bumped AS (
  INSERT INTO tutor_rate_limit (visitor, window_name, window_start, count)
  SELECT $1, w.window_name, w.window_start, 1
  FROM unnest($2::text[], $3::timestamptz[]) AS w(window_name, window_start)
  WHERE EXISTS (SELECT 1 FROM claim)
  ON CONFLICT (visitor, window_name, window_start) DO UPDATE
  SET count = tutor_rate_limit.count + 1
  RETURNING window_name, count
)
SELECT window_name, count FROM bumped
UNION ALL
SELECT r.window_name, r.count
FROM tutor_rate_limit r
JOIN unnest($2::text[], $3::timestamptz[]) AS w(window_name, window_start)
  ON r.window_name = w.window_name AND r.window_start = w.window_start
WHERE r.visitor = $1 AND NOT EXISTS (SELECT 1 FROM claim)`;

const windowRows = z.array(
  z.object({ count: z.number().int(), window_name: z.string() })
);

/** Runs `operation`, and once more after a short pause if it throws. */
const withRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch {
    await sleep(RETRY_DELAY_MS);

    return operation();
  }
};

/**
 * Count this request in every window and report whether any limit is
 * exceeded. A second failure throws; routes turn that into a 503 rather than
 * letting it surface as an HTML 500.
 */
export const checkRateLimit = async (
  store: PostgresBudgetStore,
  visitor: string
): Promise<RateLimitResult> => {
  const { sql } = store;
  await withRetry(() => ensureTable(store));

  const now = Date.now();

  // Best effort: a failed cleanup must not block the request.
  if (Math.random() < PRUNE_SHARE) {
    try {
      await sql.query(PRUNE_SQL);
      await sql.query(PRUNE_CLAIMS_SQL);
    } catch {
      // Retried on a later request.
    }
  }

  const windows = RATE_LIMITS.map((limit) => {
    const windowMs = limit.seconds * 1000;
    const start = Math.floor(now / windowMs) * windowMs;

    return {
      ...limit,
      resetsIn: Math.ceil((start + windowMs - now) / 1000),
      start,
    };
  });

  // Fixed before the first attempt, so a retry reuses it.
  const requestId = randomUUID();

  const rows = windowRows.parse(
    await withRetry(() =>
      sql.query(INCREMENT_SQL, [
        visitor,
        windows.map((w) => w.name),
        windows.map((w) => new Date(w.start).toISOString()),
        requestId,
      ])
    )
  );

  const blocked = windows.filter((w) => {
    const count = rows.find((row) => row.window_name === w.name)?.count ?? 0;

    return count > w.max;
  });

  return {
    allowed: blocked.length === 0,
    retryAfterSeconds: Math.max(0, ...blocked.map((w) => w.resetsIn)),
  };
};
