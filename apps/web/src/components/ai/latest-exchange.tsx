"use client";

import {
  MessageMultiple01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/components/ai/chat-stream";
import { Message } from "@/components/ai/message-list";

interface LatestExchangeProps {
  messages: ChatMessage[];
  busy: boolean;
  onOpenConversation: () => void;
  onReset: () => void;
}

/**
 * Just the latest question and answer under the orb, in a bounded card;
 * the full history lives in the conversation drawer.
 */
export const LatestExchange = ({
  messages,
  busy,
  onOpenConversation,
  onReset,
}: LatestExchangeProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const question = messages.findLast((m) => m.role === "user");

  const reply =
    messages.at(-1)?.role === "assistant" ? messages.at(-1) : undefined;

  const earlier = Math.max(0, Math.floor((messages.length - 2) / 2));

  // Keep the newest text in view while the answer streams.
  const replyText = reply?.content;

  useEffect(() => {
    const box = scrollRef.current;

    if (box && replyText) {
      box.scrollTop = box.scrollHeight;
    }
  }, [replyText]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="border-subtle flex max-h-[42dvh] flex-col gap-5 overflow-y-auto rounded-md border p-4 md:p-5"
        ref={scrollRef}
      >
        {question && <Message message={question} />}
        {reply && <Message message={reply} />}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          className="text-muted hover:text-primary hover:bg-secondary/60 inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2.5 text-xs transition-colors sm:min-h-8"
          onClick={onOpenConversation}
          type="button"
        >
          <HugeiconsIcon icon={MessageMultiple01Icon} size={14} />
          {earlier > 0 ? `Conversation (${earlier} earlier)` : "Conversation"}
        </button>
        <button
          className="text-muted hover:text-primary hover:bg-secondary/60 inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2.5 text-xs transition-colors disabled:opacity-40 sm:min-h-8"
          disabled={busy}
          onClick={onReset}
          type="button"
        >
          <HugeiconsIcon icon={Refresh01Icon} size={14} />
          New chat
        </button>
      </div>

      {/* Streaming text would be read out chunk by chunk; announce each reply once, when it's done. */}
      <p aria-live="polite" className="sr-only">
        {!busy && reply?.content ? reply.content : ""}
      </p>
    </div>
  );
};
