"use client";

import { KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

import { failureText, readStream } from "@/components/ai/chat-stream";
import type { ChatMessage, ChatStatus } from "@/components/ai/chat-stream";
import { Composer, MAX_CHARS } from "@/components/ai/composer";
import { ConversationDrawer } from "@/components/ai/conversation-drawer";
import { EmptyState } from "@/components/ai/empty-state";
import { LatestExchange } from "@/components/ai/latest-exchange";
import type { OrbState } from "@/components/ai/orb";
import { OrbButton } from "@/components/ai/orb-button";
import { useDictation } from "@/components/ai/use-dictation";
import { VoiceStatus } from "@/components/ai/voice-status";
import type { VoicePhase } from "@/components/ai/voice-status";
import { cn } from "@/lib/utils";

/** Recent messages sent with each question; the assistant trims to its own limit. */
const HISTORY_SENT = 20;

const STOPPED_TEXT = "Stopped before an answer arrived.";

const OFFLINE_TEXT =
  "Couldn't reach Andy's AI. Check your connection and try again.";

const ORB_STATE: Record<VoicePhase, OrbState> = {
  answering: "answering",
  idle: "idle",
  processing: "thinking",
  recording: "listening",
  thinking: "thinking",
};

let nextId = 0;

/**
 * The /ai page, voice first: hold the orb to ask, and the spoken question is
 * sent as soon as it's transcribed. Typing is optional, and only the latest
 * answer stays on the page; the full conversation opens in a drawer.
 */
export const AiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [typing, setTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  /** A voice transcript is waiting in the text box for the visitor to check and send. */
  const [draftFromVoice, setDraftFromVoice] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController>(null);

  const busy = status !== "idle";

  const send = async (raw: string) => {
    const question = raw.trim();

    if (!question || busy) {
      return;
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

  const dictation = useDictation({
    onLevel: (level) =>
      stageRef.current?.style.setProperty("--orb-level", level.toFixed(3)),
    // The transcript lands in the text box (opened if hidden) to check, edit
    // and send; it's appended to whatever is there, including edits made
    // while it was transcribing.
    onTranscript: (spoken) => {
      setInput((current) => {
        const typed = current.trim();

        return (typed ? `${typed} ${spoken}` : spoken).slice(0, MAX_CHARS);
      });
      setTyping(true);
      setDraftFromVoice(true);

      requestAnimationFrame(() => {
        const box = textareaRef.current;

        if (box) {
          box.focus();
          box.setSelectionRange(box.value.length, box.value.length);
        }
      });
    },
  });

  const phaseFor = (): VoicePhase => {
    if (dictation.listening) {
      return "recording";
    }

    if (dictation.transcribing) {
      return "processing";
    }

    return status === "idle" ? "idle" : status;
  };

  const phase = phaseFor();
  const voiceSupported = dictation.supported;
  const showComposer = typing || !voiceSupported;

  /** Holding the orb interrupts an answer in progress, like talking over someone. */
  const holdStart = () => {
    abortRef.current?.abort();
    dictation.start();
  };

  const holdEnd = (cancelled: boolean) => {
    if (cancelled) {
      dictation.cancel();
    } else {
      dictation.stop();
    }
  };

  const toggleComposerVoice = () => {
    dictation.toggle();
    textareaRef.current?.focus();
  };

  const ask = (question: string) => {
    dictation.cancel();
    setDraftFromVoice(false);
    send(question);
  };

  const reset = () => {
    abortRef.current?.abort();
    dictation.cancel();
    setMessages([]);
    setInput("");
    setDrawerOpen(false);
  };

  // Opening the text box puts the cursor in it.
  useEffect(() => {
    if (typing) {
      textareaRef.current?.focus();
    }
  }, [typing]);

  // Leaving the page stops an in-flight reply.
  useEffect(() => () => abortRef.current?.abort(), []);

  const empty = messages.length === 0;

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-screen-md flex-col items-center gap-6 px-6 pt-24 pb-6 md:px-12 md:pt-28">
      <div
        className={cn(
          "flex w-full flex-col items-center",
          empty ? "flex-1 justify-center gap-8" : "gap-6"
        )}
      >
        <div className="flex flex-col items-center gap-3" ref={stageRef}>
          <OrbButton
            className={cn(
              "transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none",
              empty ? "w-[min(58vw,264px,30dvh)]" : "w-[min(36vw,150px,18dvh)]"
            )}
            listening={dictation.listening}
            onCancelArmedChange={setCancelArmed}
            onHoldEnd={holdEnd}
            onHoldStart={holdStart}
            orbRef={orbRef}
            orbState={ORB_STATE[phase]}
            voiceSupported={voiceSupported}
          />
          <VoiceStatus
            cancelArmed={cancelArmed}
            error={dictation.error}
            onCancelVoice={() => dictation.cancel()}
            onStopAnswer={() => abortRef.current?.abort()}
            phase={phase}
            recordingSince={dictation.recordingSince}
            reviewing={draftFromVoice && input.trim().length > 0}
            voiceSupported={voiceSupported}
          />
        </div>

        {empty ? (
          <EmptyState onAsk={ask} />
        ) : (
          <LatestExchange
            busy={busy}
            messages={messages}
            onOpenConversation={() => setDrawerOpen(true)}
            onReset={reset}
          />
        )}
      </div>

      <div className="sticky bottom-4 mt-auto flex w-full flex-col items-center gap-3">
        {showComposer ? (
          <div className="w-full">
            <Composer
              busy={busy}
              listening={dictation.listening}
              onChange={setInput}
              onClose={() => setTyping(false)}
              onSend={() => ask(input)}
              onStop={() => abortRef.current?.abort()}
              onToggleVoice={toggleComposerVoice}
              textareaRef={textareaRef}
              transcribing={dictation.transcribing}
              value={input}
              voiceError={dictation.error}
              voiceLabel={
                dictation.listening
                  ? "Stop recording"
                  : "Record into the text box"
              }
              voiceSupported={voiceSupported}
            />
          </div>
        ) : (
          <button
            className="border-subtle text-secondary hover:text-primary hover:bg-secondary/60 bg-background/85 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm backdrop-blur-md transition-colors"
            onClick={() => setTyping(true)}
            type="button"
          >
            <HugeiconsIcon icon={KeyboardIcon} size={16} />
            Type instead
          </button>
        )}
        <p className="text-muted text-center text-xs">
          AI can get things wrong. Double-check anything important.
        </p>
      </div>

      <ConversationDrawer
        messages={messages}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </section>
  );
};
