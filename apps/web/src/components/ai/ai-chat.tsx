"use client";

import { KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

import { Composer, MAX_CHARS } from "@/components/ai/composer";
import { ConversationDrawer } from "@/components/ai/conversation-drawer";
import { EmptyState } from "@/components/ai/empty-state";
import { LatestExchange } from "@/components/ai/latest-exchange";
import type { OrbState } from "@/components/ai/orb";
import { OrbButton } from "@/components/ai/orb-button";
import { useChatSession } from "@/components/ai/use-chat-session";
import { useDictation } from "@/components/ai/use-dictation";
import { VoiceStatus } from "@/components/ai/voice-status";
import type { VoicePhase } from "@/components/ai/voice-status";
import { cn } from "@/lib/utils";

const ORB_STATE: Record<VoicePhase, OrbState> = {
  answering: "answering",
  idle: "idle",
  processing: "thinking",
  recording: "listening",
  thinking: "thinking",
};

/**
 * The /ai page, voice first: hold the orb to ask, check the transcript in the
 * text box, then send. Typing is optional, and only the latest answer stays
 * on the page; the full conversation opens in a drawer.
 */
export const AiChat = () => {
  const chat = useChatSession();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  /** A voice transcript is waiting in the text box for the visitor to check and send. */
  const [draftFromVoice, setDraftFromVoice] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typeInsteadRef = useRef<HTMLButtonElement>(null);
  /** True only while a recording the orb started is being held. */
  const orbHolding = useRef(false);
  /** Set when the composer is closed, so focus goes back to "Type instead". */
  const returnFocus = useRef(false);

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

    return chat.status === "idle" ? "idle" : chat.status;
  };

  const phase = phaseFor();
  const voiceSupported = dictation.supported;
  const showComposer = typing || !voiceSupported;

  /** Holding the orb interrupts an answer in progress, like talking over someone. */
  const holdStart = () => {
    // The composer mic is already recording: the orb leaves it alone.
    if (dictation.listening || dictation.transcribing) {
      return;
    }

    orbHolding.current = true;
    chat.stop();
    dictation.start();
  };

  const holdEnd = (cancelled: boolean) => {
    if (!orbHolding.current) {
      return;
    }

    orbHolding.current = false;

    if (cancelled) {
      dictation.cancel();
    } else {
      dictation.stop();
    }
  };

  /** Closing the text box drops any recording it started, and returns focus to its trigger. */
  const closeComposer = () => {
    if (dictation.listening || dictation.transcribing) {
      dictation.cancel();
    }

    returnFocus.current = true;
    setTyping(false);
  };

  const toggleComposerVoice = () => {
    dictation.toggle();
    textareaRef.current?.focus();
  };

  const ask = (question: string) => {
    dictation.cancel();

    if (chat.send(question)) {
      setInput("");
      setDraftFromVoice(false);
    }
  };

  const reset = () => {
    chat.clear();
    dictation.cancel();
    setInput("");
    setDraftFromVoice(false);
    setDrawerOpen(false);
  };

  // Opening the text box puts the cursor in it.
  useEffect(() => {
    if (typing) {
      textareaRef.current?.focus();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      typeInsteadRef.current?.focus();
    }
  }, [typing]);

  // Escape cancels any recording, wherever focus is.
  const recording = dictation.listening;
  const cancelVoice = dictation.cancel;

  useEffect(() => {
    if (!recording) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        orbHolding.current = false;
        cancelVoice();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording, cancelVoice]);

  const empty = chat.messages.length === 0;

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
            onStopAnswer={() => chat.stop()}
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
            busy={chat.busy}
            messages={chat.messages}
            onOpenConversation={() => setDrawerOpen(true)}
            onReset={reset}
          />
        )}
      </div>

      <div className="sticky bottom-4 mt-auto flex w-full flex-col items-center gap-3">
        {showComposer ? (
          <div className="w-full">
            <Composer
              busy={chat.busy}
              listening={dictation.listening}
              onChange={setInput}
              onClose={closeComposer}
              onSend={() => ask(input)}
              onStop={() => chat.stop()}
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
            ref={typeInsteadRef}
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
        messages={chat.messages}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </section>
  );
};
