"use client";

import { HelpCircleIcon, KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";

/** "or type instead": a quiet text link on every screen size, so the orb stays the main action. */
const TYPE_LINK =
  "text-muted hover:text-primary focus-visible:ring-foreground/30 inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-xs font-medium underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-2";

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
    className="text-muted hover:text-primary hover:bg-secondary focus-visible:ring-foreground/30 inline-flex size-11 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2"
    onClick={onClick}
    title="How it works"
    type="button"
  >
    <HugeiconsIcon icon={HelpCircleIcon} size={size} />
  </button>
);

/**
 * Wider screens only: the same quiet "or type instead" link as on phones,
 * with help beside it, under the intro on the first screen and under the orb
 * once a conversation starts.
 */
export const WideActions = ({
  onType,
  onHelp,
  typeRef,
}: {
  onType: () => void;
  onHelp: () => void;
  typeRef: Ref<HTMLButtonElement>;
}) => (
  <div className="flex items-center gap-1 max-md:hidden">
    <button className={TYPE_LINK} onClick={onType} ref={typeRef} type="button">
      <HugeiconsIcon icon={KeyboardIcon} size={14} />
      or type instead
    </button>
    <HelpButton onClick={onHelp} size={16} />
  </div>
);

/**
 * Where the orb lives: at the bottom on phones, under the thumb, with a
 * quiet "or type instead" text link and help underneath (all hidden while the
 * text box is open). On wider screens it's at the top until a conversation
 * starts, then at the bottom too; WideActions carry type and help there.
 */
export const OrbDock = ({
  children,
  conversation,
  hidden,
  hintSpace,
  voiceSupported,
  onType,
  onHelp,
  typeRef,
}: {
  /** The orb and its status. */
  children: ReactNode;
  /** A conversation is showing: the orb sits at the bottom on wider screens too. */
  conversation: boolean;
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
      "ai-rise order-2 flex w-full shrink-0 flex-col items-center gap-2",
      !conversation && "md:order-1",
      // The text box takes the orb's place: always on phones, and on wider
      // screens once the orb has joined it at the bottom.
      hidden && (conversation ? "hidden" : "max-md:hidden")
    )}
  >
    <div className={cn(hintSpace && "max-md:pb-5")}>{children}</div>
    <div className="flex items-center gap-1 md:hidden">
      {voiceSupported && (
        <button
          className={TYPE_LINK}
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
