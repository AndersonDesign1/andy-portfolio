"use client";

import { useEffect, useRef, useState } from "react";

import type { HoldSource } from "@/components/ai/orb-button";

interface Dictation {
  listening: boolean;
  transcribing: boolean;
  start: () => void;
  stop: () => void;
  cancel: () => void;
}

/**
 * Push-to-talk on the orb, WhatsApp style: hold to record, let go to send,
 * slide up to lock (keep talking hands-free; the next press finishes it),
 * slide away or press Escape to cancel. Holding interrupts an answer in
 * progress, like talking over someone.
 */
export const useOrbPress = (dictation: Dictation, stopAnswer: () => void) => {
  /** True only while a recording the orb started is being held. */
  const holding = useRef(false);
  /** Held by pointer or key, or locked hands-free. */
  const [press, setPress] = useState<"idle" | HoldSource | "locked">("idle");
  const locked = press === "locked" && dictation.listening;

  const holdStart = (source: HoldSource) => {
    if (locked) {
      setPress("idle");
      dictation.stop();

      return;
    }

    // The composer mic is already recording: the orb leaves it alone.
    if (dictation.listening || dictation.transcribing) {
      return;
    }

    holding.current = true;
    setPress(source);
    stopAnswer();
    dictation.start();
  };

  const holdEnd = (cancelled: boolean) => {
    if (!holding.current) {
      return;
    }

    holding.current = false;
    setPress("idle");

    if (cancelled) {
      dictation.cancel();
    } else {
      dictation.stop();
    }
  };

  /** Slid up: the finger can lift and the recording keeps going. */
  const lock = () => {
    if (!holding.current) {
      return;
    }

    holding.current = false;
    setPress("locked");

    if ("vibrate" in navigator) {
      navigator.vibrate(12);
    }
  };

  const cancel = () => {
    holding.current = false;
    setPress("idle");
    dictation.cancel();
  };

  // Escape cancels any recording, wherever focus is.
  const recording = dictation.listening;
  const cancelDictation = dictation.cancel;

  useEffect(() => {
    if (!recording) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        holding.current = false;
        setPress("idle");
        cancelDictation();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording, cancelDictation]);

  return {
    handleCancel: cancel,
    handleHoldEnd: holdEnd,
    handleHoldStart: holdStart,
    handleLock: lock,
    /** Held with a finger or mouse, so sliding up can lock it. */
    lockable: press === "pointer",
    locked,
  };
};
