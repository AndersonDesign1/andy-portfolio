"use client";

import type { Ref } from "react";

import { cn } from "@/lib/utils";

export type OrbState = "idle" | "listening" | "thinking" | "answering";

interface OrbProps {
  state: OrbState;
  /** Receives the orb element so the mic level can drive `--orb-level` without re-rendering. */
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

/**
 * The /ai presence: soft, slowly morphing light in the site's own foreground
 * color, so it reads as graphite on the light theme and as light on the dark
 * one. Each state changes only motion and intensity (see `.ai-orb` in
 * global.css); `--orb-level` (0..1) swells it with the speaker's voice.
 */
export const Orb = ({ state, ref, className }: OrbProps) => (
  <div
    aria-hidden="true"
    className={cn("ai-orb", className)}
    data-state={state}
    ref={ref}
  >
    <div className="ai-orb__halo" />
    <div className="ai-orb__body">
      <div className="ai-orb__swirl" />
      <div className="ai-orb__core" />
      <div className="ai-orb__sheen" />
    </div>
  </div>
);
