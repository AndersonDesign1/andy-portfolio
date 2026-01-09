"use client";

import { ArrowLeftIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

export default function GiveawayEnded() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen bg-primary pt-32 pb-24 md:pt-48">
      <div className="mx-auto w-full max-w-screen-md px-6 text-center md:px-12">
        <motion.div
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
          <div className="rounded-full bg-secondary/10 p-4">
            <span className="text-4xl">⏳</span>
          </div>
          <h1 className="font-bold text-4xl text-primary md:text-5xl">
            Giveaway Concluded
          </h1>
          <p className="mx-auto max-w-lg text-lg text-secondary leading-relaxed">
            The New Year Giveaway has officially ended. Thank you to everyone
            who participated! Stay tuned — something else might be coming in
            later on…
          </p>
          <div className="pt-8">
            <Link
              className="inline-flex items-center gap-2 border-primary border-b pb-1 text-primary transition-opacity hover:opacity-70"
              href="/"
            >
              <ArrowLeftIcon className="size-4" />
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
