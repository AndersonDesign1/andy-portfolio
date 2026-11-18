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
export const parseSavedChat = (
  raw: string
): { messages: StoredMessage[]; savedAt: number } | undefined => {
  try {
    const saved = savedSchema.safeParse(JSON.parse(raw));

    return saved.success &&
      saved.data.savedAt <= Date.now() &&
      Date.now() - saved.data.savedAt < CHAT_TTL_MS &&
      saved.data.messages.length > 0
      ? { messages: saved.data.messages, savedAt: saved.data.savedAt }
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

/**
 * The how-it-works guide opens once per tab: sessionStorage survives reloads
 * and in-site navigation but is cleared when the tab closes.
 */
const GUIDE_KEY = "andy-ai-guide-seen";

const readGuideSeen = () => {
  try {
    return sessionStorage.getItem(GUIDE_KEY) === "1";
  } catch {
    // Storage blocked: don't nag on every visit.
    return true;
  }
};

/** True once the guide has been closed in this tab (and during prerender/hydration). */
export const useGuideSeen = () =>
  useSyncExternalStore(subscribeStorage, readGuideSeen, () => true);

export const markGuideSeen = () => {
  try {
    sessionStorage.setItem(GUIDE_KEY, "1");
  } catch {
    // Storage blocked: the guide just won't reopen by itself in this tab.
  }
};
