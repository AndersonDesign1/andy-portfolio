"use client";

import { HelpCircleIcon, KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";

/** Reopens the how-it-works guide. */
export const HelpButton = ({
  onClick,
  size = 20,
}: {
  onClick: () => void;
  size?: number;
}) => (
  <button
    aria-label="How it works"
    className="text-muted hover:text-primary hover:bg-secondary inline-flex size-11 items-center justify-center rounded-full transition-colors"
    onClick={onClick}
    title="How it works"
    type="button"
  >
    <HugeiconsIcon icon={HelpCircleIcon} size={size} />
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
 * Where the orb lives: at the bottom on phones, under the thumb, with a
 * quiet "or type instead" text link and help underneath (all hidden while the text box
 * is open); at the top on wider screens, where WideActions sit elsewhere.
 */
export const OrbDock = ({
  children,
  hidden,
  hintSpace,
  voiceSupported,
  onType,
  onHelp,
  typeRef,
}: {
  /** The orb and its status. */
  children: ReactNode;
  /** The text box is open: it takes the orb's place on phones. */
  hidden: boolean;
  /** "Hold to talk" shows under the orb on phones; leave it room. */
  hintSpace: boolean;
  voiceSupported: boolean;
  onType: () => void;
  onHelp: () => void;
  typeRef: Ref<HTMLButtonElement>;
}) => (
  <div
    className={cn(
      "order-2 flex w-full shrink-0 flex-col items-center gap-2 md:order-1",
      hidden && "max-md:hidden"
    )}
  >
    <div className={cn(hintSpace && "max-md:pb-5")}>{children}</div>
    <div className="flex items-center gap-1 md:hidden">
      {voiceSupported && (
        <button
          className="text-muted hover:text-primary inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-xs font-medium underline-offset-4 transition-colors hover:underline"
          onClick={onType}
          ref={typeRef}
          type="button"
        >
          <HugeiconsIcon icon={KeyboardIcon} size={14} />
          or type instead
        </button>
      )}
      <HelpButton onClick={onHelp} size={16} />
    </div>
  </div>
);
