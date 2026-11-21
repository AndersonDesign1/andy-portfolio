"use client";

/** First screen under the orb: who this is, in one line. */
export const EmptyState = () => (
  <div className="flex w-full flex-col items-center gap-3 text-center">
    <h1 className="text-primary text-4xl leading-[1.06] font-semibold tracking-[-0.04em] md:text-[44px]">
      Ask Andy&apos;s AI
    </h1>
    <p className="text-secondary mx-auto max-w-md text-lg leading-relaxed">
      My assistant for SEO, code, the web and AI. Ask what you&apos;d ask me,
      and get the answer I&apos;d give.
    </p>
  </div>
);
