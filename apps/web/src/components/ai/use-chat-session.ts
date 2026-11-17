"use client";

import { useEffect, useRef, useState } from "react";

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
 * never sent back as history.
 */
export const useChatSession = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController>(null);
  const busy = status !== "idle";

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
    } finally {
      abortRef.current = null;
      setStatus("idle");
    }
  };

  /** Starts a question; false (nothing sent) when it's empty or an answer is still coming. */
  const send = (raw: string): boolean => {
    const question = raw.trim();

    if (!question || busy) {
      return false;
    }

    const history = [
      ...messages.flatMap(({ role, content, failed, stopped }) =>
        failed || stopped || !content ? [] : [{ content, role }]
      ),
      { content: question, role: "user" as const },
    ].slice(-HISTORY_SENT);

    const replyId = nextId + 1;
    nextId += 2;

    setMessages((current) => [
      ...current,
      { content: question, id: replyId - 1, role: "user" },
      { content: "", id: replyId, role: "assistant" },
    ]);
    setStatus("thinking");
    stream(history, replyId);

    return true;
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

  return { busy, clear, messages, send, status, stop };
};
