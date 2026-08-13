"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/** Each Astro React island is its own tree — wrap `m.*` usage in LazyMotion. */
const MotionRoot = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);

export default MotionRoot;
