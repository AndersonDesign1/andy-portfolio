"use client";

import type { KeyboardEvent, PointerEvent, Ref } from "react";

import { Orb } from "@/components/ai/orb";
import type { OrbState } from "@/components/ai/orb";
import { cn } from "@/lib/utils";

interface OrbButtonProps {
  orbRef: Ref<HTMLDivElement>;
  orbState: OrbState;
  listening: boolean;
  voiceSupported: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  className?: string;
}

const isHoldKey = (event: KeyboardEvent) =>
  event.key === " " || event.key === "Enter";

/**
 * Push-to-talk: dictation runs while the orb is pressed (mouse, touch or
 * Space/Enter) and stops the moment it's released.
 */
export const OrbButton = ({
  orbRef,
  orbState,
  listening,
  voiceSupported,
  onHoldStart,
  onHoldEnd,
  className,
}: OrbButtonProps) => {
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    // Keep receiving pointerup even if the finger slides off the orb.
    event.currentTarget.setPointerCapture(event.pointerId);
    onHoldStart();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isHoldKey(event) && !event.repeat) {
      event.preventDefault();
      onHoldStart();
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isHoldKey(event)) {
      event.preventDefault();
      onHoldEnd();
    }
  };

  return (
    <button
      aria-label={voiceSupported ? "Hold to talk" : "Andy's AI"}
      aria-pressed={voiceSupported ? listening : undefined}
      className={cn(
        "focus-visible:ring-foreground/40 touch-none rounded-full select-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default",
        className
      )}
      disabled={!voiceSupported}
      onBlur={onHoldEnd}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onPointerCancel={onHoldEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onHoldEnd}
      type="button"
    >
      <Orb ref={orbRef} state={orbState} />
    </button>
  );
};
