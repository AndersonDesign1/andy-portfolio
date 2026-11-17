"use client";

import { StopIcon } from "@hugeicons/core-free-icons";
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
}: Pick<VoiceStatusProps, "recordingSince" | "cancelArmed">) => {
  const now = useNow(true);

  return (
    <span className="flex items-center gap-3">
      <span aria-hidden="true" className="ai-bars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="text-primary text-sm tabular-nums">
        {clock(recordingSince ? now - recordingSince : 0)}
      </span>
      <span
        className={cn(
          "text-sm transition-colors",
          cancelArmed ? "text-primary font-medium" : "text-muted"
        )}
      >
        {cancelArmed ? "Release to cancel" : "Release to send"}
      </span>
    </span>
  );
};

/**
 * One line under the orb that always says what's happening: recording (level
 * bars, timer, release hint), processing the voice, thinking, answering.
 */
export const VoiceStatus = ({
  phase,
  recordingSince,
  cancelArmed,
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

        return (
          <span className="text-muted text-sm">
            {voiceSupported ? "Hold the orb to talk" : "Type your question"}
          </span>
        );
      }
    }
  })();

  return (
    <p
      aria-live="polite"
      className="flex min-h-9 items-center justify-center text-center"
      id="ai-voice-status"
    >
      {content}
    </p>
  );
};
