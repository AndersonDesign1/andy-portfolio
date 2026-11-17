import { createHash } from "node:crypto";

import type { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import { z } from "zod";

/**
 * Per-visitor limits for the public tutor, shared by every serverless
 * instance through Postgres. Visitors are identified by a salted hash of their
 * IP, so no raw address is stored. Old windows are cheap rows; prune them with
 * `DELETE FROM tutor_rate_limit WHERE window_start < now() - interval '2 days'`.
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

const countRows = z.array(z.object({ count: z.number().int() }));

let tableReady: Promise<unknown> | undefined;

export const visitorId = (ip: string): string =>
  createHash("sha256").update(`andy-tutor:${ip}`).digest("hex").slice(0, 32);

/** Create the table once per instance; a failed attempt is retried next time. */
const ensureTable = async (store: PostgresBudgetStore) => {
  if (tableReady) {
    return tableReady;
  }

  tableReady = store.sql.query(RATE_LIMIT_TABLE_SQL);

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
