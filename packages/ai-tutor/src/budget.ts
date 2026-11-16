import type { Provider } from "./models.ts";

/** Monthly spend caps in USD. A provider at or over its cap is skipped. */
export type BudgetCaps = Record<Provider, number>;

/**
 * Defaults: Neon at $4/month spreads the $50 credit over its 12-month validity;
 * OpenRouter at $5/month is the agreed ceiling.
 */
export const DEFAULT_CAPS: BudgetCaps = { neon: 4, openrouter: 5 };

/**
 * Where spend is recorded. Serverless instances don't share memory, so
 * production uses PostgresBudgetStore (one row per provider per month).
 */
export interface BudgetStore {
  spent: (provider: Provider, period: string) => Promise<number>;
  add: (provider: Provider, period: string, usd: number) => Promise<void>;
}

export class MemoryBudgetStore implements BudgetStore {
  readonly #totals = new Map<string, number>();

  spent(provider: Provider, period: string): Promise<number> {
    return Promise.resolve(this.#totals.get(`${provider}:${period}`) ?? 0);
  }

  add(provider: Provider, period: string, usd: number): Promise<void> {
    const key = `${provider}:${period}`;
    this.#totals.set(key, (this.#totals.get(key) ?? 0) + usd);

    return Promise.resolve();
  }
}

/** Calendar month in UTC, e.g. "2026-11". */
export function currentPeriod(now = new Date()): string {
  return now.toISOString().slice(0, 7);
}
