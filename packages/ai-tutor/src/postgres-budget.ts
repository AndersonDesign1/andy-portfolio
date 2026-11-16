import { neon } from "@neondatabase/serverless";
import type { BudgetStore } from "./budget.ts";
import type { Provider } from "./models.ts";

type Sql = ReturnType<typeof neon>;

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
 * `add` is a single atomic upsert, so concurrent replies never lose an increment.
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
    const rows = (await this.#sql`
      SELECT usd FROM tutor_spend WHERE provider = ${provider} AND period = ${period}
    `) as { usd: string }[];
    return rows[0] ? Number(rows[0].usd) : 0;
  }

  async add(provider: Provider, period: string, usd: number): Promise<void> {
    await this.#sql`
      INSERT INTO tutor_spend (provider, period, usd, requests)
      VALUES (${provider}, ${period}, ${usd}, 1)
      ON CONFLICT (provider, period) DO UPDATE
      SET usd = tutor_spend.usd + EXCLUDED.usd,
          requests = tutor_spend.requests + 1,
          updated_at = now()
    `;
  }
}
