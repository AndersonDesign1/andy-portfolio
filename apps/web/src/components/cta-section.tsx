"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CtaSection() {
  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <div className="flex flex-col gap-8 md:items-start">
          <h2 className="max-w-xl font-bold text-4xl text-primary leading-[1.1] tracking-tighter md:text-5xl lg:text-6xl">
            Got a project?
          </h2>

          <p className="max-w-md text-lg text-secondary leading-relaxed md:text-xl">
            I&apos;m currently available. Let&apos;s build something that
            actually gets results.
          </p>

          <div className="pt-4">
            <a
              className="group inline-flex items-center gap-2 rounded-sm border border-subtle px-8 py-4 font-medium text-base text-primary transition-all duration-300 ease-out hover:border-primary hover:bg-secondary/50 hover:backdrop-blur-sm"
              href="/contact"
            >
              Get in Touch
              <HugeiconsIcon
                className="text-muted transition-colors duration-200 ease-out group-hover:text-primary"
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
}
