"use client";

import {
  ArrowUp01Icon,
  SquareLock02Icon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type VoicePhase =
  | "idle"
  | "recording"
  | "processing"
  | "thinking"
  | "answering";

interface VoiceStatusProps {
  phase: VoicePhase;
  /** When recording started (ms since epoch); drives the timer. */
  recordingSince: number;
  cancelArmed: boolean;
  /** Held with a finger or mouse, so sliding up can lock it. */
  lockable: boolean;
  /** Locked by sliding up: recording hands-free until the orb is tapped. */
  locked: boolean;
  /** Show "Hold to talk" under the orb on phones too (only on the first screen there). */
  hintOnPhones: boolean;
  /** A transcript is in the text box waiting to be checked and sent. */
  reviewing: boolean;
  voiceSupported: boolean;
  error?: string;
  onCancelVoice: () => void;
  onStopAnswer: () => void;
}

const clock = (ms: number) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Re-renders every quarter second while `active`, for the recording timer. */
const useNow = (active: boolean) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) {
      return;
    }

    const timer = setInterval(() => setNow(Date.now()), 250);

    return () => clearInterval(timer);
  }, [active]);

  return now;
};

const TextAction = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    className="text-muted hover:text-primary rounded-sm px-1.5 py-1 text-xs underline-offset-4 transition-colors hover:underline"
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

const Recording = ({
  recordingSince,
  cancelArmed,
  locked,
  onCancelVoice,
}: Pick<
  VoiceStatusProps,
  "recordingSince" | "cancelArmed" | "locked" | "onCancelVoice"
>) => {
  const now = useNow(true);

  const hint = (() => {
    if (locked) {
      return "Tap the orb to finish";
    }

    return cancelArmed ? "Release to cancel" : "Release to send";
  })();

  return (
    <span className="flex items-center gap-3">
      {locked && (
        <HugeiconsIcon
          className="text-primary shrink-0"
          icon={SquareLock02Icon}
          size={14}
        />
      )}
      <span aria-hidden="true" className="ai-bars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
      {/* Visual only: a ticking timer in a live region would be read out every second. */}
      <span aria-hidden="true" className="text-primary text-sm tabular-nums">
        {clock(recordingSince ? now - recordingSince : 0)}
      </span>
      <span
        className={cn(
          "text-sm transition-colors",
          cancelArmed || locked ? "text-primary font-medium" : "text-muted"
        )}
      >
        {hint}
      </span>
      {locked && <TextAction label="Cancel" onClick={onCancelVoice} />}
    </span>
  );
};

/** Above the orb while it's held: slide up to keep recording hands-free. */
const LockHint = () => (
  <span
    aria-hidden="true"
    className="border-subtle bg-background/90 text-primary absolute bottom-full left-1/2 mb-5 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full border px-3 pt-2.5 pb-3 shadow-md backdrop-blur-md"
  >
    <HugeiconsIcon className="ai-lock-nudge" icon={ArrowUp01Icon} size={18} />
    <HugeiconsIcon icon={SquareLock02Icon} size={22} />
    <span className="text-[11px] leading-none font-medium">Lock</span>
  </span>
);

/**
 * "Hold to talk" with a hand-drawn arrow pointing at the orb: under it on
 * phones (where the orb sits at the bottom, by the thumb), to its right on
 * wider screens.
 */
const HoldHint = ({ onPhones }: { onPhones: boolean }) => (
  <span
    className={cn(
      "text-secondary absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-full items-center gap-1 pt-1 text-xs font-medium whitespace-nowrap md:top-1/2 md:bottom-auto md:left-full md:ml-2 md:translate-x-0 md:-translate-y-1/2 md:pt-0 md:text-sm",
      !onPhones && "max-md:hidden"
    )}
  >
    <svg
      aria-hidden="true"
      className="hidden size-7 shrink-0 md:block"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 28 28"
    >
      <path d="M25 18c-5 1-12-1-19-9" />
      <path d="M6 9l1 6M6 9l6 0" />
    </svg>
    Hold to talk
  </span>
);

/**
 * The orb's status, overlaid on it so it takes no height: what's happening
 * right now: recording (level
 * bars, timer, release hint), processing the voice, thinking, answering.
 */
export const VoiceStatus = ({
  phase,
  recordingSince,
  cancelArmed,
  lockable,
  locked,
  hintOnPhones,
  reviewing,
  voiceSupported,
  error,
  onCancelVoice,
  onStopAnswer,
}: VoiceStatusProps) => {
  const content = (() => {
    switch (phase) {
      case "recording": {
        return (
          <Recording
            cancelArmed={cancelArmed}
            locked={locked}
            onCancelVoice={onCancelVoice}
            recordingSince={recordingSince}
          />
        );
      }

      case "processing": {
        return (
          <span className="flex items-center gap-2">
            <span className="ai-shimmer text-sm font-medium">
              Processing your voice
            </span>
            <TextAction label="Cancel" onClick={onCancelVoice} />
          </span>
        );
      }

      case "thinking":
      case "answering": {
        return (
          <span className="flex items-center gap-2">
            <span className="ai-shimmer text-sm font-medium">
              {phase === "thinking" ? "Thinking" : "Answering"}
            </span>
            <button
              aria-label="Stop the answer"
              className="text-muted hover:text-primary hover:bg-secondary inline-flex size-8 items-center justify-center rounded-full transition-colors"
              onClick={onStopAnswer}
              type="button"
            >
              <HugeiconsIcon icon={StopIcon} size={14} />
            </button>
          </span>
        );
      }

      default: {
        if (error) {
          return <span className="text-secondary text-sm">{error}</span>;
        }

        if (reviewing) {
          return (
            <span className="text-primary text-sm">
              Got it. Edit below if needed, then send.
            </span>
          );
        }

        return null;
      }
    }
  })();

  const showHint = content === null && voiceSupported;

  // Overlaid on the orb's box, so the status takes no height of its own.
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-0"
      id="ai-voice-status"
    >
      {showHint && <HoldHint onPhones={hintOnPhones} />}
      {phase === "recording" && lockable && !cancelArmed && <LockHint />}
      {content !== null && (
        <span className="border-subtle bg-background/85 pointer-events-auto absolute bottom-0 left-1/2 flex w-max max-w-[min(88vw,26rem)] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-2xl border px-3.5 py-1.5 text-center shadow-sm backdrop-blur-md">
          {content}
        </span>
      )}
    </div>
  );
};
