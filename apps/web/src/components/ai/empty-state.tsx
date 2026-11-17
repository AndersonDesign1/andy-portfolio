"use client";

import type { Ref } from "react";

import { Orb } from "@/components/ai/orb";
import type { OrbState } from "@/components/ai/orb";

const SUGGESTIONS = [
  "Explain closures like I'm new to JavaScript",
  "How does async/await actually work?",
  "RAG or fine-tuning: when do I use which?",
];

interface EmptyStateProps {
  orbRef: Ref<HTMLDivElement>;
  orbState: OrbState;
  voiceSupported: boolean;
  voiceLabel: string;
  listening: boolean;
  onToggleVoice: () => void;
  onAsk: (question: string) => void;
}

/** First screen: the orb front and center (tap to talk), a line of intro, three starters. */
export const EmptyState = ({
  orbRef,
  orbState,
  voiceSupported,
  voiceLabel,
  listening,
  onToggleVoice,
  onAsk,
}: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-10 text-center">
    <button
      aria-label={voiceSupported ? voiceLabel : "Andy's AI"}
      aria-pressed={voiceSupported ? listening : undefined}
      className="focus-visible:ring-foreground/40 w-[min(58vw,264px)] touch-manipulation rounded-full transition-transform duration-300 ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97] disabled:cursor-default motion-reduce:active:scale-100"
      disabled={!voiceSupported}
      onClick={onToggleVoice}
      type="button"
    >
      <Orb ref={orbRef} state={orbState} />
    </button>

    <div className="space-y-3">
      <h1 className="text-primary text-4xl leading-[1.1] font-bold tracking-tighter md:text-5xl">
        Ask Andy&apos;s AI
      </h1>
      <p className="text-secondary mx-auto max-w-md text-lg leading-relaxed">
        Code, the web and AI, explained the way I teach.{" "}
        {voiceSupported
          ? "Type a question, or tap the orb and talk."
          : "Type a question to start."}
      </p>
    </div>

    <ul className="flex max-w-xl flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((suggestion) => (
        <li key={suggestion}>
          <button
            className="border-subtle text-secondary hover:text-primary hover:bg-secondary/60 rounded-sm border px-3 py-2 text-sm transition-colors duration-200 ease-[var(--ease-out)] active:scale-[0.97]"
            onClick={() => onAsk(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
