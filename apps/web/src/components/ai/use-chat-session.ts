"use client";

import { useEffect, useRef, useState } from "react";

import {
  CHAT_TTL_MS,
  parseSavedChat,
  saveChat,
  useSavedChatRaw,
} from "@/components/ai/chat-storage";
import { failureText, readStream } from "@/components/ai/chat-stream";
import type { ChatMessage, ChatStatus } from "@/components/ai/chat-stream";

/** Recent messages sent with each question; the assistant trims to its own limit. */
const HISTORY_SENT = 20;

const STOPPED_TEXT = "Stopped before an answer arrived.";

const OFFLINE_TEXT =
  "Couldn't reach Andy's AI. Check your connection and try again.";

let nextId = 0;

/**
 * The conversation with /api/tutor: messages, streaming state, sending,
 * stopping and clearing. Failed and stopped replies stay visible but are
 * never sent back as history. The chat is kept on this device for an hour
 * (see chat-storage), so a reload picks up where the visitor left off.
 */
export const useChatSession = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController>(null);
  /** False until the saved chat has been read, so the empty first render doesn't wipe it. */
  const [restored, setRestored] = useState(false);
  /** The chat as restored; saving it unchanged would renew its hour on every visit. */
  const [restoredMessages, setRestoredMessages] = useState<ChatMessage[]>();
  /** When the restored chat was last saved, so the hour keeps counting from then. */
  const [restoredAt, setRestoredAt] = useState(0);
  /** When the chat last changed; a question after an hour idle starts a new chat. */
  const lastActivity = useRef(0);
  const busy = status !== "idle";
  const savedRaw = useSavedChatRaw();

  // Once hydrated, load the chat saved on this device. Restored messages get
  // negative ids so they can never collide with new ones.
  if (!restored && savedRaw !== null) {
    setRestored(true);
    const saved = parseSavedChat(savedRaw);

    if (saved) {
      const seeded = saved.messages.map((message, index) => ({
        ...message,
        id: -(index + 1),
      }));

      setMessages(seeded);
      setRestoredMessages(seeded);
      setRestoredAt(saved.savedAt);
    }
  }

  // Saved once each answer settles (an empty chat clears the saved one).
  useEffect(() => {
    if (!restored || status !== "idle") {
      return;
    }

    if (messages === restoredMessages) {
      lastActivity.current = restoredAt;

      return;
    }

    saveChat(messages);
    lastActivity.current = Date.now();
  }, [messages, restored, restoredAt, restoredMessages, status]);

  const stream = async (
    history: { content: string; role: ChatMessage["role"] }[],
    replyId: number
  ) => {
    const updateReply = (patch: Partial<ChatMessage>) =>
      setMessages((current) =>
        current.map((m) => (m.id === replyId ? { ...m, ...patch } : m))
      );

    const controller = new AbortController();
    abortRef.current = controller;
    let received = false;

    try {
      const response = await fetch("/api/tutor", {
        body: JSON.stringify({ messages: history }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });

      if (response.ok && response.body) {
        await readStream(response.body, (text) => {
          received = true;
          setStatus("answering");
          updateReply({ content: text });
        });
      } else {
        updateReply({ content: await failureText(response), failed: true });
      }
    } catch {
      // A stopped reply keeps any text it got; an empty one says it stopped.
      if (!controller.signal.aborted) {
        updateReply({ content: OFFLINE_TEXT, failed: true });
      } else if (received) {
        updateReply({ stopped: true });
      } else {
        updateReply({ content: STOPPED_TEXT, failed: true });
      }
    }

    // After the try rather than in a finally (React Compiler can't lower one);
    // the catch above swallows everything, so this always runs.
    abortRef.current = null;
    setStatus("idle");
  };

  /**
   * Starts a question; false (nothing sent) when it's empty or an answer is
   * still coming. `replaceLast` swaps out the last question and answer (retry).
   */
  const send = (raw: string, replaceLast = false): boolean => {
    const question = raw.trim();

    if (!question || busy) {
      return false;
    }

    // An hour after the last message the chat has expired, even if this tab
    // stayed open: the new question starts a fresh chat instead of saving the
    // old one again with a new hour.
    const expired =
      messages.length > 0 && Date.now() - lastActivity.current >= CHAT_TTL_MS;

    /** What stays before the new question: nothing once expired, minus the last exchange on retry. */
    const keep = (list: ChatMessage[]) => {
      if (expired) {
        return [];
      }

      return replaceLast ? list.slice(0, -2) : list;
    };

    const kept = keep(messages);

    const history = [
      ...kept.flatMap(({ role, content, failed, stopped }) =>
        failed || stopped || !content ? [] : [{ content, role }]
      ),
      { content: question, role: "user" as const },
    ].slice(-HISTORY_SENT);

    const replyId = nextId + 1;
    nextId += 2;

    setMessages((current) => [
      ...keep(current),
      { content: question, id: replyId - 1, role: "user" },
      { content: "", id: replyId, role: "assistant" },
    ]);
    setStatus("thinking");
    stream(history, replyId);

    return true;
  };

  /** Asks the last question again, replacing its answer. */
  const retry = () => {
    const last = messages.findLast((m) => m.role === "user");

    if (last && messages.at(-1)?.role === "assistant") {
      send(last.content, true);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
  };

  // Leaving the page stops an in-flight reply.
  useEffect(() => () => abortRef.current?.abort(), []);

  return { busy, clear, messages, ready: restored, retry, send, status, stop };
};
