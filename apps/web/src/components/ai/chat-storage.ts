import { useSyncExternalStore } from "react";
import {
  array,
  boolean,
  enum as zEnum,
  number,
  object,
  optional,
  string,
} from "zod/mini";

import type { ChatMessage } from "@/components/ai/chat-stream";

/**
 * The /ai chat is kept on this device (never on the server) so a reload or a
 * trip to another page doesn't lose it. It's dropped after an hour without a
 * new message, and "New chat" clears it at once.
 */
const KEY = "andy-ai-chat:v1";

export const CHAT_TTL_MS = 60 * 60 * 1000;

const savedSchema = object({
  messages: array(
    object({
      content: string(),
      failed: optional(boolean()),
      role: zEnum(["user", "assistant"]),
      stopped: optional(boolean()),
    })
  ),
  savedAt: number(),
});

type StoredMessage = Omit<ChatMessage, "id">;

const readRaw = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

/**
 * Storage changes from other tabs. The chat is only read once per visit, so
 * this just satisfies useSyncExternalStore.
 */
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);

  return () => window.removeEventListener("storage", onChange);
};

/** False during the prerendered HTML and hydration, true after: for browser-only UI. */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => true,
    () => false
  );

/**
 * The saved chat as stored ("" when there's none), or null while the
 * prerendered page hydrates, before this device's storage can be read.
 */
export const useSavedChatRaw = () =>
  useSyncExternalStore(subscribeStorage, readRaw, () => null);

/** The saved chat if it's under an hour old; an older one is ignored (and overwritten on the next save). */
export const parseSavedChat = (raw: string): StoredMessage[] | undefined => {
  try {
    const saved = savedSchema.safeParse(JSON.parse(raw));

    return saved.success &&
      saved.data.savedAt <= Date.now() &&
      Date.now() - saved.data.savedAt < CHAT_TTL_MS &&
      saved.data.messages.length > 0
      ? saved.data.messages
      : undefined;
  } catch {
    return undefined;
  }
};

export const saveChat = (messages: StoredMessage[]) => {
  try {
    if (messages.length === 0) {
      localStorage.removeItem(KEY);

      return;
    }

    localStorage.setItem(
      KEY,
      JSON.stringify({
        messages: messages.map(({ content, failed, role, stopped }) => ({
          content,
          failed,
          role,
          stopped,
        })),
        savedAt: Date.now(),
      })
    );
  } catch {
    // Private mode or full storage: the chat just won't survive a reload.
  }
};

/**
 * Question/answer pairs worth sharing: answers that finished (not failed or
 * stopped), each with the question it answered.
 */
export const sharePairs = (messages: StoredMessage[]) =>
  messages.flatMap((message, index) => {
    const question = messages[index - 1];

    return message.role === "assistant" &&
      message.content &&
      !message.failed &&
      !message.stopped &&
      question?.role === "user"
      ? [
          { content: question.content, role: "user" as const },
          { content: message.content, role: "assistant" as const },
        ]
      : [];
  });
