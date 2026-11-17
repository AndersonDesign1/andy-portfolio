"use client";

import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Ref } from "react";

import type { ChatMessage } from "@/components/ai/chat-stream";
import type { OrbState } from "@/components/ai/orb";
import { OrbButton } from "@/components/ai/orb-button";
import { ReplyText } from "@/components/ai/reply-text";

const STATUS_LABEL: Record<OrbState, string> = {
  answering: "Answering",
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
};

const Message = ({ message }: { message: ChatMessage }) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="bg-secondary text-primary max-w-[85%] rounded-sm px-4 py-2.5 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.failed) {
    return (
      <p className="text-muted text-sm italic" role="alert">
        {message.content}
      </p>
    );
  }

  if (!message.content) {
    return <span className="sr-only">Thinking</span>;
  }

  return (
    <div className="text-secondary text-[1.0625rem] leading-relaxed">
      <ReplyText text={message.content} />
      {message.stopped && <p className="text-muted text-sm italic">Stopped.</p>}
    </div>
  );
};

interface TranscriptProps {
  messages: ChatMessage[];
  orbRef: Ref<HTMLDivElement>;
  endRef: Ref<HTMLDivElement>;
  orbState: OrbState;
  voiceSupported: boolean;
  listening: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onReset: () => void;
}

/** The conversation: the orb shrinks to a small companion with a live status line. */
export const Transcript = ({
  messages,
  orbRef,
  endRef,
  orbState,
  voiceSupported,
  listening,
  onHoldStart,
  onHoldEnd,
  onReset,
}: TranscriptProps) => {
  const last = messages.at(-1);
  const finished = last?.role === "assistant" ? last.content : "";

  return (
    <div className="flex flex-1 flex-col gap-10 pb-8">
      <header className="flex items-center gap-3">
        <OrbButton
          className="size-11 shrink-0"
          listening={listening}
          onHoldEnd={onHoldEnd}
          onHoldStart={onHoldStart}
          orbRef={orbRef}
          orbState={orbState}
          voiceSupported={voiceSupported}
        />
        <div className="min-w-0 flex-1">
          <p className="text-primary text-sm font-semibold">Andy&apos;s AI</p>
          <p aria-live="polite" className="text-muted text-xs">
            {STATUS_LABEL[orbState]}
          </p>
        </div>
        <button
          className="text-muted hover:text-primary hover:bg-secondary/60 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs transition-colors"
          onClick={onReset}
          type="button"
        >
          <HugeiconsIcon icon={Refresh01Icon} size={14} />
          New chat
        </button>
      </header>

      <ol className="space-y-8">
        {messages.map((message) => (
          <li
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            key={message.id}
          >
            <Message message={message} />
          </li>
        ))}
      </ol>
      {/* Streaming text would be read out chunk by chunk; announce each reply once, when it's done. */}
      <p aria-live="polite" className="sr-only">
        {orbState === "idle" && finished ? finished : ""}
      </p>
      <div ref={endRef} />
    </div>
  );
};
