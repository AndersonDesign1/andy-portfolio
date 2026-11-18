"use client";

import { useEffect, useRef, useState } from "react";

import { AiTutorial } from "@/components/ai/ai-tutorial";
import { useHydrated } from "@/components/ai/chat-storage";
import { Composer, MAX_CHARS } from "@/components/ai/composer";
import { ConversationDrawer } from "@/components/ai/conversation-drawer";
import { EmptyState } from "@/components/ai/empty-state";
import { LatestExchange } from "@/components/ai/latest-exchange";
import { usePreloadReplyRenderer } from "@/components/ai/message-list";
import type { OrbState } from "@/components/ai/orb";
import { OrbButton } from "@/components/ai/orb-button";
import { OrbDock, WideActions } from "@/components/ai/orb-dock";
import { useChatSession } from "@/components/ai/use-chat-session";
import { useDictation } from "@/components/ai/use-dictation";
import { useOrbPress } from "@/components/ai/use-orb-press";
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
 * text box, then send. The text box takes the orb's place only while there's
 * something to check or type, and sending closes it again. On phones the orb
 * sits at the bottom, under the thumb. Only the latest answer stays on the
 * page; the full conversation opens in a drawer. A short guide opens every
 * time the page does.
 */
export const AiChat = () => {
  const chat = useChatSession();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  /** The guide opens every time someone lands on the page (once hydrated), until closed. */
  const [tutorialClosed, setTutorialClosed] = useState(false);
  const tutorialOpen = useHydrated() && !tutorialClosed;
  /** A voice transcript is waiting in the text box for the visitor to check and send. */
  const [draftFromVoice, setDraftFromVoice] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /** "Type" beside the orb on phones, and the text button on wider screens. */
  const typeDockRef = useRef<HTMLButtonElement>(null);
  const typeWideRef = useRef<HTMLButtonElement>(null);
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
  const orb = useOrbPress(dictation, chat.stop);
  const voiceSupported = dictation.supported;
  const showComposer = typing || !voiceSupported;

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

      // Sent: the text box closes and the orb is back for the next question.
      if (voiceSupported) {
        returnFocus.current = true;
        setTyping(false);
      }
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

      // Whichever "Type" button this screen size shows (the other is display: none).
      const visible = [typeDockRef.current, typeWideRef.current].find(
        (button) => button?.offsetParent
      );

      visible?.focus();
    }
  }, [typing]);

  usePreloadReplyRenderer();

  const empty = chat.messages.length === 0;

  const openTutorial = () => setTutorialClosed(false);
  const openComposer = () => setTyping(true);

  return (
    <section className="mx-auto flex h-dvh w-full max-w-screen-md flex-col items-center gap-3 px-4 pt-16 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 md:gap-4 md:px-12 md:pt-28 md:pb-4">
      {/* The orb: at the bottom on phones (hidden while the text box is open), at the top on wider screens. */}
      <OrbDock
        hidden={showComposer}
        hintSpace={empty && voiceSupported}
        onHelp={openTutorial}
        onType={openComposer}
        typeRef={typeDockRef}
        voiceSupported={voiceSupported}
      >
        <div
          className="relative flex shrink-0 flex-col items-center"
          ref={stageRef}
        >
          <OrbButton
            className={cn(
              "transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none",
              empty
                ? "w-[min(44vw,190px,24dvh)] md:w-[min(30vw,264px,30dvh)]"
                : "w-[min(24vw,92px,13dvh)] md:w-[min(18vw,150px,18dvh)]"
            )}
            listening={dictation.listening}
            onCancelArmedChange={setCancelArmed}
            onHoldEnd={orb.handleHoldEnd}
            onHoldStart={orb.handleHoldStart}
            onLock={orb.handleLock}
            orbRef={orbRef}
            orbState={ORB_STATE[phase]}
            voiceSupported={voiceSupported}
          />
          <VoiceStatus
            cancelArmed={cancelArmed}
            error={dictation.error}
            hintOnPhones={empty}
            lockable={orb.lockable}
            locked={orb.locked}
            onCancelVoice={orb.handleCancel}
            onStopAnswer={() => chat.stop()}
            phase={phase}
            recordingSince={dictation.recordingSince}
            reviewing={draftFromVoice && input.trim().length > 0}
            voiceSupported={voiceSupported}
          />
        </div>
      </OrbDock>

      <div
        className={cn(
          "order-1 flex min-h-0 w-full flex-1 flex-col items-center md:order-2",
          empty && "justify-center gap-6"
        )}
      >
        {empty ? (
          <>
            <EmptyState />
            {!showComposer && (
              <WideActions
                empty={empty}
                onHelp={openTutorial}
                onType={openComposer}
                typeRef={typeWideRef}
              />
            )}
          </>
        ) : (
          <LatestExchange
            busy={chat.busy}
            messages={chat.messages}
            onOpenConversation={() => setDrawerOpen(true)}
            onReset={reset}
            onRetry={() => chat.retry()}
          />
        )}
      </div>

      <div className="order-3 flex w-full shrink-0 flex-col items-center gap-2">
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
          !empty && (
            <WideActions
              empty={empty}
              onHelp={openTutorial}
              onType={openComposer}
              typeRef={typeWideRef}
            />
          )
        )}
        {empty && (
          <p className="text-muted text-center text-[11px] whitespace-nowrap md:text-xs">
            AI can make mistakes. Check important info.
          </p>
        )}
      </div>

      <ConversationDrawer
        busy={chat.busy}
        messages={chat.messages}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
      <AiTutorial
        onClose={() => setTutorialClosed(true)}
        open={tutorialOpen}
        voiceSupported={voiceSupported}
      />
    </section>
  );
};
