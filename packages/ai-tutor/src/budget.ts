import type { Provider } from "./models.ts";

/** Monthly spend caps in USD. A provider that cannot fit a reservation is skipped. */
export type BudgetCaps = Record<Provider, number>;

/**
 * Defaults: Neon at $4/month spreads the $50 credit over its 12-month validity;
 * OpenRouter at $5/month is the agreed ceiling.
 */
export const DEFAULT_CAPS: BudgetCaps = { neon: 4, openrouter: 5 };

/**
 * Where spend is recorded. The tutor reserves an attempt's worst-case cost
 * before calling a provider and settles to the real cost afterwards, so
 * concurrent replies cannot overshoot a cap. Serverless instances don't share
 * memory, so production uses PostgresBudgetStore (one row per provider per month).
 */
export interface BudgetStore {
  /** Total recorded for the period, including open reservations. */
  spent: (provider: Provider, period: string) => Promise<number>;
  /**
   * Atomically add `usd` if the total stays at or under `cap`.
   * Returns false, changing nothing, when it would not fit.
   */
  reserve: (
    provider: Provider,
    period: string,
    usd: number,
    cap: number
  ) => Promise<boolean>;
  /** Replace a reservation with the real cost of the attempt (0 if nothing was billed). */
  settle: (
    provider: Provider,
    period: string,
    reservedUsd: number,
    actualUsd: number
  ) => Promise<void>;
  /** Unconditionally add spend (used to seed tests or record external charges). */
  add: (provider: Provider, period: string, usd: number) => Promise<void>;
}

/**
 * Throw unless every amount is a finite, non-negative number. A NaN or
 * negative value would otherwise slip past the `<= cap` comparison and either
 * bypass the cap or poison the stored total. Both stores call this before
 * changing anything; the tutor treats the throw as "skip this model".
 */
export function assertUsdAmounts(amounts: Record<string, number>): void {
  for (const [name, value] of Object.entries(amounts)) {
    if (!(Number.isFinite(value) && value >= 0)) {
      throw new RangeError(
        `${name} must be a finite, non-negative USD amount (got ${value})`
      );
    }
  }
}

export class MemoryBudgetStore implements BudgetStore {
  readonly #totals = new Map<string, number>();

  spent(provider: Provider, period: string): Promise<number> {
    return Promise.resolve(this.#totals.get(`${provider}:${period}`) ?? 0);
  }

  reserve(
    provider: Provider,
    period: string,
    usd: number,
    cap: number
  ): Promise<boolean> {
    assertUsdAmounts({ usd, cap });

    const key = `${provider}:${period}`;
    const next = (this.#totals.get(key) ?? 0) + usd;

    if (next > cap) {
      return Promise.resolve(false);
    }

    this.#totals.set(key, next);

    return Promise.resolve(true);
  }

  settle(
    provider: Provider,
    period: string,
    reservedUsd: number,
    actualUsd: number
  ): Promise<void> {
    assertUsdAmounts({ reservedUsd, actualUsd });

    const key = `${provider}:${period}`;
    const total = (this.#totals.get(key) ?? 0) + actualUsd - reservedUsd;
    this.#totals.set(key, Math.max(total, 0));

    return Promise.resolve();
  }

  add(provider: Provider, period: string, usd: number): Promise<void> {
    assertUsdAmounts({ usd });

    const key = `${provider}:${period}`;
    this.#totals.set(key, (this.#totals.get(key) ?? 0) + usd);

    return Promise.resolve();
  }
}

/** Calendar month in UTC, e.g. "2026-11". */
export function currentPeriod(now = new Date()): string {
  return now.toISOString().slice(0, 7);
}
