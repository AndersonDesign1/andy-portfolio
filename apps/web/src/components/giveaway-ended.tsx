"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { m, useReducedMotion } from "motion/react";

import MotionRoot from "@/components/motion-root";
import {
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

const GiveawayEnded = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionRoot>
      <section className="bg-primary min-h-screen pt-40 pb-24 md:pt-48">
        <div className="mx-auto w-full max-w-screen-md px-6 text-center md:px-12">
          <m.div
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: ANIMATION_DURATION_MEDIUM,
                    ease: ANIMATION_EASE_CUBIC,
                  }
            }
          >
            <div className="bg-secondary/10 rounded-full p-4">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-primary text-4xl font-bold md:text-5xl">
              Giveaway Concluded
            </h1>
            <p className="text-secondary mx-auto max-w-lg text-lg leading-relaxed">
              The New Year Giveaway has officially ended. Thank you to everyone
              who participated! Stay tuned — something else might be coming in
              later on…
            </p>
            <div className="pt-8">
              <a
                className="border-primary text-primary inline-flex items-center gap-2 border-b pb-1 transition-opacity hover:opacity-70"
                href="/"
              >
                <HugeiconsIcon
                  color="currentColor"
                  icon={ArrowLeft01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
                Return to Home
              </a>
            </div>
          </m.div>
        </div>
      </section>
    </MotionRoot>
  );
};

export default GiveawayEnded;
