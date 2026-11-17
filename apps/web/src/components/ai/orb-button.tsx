"use client";

import { useRef } from "react";
import type { KeyboardEvent, PointerEvent, Ref } from "react";

import { Orb } from "@/components/ai/orb";
import type { OrbState } from "@/components/ai/orb";
import { cn } from "@/lib/utils";

/** Dragging this far from where the press began arms "release to cancel". */
const CANCEL_DISTANCE_PX = 90;

interface OrbButtonProps {
  orbRef: Ref<HTMLDivElement>;
  orbState: OrbState;
  listening: boolean;
  voiceSupported: boolean;
  onHoldStart: () => void;
  /** `cancelled` is true when the press ended dragged away (or with Escape). */
  onHoldEnd: (cancelled: boolean) => void;
  onCancelArmedChange: (armed: boolean) => void;
  className?: string;
}

const isHoldKey = (event: KeyboardEvent) =>
  event.key === " " || event.key === "Enter";

/**
 * Push-to-talk: recording runs while the orb is pressed (mouse, touch or
 * Space/Enter) and is sent the moment it's released. Dragging away before
 * letting go, or pressing Escape, cancels instead.
 */
export const OrbButton = ({
  orbRef,
  orbState,
  listening,
  voiceSupported,
  onHoldStart,
  onHoldEnd,
  onCancelArmedChange,
  className,
}: OrbButtonProps) => {
  const press = useRef({ active: false, armed: false, x: 0, y: 0 });

  const setArmed = (armed: boolean) => {
    if (press.current.armed !== armed) {
      press.current.armed = armed;
      onCancelArmedChange(armed);
    }
  };

  const begin = (x: number, y: number) => {
    press.current = { active: true, armed: false, x, y };
    onHoldStart();
  };

  const end = (forceCancel = false) => {
    if (!press.current.active) {
      return;
    }

    const cancelled = forceCancel || press.current.armed;
    press.current.active = false;
    setArmed(false);
    onHoldEnd(cancelled);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    // Keep receiving pointer events even if the finger slides off the orb.
    event.currentTarget.setPointerCapture(event.pointerId);
    begin(event.clientX, event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (press.current.active) {
      const distance = Math.hypot(
        event.clientX - press.current.x,
        event.clientY - press.current.y
      );

      setArmed(distance > CANCEL_DISTANCE_PX);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      end(true);

      return;
    }

    if (isHoldKey(event) && !event.repeat) {
      event.preventDefault();
      begin(0, 0);
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isHoldKey(event)) {
      event.preventDefault();
      end();
    }
  };

  return (
    <button
      aria-describedby="ai-voice-status"
      aria-label={voiceSupported ? "Hold to talk" : "Andy's AI"}
      aria-pressed={voiceSupported ? listening : undefined}
      className={cn(
        "focus-visible:ring-foreground/40 touch-none rounded-full select-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default",
        className
      )}
      disabled={!voiceSupported}
      onBlur={() => end()}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onPointerCancel={() => end(true)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => end()}
      type="button"
    >
      <Orb ref={orbRef} state={orbState} />
    </button>
  );
};
