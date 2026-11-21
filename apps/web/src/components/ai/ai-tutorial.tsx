"use client";

import {
  Cancel01Icon,
  KeyboardIcon,
  Share08Icon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Orb } from "@/components/ai/orb";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  body: string;
  art: ReactNode;
}

const ArtFrame = ({ children }: { children: ReactNode }) => (
  <div className="bg-secondary/60 flex h-36 items-center justify-center rounded-md">
    {children}
  </div>
);

const voiceSteps: Step[] = [
  {
    art: (
      <ArtFrame>
        <div className="flex flex-col items-center gap-2">
          <Orb className="w-20" state="listening" />
          <span className="text-secondary text-xs font-medium">
            Hold · talk · let go (or slide up to lock)
          </span>
        </div>
      </ArtFrame>
    ),
    body: "Press and hold the orb, ask your question out loud, then let go. Slide up to lock it and keep talking hands-free; slide sideways to cancel.",
    title: "Hold the orb and talk",
  },
  {
    art: (
      <ArtFrame>
        <div className="border-subtle bg-background flex w-56 items-center gap-2 rounded-md border p-2 text-left text-xs shadow-sm">
          <HugeiconsIcon
            className="text-muted shrink-0"
            icon={TextIcon}
            size={16}
          />
          <span className="text-primary min-w-0 flex-1 truncate">
            How do I speed up my site?
          </span>
          <span className="bg-foreground text-background rounded-sm px-2 py-1 text-xs font-medium">
            Send
          </span>
        </div>
      </ArtFrame>
    ),
    body: "Your words appear in a text box. Fix anything that's off, then send. The box closes and the orb comes back for your next question.",
    title: "Check it, then send",
  },
  {
    art: (
      <ArtFrame>
        <div className="flex items-center gap-6">
          <span className="border-subtle bg-background inline-flex size-12 items-center justify-center rounded-full border">
            <HugeiconsIcon icon={KeyboardIcon} size={20} />
          </span>
          <span className="border-subtle bg-background inline-flex size-12 items-center justify-center rounded-full border">
            <HugeiconsIcon icon={Share08Icon} size={20} />
          </span>
        </div>
      </ArtFrame>
    ),
    body: "Can't talk right now? Use the type option to write your question instead. Share sends someone a link to your chat that works for 24 hours, and your chat stays on this device for an hour.",
    title: "Type or share",
  },
];

const textSteps: Step[] = [
  {
    art: (
      <ArtFrame>
        <HugeiconsIcon icon={KeyboardIcon} size={32} />
      </ArtFrame>
    ),
    body: "Voice isn't available in this browser, so type your question in the box at the bottom and send it.",
    title: "Type your question",
  },
  voiceSteps[2] ?? { art: null, body: "", title: "" },
];

/**
 * A short how-to shown every time the page opens (and again from the help
 * button): hold the orb to talk, check the text, then send.
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

  /** Closing starts the guide from the top next time. */
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
      // Start on "Next" rather than the close button the browser would pick.
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
      className="ai-sheet bg-background text-primary border-subtle fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-lg border p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[24rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg"
      onClose={close}
      ref={dialogRef}
    >
      <div className="flex flex-col gap-4 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between gap-3">
          <p className="text-muted text-xs font-medium tracking-wide uppercase">
            How it works · {current + 1}/{steps.length}
          </p>
          <button
            aria-label="Close the guide"
            className="text-muted hover:text-primary hover:bg-secondary inline-flex size-11 items-center justify-center rounded-sm transition-colors sm:size-9"
            onClick={close}
            type="button"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </header>

        {step.art}

        <div
          aria-atomic="true"
          aria-live="polite"
          className="flex flex-col gap-1.5"
        >
          <h2
            className="text-xl font-semibold tracking-tight"
            id="ai-tutorial-title"
          >
            {step.title}
          </h2>
          <p
            className="text-secondary text-sm leading-relaxed"
            id="ai-tutorial-body"
          >
            {step.body}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div aria-hidden="true" className="flex gap-1.5">
            {steps.map((item, dot) => (
              <span
                className={cn(
                  "size-1.5 rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none",
                  dot === current
                    ? "bg-foreground scale-125"
                    : "bg-foreground/20"
                )}
                key={item.title}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {current > 0 && (
              <button
                className="text-secondary hover:text-primary min-h-11 rounded-full px-4 text-sm font-medium transition-colors"
                onClick={() => setIndex(current - 1)}
                type="button"
              >
                Back
              </button>
            )}
            <button
              className="bg-foreground text-background min-h-11 rounded-full px-5 text-sm font-medium active:scale-[0.97]"
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
