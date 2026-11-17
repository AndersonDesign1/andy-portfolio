"use client";

import { lazy, Suspense } from "react";

import type { ChatMessage } from "@/components/ai/chat-stream";

/** A reply as plain text: shown while the renderer loads, or if it can't. */
const PlainReply = ({ text }: { text: string; streaming?: boolean }) => (
  <p className="whitespace-pre-wrap">{text}</p>
);

/**
 * The Markdown renderer (Streamdown + Shiki) is ~140 KB gzipped, so it loads
 * after the page (see `preloadReplyRenderer`) instead of with it. If its
 * chunk fails to load (offline, blocked), replies stay plain text instead of
 * the error taking down the page.
 */
const loadReplyText = async () => {
  try {
    const module = await import("@/components/ai/reply-text");

    return { default: module.ReplyText };
  } catch {
    return { default: PlainReply };
  }
};

const ReplyText = lazy(loadReplyText);

/** Starts fetching the renderer early (on idle) so the first reply is formatted. */
export const preloadReplyRenderer = () => {
  loadReplyText();
};

/** One message: the visitor's question as a bubble, the reply as prose. */
export const Message = ({
  message,
  streaming = false,
}: {
  message: ChatMessage;
  /** This reply is still arriving (lets the renderer close unfinished Markdown). */
  streaming?: boolean;
}) => {
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
      <Suspense fallback={<PlainReply text={message.content} />}>
        <ReplyText streaming={streaming} text={message.content} />
      </Suspense>
      {message.stopped && <p className="text-muted text-sm italic">Stopped.</p>}
    </div>
  );
};

/** The whole conversation, oldest first; `busy` means the last reply is still streaming. */
export const MessageList = ({
  messages,
  busy = false,
}: {
  messages: ChatMessage[];
  busy?: boolean;
}) => (
  <ol className="flex flex-col gap-8">
    {messages.map((message, index) => (
      <li key={message.id}>
        <Message
          message={message}
          streaming={busy && index === messages.length - 1}
        />
      </li>
    ))}
  </ol>
);
