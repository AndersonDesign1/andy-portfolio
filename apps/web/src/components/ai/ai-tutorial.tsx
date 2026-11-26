"use client";

import {
  ArrowUp02Icon,
  Cancel01Icon,
  KeyboardIcon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Orb } from "@/components/ai/orb";
import { cn } from "@/lib/utils";

interface Step {
  art: ReactNode;
  body: string;
  short: string;
  title: string;
}

const ArtFrame = ({ children }: { children: ReactNode }) => (
  <div className="flex h-40 items-center justify-center rounded-2xl bg-[var(--surface)] px-5">
    {children}
  </div>
);

const voiceSteps: Step[] = [
  {
    art: (
      <ArtFrame>
        <div className="flex flex-col items-center gap-3">
          <Orb className="w-20" state="listening" />
          <span className="rounded-full bg-[var(--raised)] px-3 py-1 text-xs font-medium text-[var(--fg-2)]">
            Hold · talk · let go
          </span>
        </div>
      </ArtFrame>
    ),
    body: "Press and hold the orb, ask your question out loud, then let go. Slide up to lock hands-free, or slide sideways to cancel.",
    short: "Talk",
    title: "Hold the orb and talk",
  },
  {
    art: (
      <ArtFrame>
        <div className="flex w-full max-w-[260px] items-center gap-2 rounded-2xl bg-[var(--raised)] p-2 pl-3.5 text-left text-xs shadow-[0_12px_30px_-18px_var(--shadow)]">
          <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--fg)]">
            Tell me about Graft
          </span>
          <span className="inline-grid size-7 shrink-0 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)]">
            <HugeiconsIcon icon={ArrowUp02Icon} size={14} strokeWidth={1.8} />
          </span>
        </div>
      </ArtFrame>
    ),
    body: "Your words appear in the box below so you can fix anything before sending. Once sent, the orb comes right back for the next question.",
    short: "Check",
    title: "Check it, then send",
  },
  {
    art: (
      <ArtFrame>
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <span className="inline-grid size-12 place-items-center rounded-full bg-[var(--raised)] text-[var(--fg)] shadow-sm">
              <HugeiconsIcon icon={KeyboardIcon} size={20} />
            </span>
            <span className="text-xs font-medium text-[var(--mute)]">Type</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="inline-grid size-12 place-items-center rounded-full bg-[var(--raised)] text-[var(--fg)] shadow-sm">
              <HugeiconsIcon icon={Share08Icon} size={20} />
            </span>
            <span className="text-xs font-medium text-[var(--mute)]">
              24h link
            </span>
          </div>
        </div>
      </ArtFrame>
    ),
    body: "Prefer typing? Open the text box anytime. Share creates a 24-hour link to your chat, and your session stays on this device for an hour.",
    short: "Share",
    title: "Type or share",
  },
];

const textSteps: Step[] = [
  {
    art: (
      <ArtFrame>
        <div className="flex flex-col items-center gap-2">
          <span className="inline-grid size-12 place-items-center rounded-full bg-[var(--raised)] text-[var(--fg)] shadow-sm">
            <HugeiconsIcon icon={KeyboardIcon} size={22} />
          </span>
          <span className="text-xs text-[var(--mute)]">Type below</span>
        </div>
      </ArtFrame>
    ),
    body: "Voice isn't available in this browser, so type your question in the box at the bottom and press Enter to send.",
    short: "Type",
    title: "Type your question",
  },
  voiceSteps[2] ?? { art: null, body: "", short: "Share", title: "" },
];

/**
 * Step-by-step guide styled in Round 3's soft elevated surfaces and pill tabs.
 */
export const AiTutorial = ({
  open,
  voiceSupported,
  onClose,
}: {
  open: boolean;
  voiceSupported: boolean;
  onClose: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const steps = voiceSupported ? voiceSteps : textSteps;
  const current = Math.min(index, steps.length - 1);
  const step = steps[current];
  const last = current === steps.length - 1;

  const close = () => {
    setIndex(0);
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      nextRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!step) {
    return null;
  }

  return (
    <dialog
      aria-describedby="ai-tutorial-body"
      aria-labelledby="ai-tutorial-title"
      className="ai-sheet fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[24px] bg-[var(--raised)] p-0 text-[var(--fg)] shadow-[0_24px_60px_-24px_var(--shadow),inset_0_0_0_1px_rgb(128_128_128/0.14)] backdrop:bg-black/45 backdrop:backdrop-blur-sm sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[25rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px]"
      onClose={close}
      ref={dialogRef}
    >
      <div className="flex flex-col gap-5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-full bg-[var(--surface)] p-1">
            {steps.map((item, stepIndex) => {
              const active = stepIndex === current;

              return (
                <button
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
                    active
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "text-[var(--mute)] hover:text-[var(--fg)]"
                  )}
                  key={item.title}
                  onClick={() => setIndex(stepIndex)}
                  type="button"
                >
                  <span className="tabular-nums opacity-75">
                    0{stepIndex + 1}
                  </span>
                  <span>{item.short}</span>
                </button>
              );
            })}
          </div>
          <button
            aria-label="Close the guide"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--mute)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)]"
            onClick={close}
            type="button"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </header>

        <div className="ai-rise" key={step.title}>
          {step.art}
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="flex flex-col gap-1.5 px-0.5"
        >
          <h2
            className="text-[21px] leading-snug font-[560] tracking-[-0.03em] text-[var(--fg)]"
            id="ai-tutorial-title"
          >
            {step.title}
          </h2>
          <p
            className="text-[14.5px] leading-relaxed text-[var(--fg-2)]"
            id="ai-tutorial-body"
          >
            {step.body}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[var(--mute)] tabular-nums">
            Step {current + 1} of {steps.length}
          </span>
          <div className="flex gap-2">
            {current > 0 && (
              <button
                className="min-h-10 rounded-full bg-[var(--surface)] px-4 text-sm font-medium text-[var(--fg)] transition-opacity hover:opacity-85 active:scale-[0.97]"
                onClick={() => setIndex(current - 1)}
                type="button"
              >
                Back
              </button>
            )}
            <button
              className="min-h-10 rounded-full bg-[var(--fg)] px-5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 active:scale-[0.97]"
              onClick={last ? close : () => setIndex(current + 1)}
              ref={nextRef}
              type="button"
            >
              {last ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
