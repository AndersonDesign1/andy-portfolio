"use client";

/** Short label on the chip, full question sent to the assistant. */
const SUGGESTIONS = [
  {
    label: "SEO basics for a new site",
    question:
      "I'm new to SEO. What actually matters for a new website, and where do I start?",
  },
  {
    label: "Why isn't my site on Google?",
    question:
      "My website isn't showing up on Google. What should I check first?",
  },
  {
    label: "Core Web Vitals, simply",
    question: "What are Core Web Vitals, and how do I improve them?",
  },
  {
    label: "How async/await works",
    question: "How does async/await actually work in JavaScript?",
  },
  {
    label: "RAG vs fine-tuning",
    question: "RAG or fine-tuning: when do I use which?",
  },
];

/** First screen under the orb: who this is, and a few things to ask. */
export const EmptyState = ({
  onAsk,
}: {
  onAsk: (question: string) => void;
}) => (
  <div className="flex w-full flex-col items-center gap-6 text-center">
    <div className="flex flex-col gap-3">
      <h1 className="text-primary text-4xl leading-[1.1] font-bold tracking-tighter md:text-5xl">
        Ask Andy&apos;s AI
      </h1>
      <p className="text-secondary mx-auto max-w-md text-lg leading-relaxed">
        My assistant for SEO, code, the web and AI. Ask what you&apos;d ask me,
        and get the answer I&apos;d give.
      </p>
    </div>

    <ul className="-mx-6 flex w-[calc(100%+3rem)] [scrollbar-width:none] gap-2 overflow-x-auto px-6 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {SUGGESTIONS.map(({ label, question }) => (
        <li className="shrink-0" key={label}>
          <button
            className="border-subtle text-secondary hover:text-primary hover:bg-secondary/60 min-h-11 rounded-sm border px-3 text-sm whitespace-nowrap transition-colors duration-200 ease-[var(--ease-out)] active:scale-[0.97] sm:min-h-9"
            onClick={() => onAsk(question)}
            title={question}
            type="button"
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
