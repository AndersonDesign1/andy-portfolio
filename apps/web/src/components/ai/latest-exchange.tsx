"use client";

import {
  Copy01Icon,
  MessageMultiple01Icon,
  Refresh01Icon,
  RepeatIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import type { ChatMessage } from "@/components/ai/chat-stream";
import { Message } from "@/components/ai/message-list";
import { AnchoredScroll } from "@/components/ai/scroll-to-latest";
import { ShareButton } from "@/components/ai/share-button";

interface LatestExchangeProps {
  messages: ChatMessage[];
  busy: boolean;
  onOpenConversation: () => void;
  onReset: () => void;
  onRetry: () => void;
}

const ICON_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-full text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] disabled:opacity-40 sm:size-8";

/** Copy the reply text, with a brief tick to confirm. */
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), 1500);

    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard blocked (e.g. insecure context); nothing to confirm.
    }
  };

  return (
    <button
      aria-label={copied ? "Copied" : "Copy answer"}
      className={ICON_BUTTON}
      onClick={copy}
      type="button"
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={15} />
    </button>
  );
};

/**
 * Just the latest question and answer under the orb, in a bounded card that
 * pins the question to the top while the answer streams in below it; copy and retry sit under the answer, and
 * the full history lives in the conversation drawer.
 */
export const LatestExchange = ({
  messages,
  busy,
  onOpenConversation,
  onReset,
  onRetry,
}: LatestExchangeProps) => {
  const question = messages.findLast((m) => m.role === "user");

  const reply =
    messages.at(-1)?.role === "assistant" ? messages.at(-1) : undefined;

  const earlier = Math.max(0, Math.floor((messages.length - 2) / 2));
  const finished = !busy && reply?.content ? reply.content : "";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-3">
      <AnchoredScroll
        anchorKey={question?.id}
        className="flex-1 rounded-[22px] bg-[var(--raised)] shadow-[0_24px_60px_-34px_var(--shadow),inset_0_0_0_1px_rgb(128_128_128/0.12)]"
        contentClassName="flex flex-col gap-5 p-5 md:p-6"
        label="Latest answer"
      >
        {question && (
          <div className="ai-rise" key={question.id}>
            <Message message={question} />
          </div>
        )}
        {reply && <Message message={reply} streaming={busy} />}
        {finished && (
          <div className="-mt-2 -ml-2 flex items-center gap-0.5">
            {!reply?.failed && <CopyButton text={finished} />}
            <button
              aria-label="Ask again"
              className={ICON_BUTTON}
              onClick={onRetry}
              title="Ask again"
              type="button"
            >
              <HugeiconsIcon icon={RepeatIcon} size={15} />
            </button>
          </div>
        )}
      </AnchoredScroll>

      <div className="flex shrink-0 items-center justify-between gap-2">
        <button
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] sm:min-h-8"
          onClick={onOpenConversation}
          type="button"
        >
          <HugeiconsIcon icon={MessageMultiple01Icon} size={14} />
          {earlier > 0 ? `History (${earlier})` : "History"}
        </button>
        <div className="flex items-center gap-1">
          <ShareButton busy={busy} messages={messages} />
          <button
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] disabled:opacity-40 sm:min-h-8"
            disabled={busy}
            onClick={onReset}
            type="button"
          >
            <HugeiconsIcon icon={Refresh01Icon} size={14} />
            New chat
          </button>
        </div>
      </div>

      {/* Streaming text would be read out chunk by chunk; announce each reply once, when it's done. */}
      <p aria-live="polite" className="sr-only">
        {finished}
      </p>
    </div>
  );
};
