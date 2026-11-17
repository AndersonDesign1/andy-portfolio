import { createHmac } from "node:crypto";

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

const RATE_LIMIT_INDEX_SQL =
  "CREATE INDEX IF NOT EXISTS tutor_rate_limit_window_start ON tutor_rate_limit (window_start)";

/** Rows older than the longest window are dead; about 1 in 50 requests deletes them. */
const PRUNE_SQL =
  "DELETE FROM tutor_rate_limit WHERE window_start < now() - interval '2 hours'";

const PRUNE_SHARE = 0.02;

const countRows = z.array(z.object({ count: z.number().int() }));

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

/**
 * Count this request in every window and report whether any limit is exceeded.
 * One atomic upsert per window, so concurrent requests can't slip past.
 */
export const checkRateLimit = async (
  store: PostgresBudgetStore,
  visitor: string
): Promise<{ allowed: boolean; retryAfterSeconds: number }> => {
  const { sql } = store;
  await ensureTable(store);

  const now = Date.now();

  // Best effort: a failed cleanup must not block the request.
  if (Math.random() < PRUNE_SHARE) {
    try {
      await sql.query(PRUNE_SQL);
    } catch {
      // Retried on a later request.
    }
  }

  const results = await Promise.all(
    RATE_LIMITS.map(async (limit) => {
      const windowMs = limit.seconds * 1000;
      const start = new Date(Math.floor(now / windowMs) * windowMs);

      const rows = countRows.parse(
        await sql`
          INSERT INTO tutor_rate_limit (visitor, window_name, window_start, count)
          VALUES (${visitor}, ${limit.name}, ${start.toISOString()}, 1)
          ON CONFLICT (visitor, window_name, window_start) DO UPDATE
          SET count = tutor_rate_limit.count + 1
          RETURNING count
        `
      );

      const count = rows[0]?.count ?? 0;
      const resetsIn = Math.ceil((start.getTime() + windowMs - now) / 1000);

      return { exceeded: count > limit.max, resetsIn };
    })
  );

  const blocked = results.filter((r) => r.exceeded);

  return {
    allowed: blocked.length === 0,
    retryAfterSeconds: Math.max(0, ...blocked.map((r) => r.resetsIn)),
  };
};
