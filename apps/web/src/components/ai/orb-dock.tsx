"use client";

import { HelpCircleIcon, KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";

/** Reopens the how-it-works guide. */
export const HelpButton = ({ onClick }: { onClick: () => void }) => (
  <button
    aria-label="How it works"
    className="text-muted hover:text-primary hover:bg-secondary inline-flex size-11 items-center justify-center rounded-full transition-colors"
    onClick={onClick}
    title="How it works"
    type="button"
  >
    <HugeiconsIcon icon={HelpCircleIcon} size={20} />
  </button>
);

/**
 * Wider screens only: "type" as a text button with the help button beside
 * it, under the intro on the first screen and docked at the bottom after.
 */
export const WideActions = ({
  empty,
  onType,
  onHelp,
  typeRef,
}: {
  empty: boolean;
  onType: () => void;
  onHelp: () => void;
  typeRef: Ref<HTMLButtonElement>;
}) => (
  <div className="flex items-center gap-2 max-md:hidden">
    <button
      className="border-foreground/20 bg-secondary text-primary hover:bg-muted hover:border-foreground/30 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium shadow-sm transition-colors duration-200 ease-[var(--ease-out)] active:scale-[0.97]"
      onClick={onType}
      ref={typeRef}
      type="button"
    >
      <HugeiconsIcon icon={KeyboardIcon} size={16} />
      {empty ? "Or type your question" : "Type instead"}
    </button>
    <HelpButton onClick={onHelp} />
  </div>
);

/**
 * Where the orb lives: at the bottom on phones, under the thumb, flanked by
 * "type" and "help" (and hidden while the text box is open); at the top on
 * wider screens.
 */
export const OrbDock = ({
  children,
  hidden,
  voiceSupported,
  onType,
  onHelp,
  typeRef,
}: {
  /** The orb and its status. */
  children: ReactNode;
  /** The text box is open: it takes the orb's place on phones. */
  hidden: boolean;
  voiceSupported: boolean;
  onType: () => void;
  onHelp: () => void;
  typeRef: Ref<HTMLButtonElement>;
}) => (
  <div
    className={cn(
      "order-2 flex w-full shrink-0 items-center justify-center gap-6 pb-5 md:order-1 md:pb-0",
      hidden && "max-md:hidden"
    )}
  >
    <div className="flex size-12 shrink-0 items-center justify-center md:hidden">
      {voiceSupported && (
        <button
          aria-label="Type instead"
          className="text-muted hover:text-primary hover:bg-secondary border-subtle inline-flex size-12 items-center justify-center rounded-full border transition-colors"
          onClick={onType}
          ref={typeRef}
          type="button"
        >
          <HugeiconsIcon icon={KeyboardIcon} size={20} />
        </button>
      )}
    </div>
    {children}
    <div className="flex size-12 shrink-0 items-center justify-center md:hidden">
      <HelpButton onClick={onHelp} />
    </div>
  </div>
);
