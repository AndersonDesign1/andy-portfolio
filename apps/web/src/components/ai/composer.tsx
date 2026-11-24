"use client";

import {
  ArrowUp02Icon,
  Cancel01Icon,
  HelpCircleIcon,
  Mic01Icon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { KeyboardEvent, Ref, SubmitEvent } from "react";

import { MAX_CHARS } from "@/components/ai/chat-limits";
import { cn } from "@/lib/utils";

interface ComposerProps {
  value: string;
  textareaRef: Ref<HTMLTextAreaElement>;
  busy: boolean;
  listening: boolean;
  transcribing: boolean;
  voiceSupported: boolean;
  voiceLabel: string;
  voiceError?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
  /** Collapses the composer back to voice-only. */
  onClose: () => void;
  /** Opens the guide; shown when there's no voice (the orb and its help button are hidden then). */
  onHelp: () => void;
}

/** Status line under the text box: a dictation error, a listening hint, or the length near the limit. */
const hintFor = ({
  voiceError,
  listening,
  transcribing,
  length,
  canSend,
}: {
  voiceError?: string;
  listening: boolean;
  transcribing: boolean;
  length: number;
  canSend: boolean;
}) => {
  if (voiceError) {
    return voiceError;
  }

  if (listening) {
    return "Listening… let go (or tap the mic) when you're done.";
  }

  if (transcribing) {
    return "Turning your voice into text…";
  }

  if (length > MAX_CHARS - 200) {
    return `${length}/${MAX_CHARS}`;
  }

  return canSend ? "Shift + Enter for a new line" : "";
};

/** Optional text box docked to the bottom: close, dictation mic, then send (or stop). */
export const Composer = ({
  value,
  textareaRef,
  busy,
  listening,
  transcribing,
  voiceSupported,
  voiceLabel,
  voiceError,
  onChange,
  onSend,
  onStop,
  onToggleVoice,
  onClose,
  onHelp,
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
    <form
      className="sticky bottom-4 rounded-[22px] bg-[var(--raised)] p-2.5 shadow-[0_24px_60px_-30px_var(--shadow),inset_0_0_0_1px_rgb(128_128_128/0.14)] backdrop-blur-md transition-shadow focus-within:shadow-[0_24px_60px_-28px_var(--shadow),inset_0_0_0_1.5px_var(--fg)]"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="ai-question">
        Your question
      </label>
      <textarea
        className="[field-sizing:content] max-h-48 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-base leading-relaxed text-[var(--fg)] outline-none placeholder:text-[var(--mute)]"
        id="ai-question"
        maxLength={MAX_CHARS}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={
          listening
            ? "Listening…"
            : "Ask about my work, products, code, or AI agents…"
        }
        ref={textareaRef}
        rows={1}
        value={value}
      />
      <div className="flex items-center justify-between gap-3 px-1.5 pt-1">
        <p
          aria-live="polite"
          className={cn(
            "min-w-0 truncate text-xs text-[var(--mute)]",
            voiceError && "text-[var(--fg-2)]"
          )}
        >
          {hintFor({
            canSend: !busy && value.trim().length > 0,
            length: value.length,
            listening,
            transcribing,
            voiceError,
          })}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {!voiceSupported && (
            <button
              aria-label="How it works"
              className="inline-flex size-11 items-center justify-center rounded-full text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] sm:size-9"
              onClick={onHelp}
              type="button"
            >
              <HugeiconsIcon icon={HelpCircleIcon} size={16} />
            </button>
          )}
          {voiceSupported && (
            <button
              aria-label="Close the text box"
              className="inline-flex size-11 items-center justify-center rounded-full text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] sm:size-9"
              onClick={onClose}
              type="button"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          )}
          {voiceSupported && (
            <button
              aria-label={voiceLabel}
              aria-pressed={listening}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200 ease-[var(--ease)] active:scale-[0.94] sm:size-9",
                listening
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg-2)] hover:bg-[var(--surface)] hover:text-[var(--fg)]"
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
              className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] active:scale-[0.94] sm:size-9"
              onClick={onStop}
              type="button"
            >
              <HugeiconsIcon icon={StopIcon} size={16} />
            </button>
          ) : (
            <button
              aria-label="Send"
              className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-opacity duration-200 active:scale-[0.94] disabled:opacity-30 sm:size-9"
              disabled={!value.trim()}
              type="submit"
            >
              <HugeiconsIcon icon={ArrowUp02Icon} size={18} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
