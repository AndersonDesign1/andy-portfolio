import { neon } from "@neondatabase/serverless";
import { z } from "zod";

import { assertUsdAmounts, type BudgetStore } from "./budget.ts";
import type { Provider } from "./models.ts";

type Sql = ReturnType<typeof neon>;

/**
 * Postgres `numeric` arrives as a string to keep its precision. Reject anything
 * that is not a finite, non-negative amount: a NaN total would compare as
 * "under cap" and silently disable the budget.
 */
const usdColumn = z
  .string()
  .transform(Number)
  .pipe(z.number().finite().nonnegative());

const spendRows = z.array(z.object({ usd: usdColumn }));

/**
 * One row per provider per month. Additive table; safe to run more than once.
 * Run it once at deploy time (or call `ensureBudgetTable`) before using the store.
 */
export const BUDGET_TABLE_SQL = `CREATE TABLE IF NOT EXISTS tutor_spend (
  provider text NOT NULL,
  period text NOT NULL,
  usd numeric(12, 6) NOT NULL DEFAULT 0,
  requests integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider, period)
)`;

export async function ensureBudgetTable(sql: Sql): Promise<void> {
  await sql.query(BUDGET_TABLE_SQL);
}

/**
 * Spend totals in Neon Postgres, shared by every serverless instance.
 * Uses the HTTP driver, so each call is one round trip with no connection to manage.
 * Every write is a single statement, so concurrent replies serialize on the row lock.
 */
export class PostgresBudgetStore implements BudgetStore {
  readonly #sql: Sql;

  constructor(connectionString = process.env.DATABASE_URL) {
    if (!connectionString) {
      throw new Error(
        "PostgresBudgetStore needs DATABASE_URL (run `neon env pull` in packages/ai-tutor)"
      );
    }

    this.#sql = neon(connectionString);
  }

  get sql(): Sql {
    return this.#sql;
  }

  async spent(provider: Provider, period: string): Promise<number> {
    const rows = spendRows.parse(
      await this.#sql`
        SELECT usd FROM tutor_spend WHERE provider = ${provider} AND period = ${period}
      `
    );

    return rows[0]?.usd ?? 0;
  }

  /**
   * Insert-or-increment guarded by the cap in one statement. On conflict the
   * row is locked, so two reservations can never both fit into the last cents.
   * A first reservation larger than the cap is rejected before the query.
   */
  async reserve(
    provider: Provider,
    period: string,
    usd: number,
    cap: number
  ): Promise<boolean> {
    assertUsdAmounts({ usd, cap });

    if (usd > cap) {
      return false;
    }

    const rows = spendRows.parse(
      await this.#sql`
        INSERT INTO tutor_spend (provider, period, usd, requests)
        VALUES (${provider}, ${period}, ${usd}, 0)
        ON CONFLICT (provider, period) DO UPDATE
        SET usd = tutor_spend.usd + EXCLUDED.usd,
            updated_at = now()
        WHERE tutor_spend.usd + EXCLUDED.usd <= ${cap}
        RETURNING usd
      `
    );

    return rows.length > 0;
  }

  async settle(
    provider: Provider,
    period: string,
    reservedUsd: number,
    actualUsd: number
  ): Promise<void> {
    assertUsdAmounts({ reservedUsd, actualUsd });

    await this.#sql`
      UPDATE tutor_spend
      SET usd = GREATEST(usd + ${actualUsd - reservedUsd}, 0),
          requests = requests + 1,
          updated_at = now()
      WHERE provider = ${provider} AND period = ${period}
    `;
  }

  async add(provider: Provider, period: string, usd: number): Promise<void> {
    assertUsdAmounts({ usd });

    await this.#sql`
      INSERT INTO tutor_spend (provider, period, usd, requests)
      VALUES (${provider}, ${period}, ${usd}, 0)
      ON CONFLICT (provider, period) DO UPDATE
      SET usd = tutor_spend.usd + EXCLUDED.usd,
          updated_at = now()
    `;
  }
}
