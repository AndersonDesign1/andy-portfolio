"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const CtaSection = () => (
  <section className="bg-primary py-24 md:py-32">
    <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
      <div className="flex flex-col gap-8 md:items-start">
        <h2 className="text-primary max-w-xl text-4xl leading-[1.1] font-bold tracking-tighter md:text-5xl lg:text-6xl">
          Got a project?
        </h2>

        <p className="text-secondary max-w-md text-lg leading-relaxed md:text-xl">
          I&apos;m currently available. Let&apos;s build something that actually
          gets results.
        </p>

        <div className="pt-4">
          <a
            className="group border-subtle text-primary hover:border-primary hover:bg-secondary/50 inline-flex items-center gap-2 rounded-sm border px-8 py-4 text-base font-medium transition-[background-color,border-color,transform,backdrop-filter] duration-200 ease-[var(--ease-out)] hover:backdrop-blur-sm active:scale-[0.96] motion-reduce:active:scale-100"
            href="/contact"
          >
            Get in Touch
            <HugeiconsIcon
              className="text-muted group-hover:text-primary transition-colors duration-200 ease-out"
              color="currentColor"
              icon={ArrowUpRight01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
