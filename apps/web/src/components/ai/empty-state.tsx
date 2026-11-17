"use client";

import type { Ref } from "react";

import type { OrbState } from "@/components/ai/orb";
import { OrbButton } from "@/components/ai/orb-button";

/** Short label on the chip, full question sent to the tutor. */
const SUGGESTIONS = [
  {
    label: "Closures, simply",
    question: "Explain closures like I'm new to JavaScript",
  },
  {
    label: "How async/await works",
    question: "How does async/await actually work?",
  },
  {
    label: "RAG vs fine-tuning",
    question: "RAG or fine-tuning: when do I use which?",
  },
];

interface EmptyStateProps {
  orbRef: Ref<HTMLDivElement>;
  orbState: OrbState;
  voiceSupported: boolean;
  listening: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onAsk: (question: string) => void;
}

/** First screen: the orb front and center (hold to talk), a line of intro, three starters. */
export const EmptyState = ({
  orbRef,
  orbState,
  voiceSupported,
  listening,
  onHoldStart,
  onHoldEnd,
  onAsk,
}: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-8 text-center">
    <OrbButton
      className="w-[min(58vw,264px,30dvh)] transition-transform duration-300 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:active:scale-100"
      listening={listening}
      onHoldEnd={onHoldEnd}
      onHoldStart={onHoldStart}
      orbRef={orbRef}
      orbState={orbState}
      voiceSupported={voiceSupported}
    />

    <div className="space-y-3">
      <h1 className="text-primary text-4xl leading-[1.1] font-bold tracking-tighter md:text-5xl">
        Ask Andy&apos;s AI
      </h1>
      <p className="text-secondary mx-auto max-w-md text-lg leading-relaxed">
        Code, the web and AI, explained the way I teach.{" "}
        {voiceSupported
          ? "Type a question, or hold the orb and talk."
          : "Type a question to start."}
      </p>
    </div>

    <ul className="-mx-6 flex w-[calc(100%+3rem)] [scrollbar-width:none] gap-2 overflow-x-auto px-6 sm:mx-0 sm:w-auto sm:justify-center sm:overflow-visible sm:px-0">
      {SUGGESTIONS.map(({ label, question }) => (
        <li className="shrink-0" key={label}>
          <button
            className="border-subtle text-secondary hover:text-primary hover:bg-secondary/60 rounded-sm border px-3 py-2 text-sm whitespace-nowrap transition-colors duration-200 ease-[var(--ease-out)] active:scale-[0.97]"
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
