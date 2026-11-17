"use client";

import type { ChatMessage } from "@/components/ai/chat-stream";
import { ReplyText } from "@/components/ai/reply-text";

/** One message: the visitor's question as a bubble, the reply as prose. */
export const Message = ({ message }: { message: ChatMessage }) => {
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

/** The whole conversation, oldest first. */
export const MessageList = ({ messages }: { messages: ChatMessage[] }) => (
  <ol className="flex flex-col gap-8">
    {messages.map((message) => (
      <li key={message.id}>
        <Message message={message} />
      </li>
    ))}
  </ol>
);
