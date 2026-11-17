"use client";

import { useEffect, useRef, useState } from "react";

import { failureText, readStream } from "@/components/ai/chat-stream";
import type { ChatMessage, ChatStatus } from "@/components/ai/chat-stream";
import { Composer, MAX_CHARS } from "@/components/ai/composer";
import { EmptyState } from "@/components/ai/empty-state";
import type { OrbState } from "@/components/ai/orb";
import { Transcript } from "@/components/ai/transcript";
import { useDictation } from "@/components/ai/use-dictation";

/** Recent messages sent with each question; the tutor trims to its own limit. */
const HISTORY_SENT = 20;

const STOPPED_TEXT = "Stopped before an answer arrived.";

const OFFLINE_TEXT =
  "Couldn't reach the tutor. Check your connection and try again.";

let nextId = 0;

/** The /ai page: orb, conversation and composer, streaming replies from /api/tutor. */
export const AiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");

  const orbRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController>(null);
  /** What was already typed when dictation started; spoken words are appended. */
  const typedBeforeDictation = useRef("");

  const dictation = useDictation({
    onLevel: (level) =>
      orbRef.current?.style.setProperty("--orb-level", level.toFixed(3)),
    onTranscript: (spoken) => {
      const typed = typedBeforeDictation.current;
      setInput((typed ? `${typed} ${spoken}` : spoken).slice(0, MAX_CHARS));
    },
  });

  const busy = status !== "idle";

  const orbStateFor = (): OrbState => {
    if (dictation.listening) {
      return "listening";
    }

    return dictation.transcribing ? "thinking" : status;
  };

  const orbState = orbStateFor();

  const voiceLabel = dictation.listening
    ? "Stop recording"
    : "Record your question";

  /** Push-to-talk on the orb: record only while it's held. */
  const holdStart = () => {
    if (dictation.listening) {
      return;
    }

    typedBeforeDictation.current = input.trim();
    dictation.start();
  };

  const holdEnd = () => {
    if (dictation.listening) {
      dictation.stop();
      textareaRef.current?.focus();
    }
  };

  const toggleVoice = () => {
    if (!dictation.listening) {
      typedBeforeDictation.current = input.trim();
    }

    dictation.toggle();
    textareaRef.current?.focus();
  };

  const send = async (raw: string) => {
    const question = raw.trim();

    if (!question || busy) {
      return;
    }

    dictation.cancel();

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
    setInput("");
    setStatus("thinking");

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

  const reset = () => {
    abortRef.current?.abort();
    dictation.cancel();
    setMessages([]);
    setInput("");
  };

  // Follow the conversation as replies stream in.
  const lastContent = messages.at(-1)?.content;
  const empty = messages.length === 0;

  useEffect(() => {
    if (!empty) {
      endRef.current?.scrollIntoView({ block: "end" });
    }
  }, [empty, lastContent]);

  // Leaving the page stops an in-flight reply.
  useEffect(() => () => abortRef.current?.abort(), []);

  const voice = {
    listening: dictation.listening,
    onHoldEnd: holdEnd,
    onHoldStart: holdStart,
    orbRef,
    orbState,
    voiceSupported: dictation.supported,
  };

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-screen-md flex-col gap-3 px-6 pt-24 pb-6 md:px-12 md:pt-28">
      {empty ? (
        <EmptyState {...voice} onAsk={(question) => send(question)} />
      ) : (
        <Transcript
          {...voice}
          endRef={endRef}
          messages={messages}
          onReset={reset}
        />
      )}

      <Composer
        busy={busy}
        listening={dictation.listening}
        onChange={setInput}
        onSend={() => send(input)}
        onStop={() => abortRef.current?.abort()}
        onToggleVoice={toggleVoice}
        textareaRef={textareaRef}
        transcribing={dictation.transcribing}
        value={input}
        voiceError={dictation.error}
        voiceLabel={voiceLabel}
        voiceSupported={dictation.supported}
      />
    </section>
  );
};
