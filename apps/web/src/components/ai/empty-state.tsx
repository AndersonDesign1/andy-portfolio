"use client";

/** First screen under the orb: who this is, in Round 3 typography. */
export const EmptyState = () => (
  <div className="flex w-full flex-col items-center gap-3 text-center">
    <h1 className="text-[clamp(36px,5.5vw,52px)] leading-[1.04] font-[560] tracking-[-0.045em] text-[var(--fg)]">
      Ask Andy&apos;s AI
    </h1>
    <p className="mx-auto max-w-md text-[17px] leading-relaxed text-[var(--fg-2)]">
      Ask about my work, products, code, or AI agents. Hold the orb to talk, or
      type below.
    </p>
  </div>
);
