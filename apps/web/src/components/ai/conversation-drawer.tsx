"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/components/ai/chat-stream";
import { MessageList } from "@/components/ai/message-list";
import { ScrollToLatest } from "@/components/ai/scroll-to-latest";

interface ConversationDrawerProps {
  open: boolean;
  busy: boolean;
  messages: ChatMessage[];
  onClose: () => void;
}

/** The full conversation in a side sheet (bottom sheet on phones), on a native modal <dialog>. */
export const ConversationDrawer = ({
  open,
  busy,
  messages,
  onClose,
}: ConversationDrawerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      aria-labelledby="ai-conversation-title"
      className="ai-sheet ai-sheet-side fixed inset-x-0 top-auto bottom-0 m-0 h-[85dvh] max-h-none w-full max-w-none rounded-t-[24px] bg-[var(--raised)] p-0 text-[var(--fg)] shadow-[0_-24px_60px_-24px_var(--shadow)] backdrop:bg-black/45 backdrop:backdrop-blur-sm md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:w-[28rem] md:rounded-none"
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[rgb(128_128_128/0.14)] px-5 py-3.5">
          <h2 className="text-sm font-medium" id="ai-conversation-title">
            Conversation
          </h2>
          <button
            aria-label="Close conversation"
            className="inline-flex size-11 items-center justify-center rounded-full text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] sm:size-9"
            onClick={onClose}
            type="button"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </header>
        {open && (
          <ScrollToLatest
            className="flex-1"
            contentClassName="px-5 py-6"
            label="Conversation history"
          >
            <MessageList busy={busy} messages={messages} />
          </ScrollToLatest>
        )}
      </div>
    </dialog>
  );
};
