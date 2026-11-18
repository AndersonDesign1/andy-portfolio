"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { saveChat } from "@/components/ai/chat-storage";
import type { ChatMessage } from "@/components/ai/chat-stream";
import { MessageList } from "@/components/ai/message-list";

interface SharedChatProps {
  messages: Pick<ChatMessage, "content" | "role">[];
}

/**
 * A shared /ai chat, read-only. "Continue this chat" copies it onto this
 * device (the same store a reload uses) and opens /ai with it loaded.
 */
export const SharedChat = ({ messages }: SharedChatProps) => {
  const continueChat = () => {
    saveChat(messages);
    window.location.assign("/ai");
  };

  return (
    <div className="flex flex-col gap-8">
      <MessageList
        messages={messages.map((message, id) => ({ ...message, id }))}
      />
      <div className="border-subtle bg-background/90 sticky bottom-0 -mx-4 flex justify-center border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:mx-0 sm:rounded-full sm:border">
        <button
          className="bg-foreground text-background inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium active:scale-[0.97]"
          onClick={continueChat}
          type="button"
        >
          Continue this chat
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </button>
      </div>
    </div>
  );
};
