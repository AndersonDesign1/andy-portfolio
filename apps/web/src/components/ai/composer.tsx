"use client";

import { ArrowUp02Icon, Mic01Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { KeyboardEvent, Ref, SubmitEvent } from "react";

import { cn } from "@/lib/utils";

export const MAX_CHARS = 2000;

interface ComposerProps {
  value: string;
  textareaRef: Ref<HTMLTextAreaElement>;
  busy: boolean;
  listening: boolean;
  voiceSupported: boolean;
  voiceLabel: string;
  voiceError?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
}

/** Status line under the text box: a dictation error, a listening hint, or the length near the limit. */
const hintFor = ({
  voiceError,
  listening,
  length,
  canSend,
}: {
  voiceError?: string;
  listening: boolean;
  length: number;
  canSend: boolean;
}) => {
  if (voiceError) {
    return voiceError;
  }

  if (listening) {
    return "Speak now, then tap the mic to stop.";
  }

  if (length > MAX_CHARS - 200) {
    return `${length}/${MAX_CHARS}`;
  }

  return canSend ? "Shift + Enter for a new line" : "";
};

/** Text box docked to the bottom: dictation mic, then send (or stop while answering). */
export const Composer = ({
  value,
  textareaRef,
  busy,
  listening,
  voiceSupported,
  voiceLabel,
  voiceError,
  onChange,
  onSend,
  onStop,
  onToggleVoice,
}: ComposerProps) => {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Chat convention (as in ChatGPT, Claude): Enter sends, Shift+Enter adds a line.
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <>
      <form
        className="border-subtle bg-background/85 focus-within:border-foreground/40 sticky bottom-4 rounded-md border p-2 shadow-[0_10px_40px_-18px_color-mix(in_oklch,var(--foreground)_35%,transparent)] backdrop-blur-md"
        onSubmit={onSubmit}
      >
        <label className="sr-only" htmlFor="ai-question">
          Your question
        </label>
        <textarea
          className="placeholder:text-muted-foreground text-primary [field-sizing:content] max-h-48 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-base leading-relaxed outline-none"
          id="ai-question"
          maxLength={MAX_CHARS}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            listening ? "Listening…" : "Ask about code, the web or AI…"
          }
          ref={textareaRef}
          rows={1}
          value={value}
        />
        <div className="flex items-center justify-between gap-3 px-1 pt-1">
          <p
            aria-live="polite"
            className={cn(
              "text-muted min-w-0 truncate text-xs",
              voiceError && "text-secondary"
            )}
          >
            {hintFor({
              canSend: !busy && value.trim().length > 0,
              length: value.length,
              listening,
              voiceError,
            })}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {voiceSupported && (
              <button
                aria-label={voiceLabel}
                aria-pressed={listening}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-sm transition-colors duration-200 ease-[var(--ease-out)] active:scale-[0.94] sm:size-9",
                  listening
                    ? "bg-foreground text-background"
                    : "text-secondary hover:text-primary hover:bg-secondary"
                )}
                onClick={onToggleVoice}
                type="button"
              >
                <HugeiconsIcon icon={Mic01Icon} size={18} />
              </button>
            )}
            {busy ? (
              <button
                aria-label="Stop the answer"
                className="bg-foreground text-background inline-flex size-11 items-center justify-center rounded-sm active:scale-[0.94] sm:size-9"
                onClick={onStop}
                type="button"
              >
                <HugeiconsIcon icon={StopIcon} size={16} />
              </button>
            ) : (
              <button
                aria-label="Send"
                className="bg-foreground text-background inline-flex size-11 items-center justify-center rounded-sm transition-opacity duration-200 active:scale-[0.94] disabled:opacity-30 sm:size-9"
                disabled={!value.trim()}
                type="submit"
              >
                <HugeiconsIcon icon={ArrowUp02Icon} size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
      <p className="text-muted text-center text-xs">
        AI can get things wrong. Double-check anything important.
      </p>
    </>
  );
};
