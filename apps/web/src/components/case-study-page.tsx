"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ANIMATION_EASE_CUBIC } from "@/lib/constants";
import type { CaseStudy } from "@/types/case-study";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: ANIMATION_EASE_CUBIC,
    },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export default function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="min-h-screen bg-primary pt-48 md:pt-64">
      <div className="mx-auto mb-20 max-w-screen-xl px-6 md:px-12">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm transition-colors duration-300 hover:text-primary"
            href="/projects"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </Link>
        </motion.div>
      </div>

      <section className="mx-auto mb-24 max-w-screen-xl px-4 md:mb-32 md:px-8">
        <motion.div
          animate="visible"
          className="space-y-12 md:space-y-24"
          initial="hidden"
          variants={stagger}
        >
          <motion.div className="space-y-8 md:space-y-12" variants={fadeInUp}>
            <div className="grid grid-cols-1 border-subtle border-y md:grid-cols-4">
              <div className="border-subtle border-b py-4 md:border-r md:border-b-0 md:py-6">
                <span className="mb-2 block font-mono text-muted text-xs uppercase tracking-widest">
                  Client
                </span>
                <span className="text-secondary text-sm md:text-base">
                  {caseStudy.hero.client}
                </span>
              </div>
              <div className="border-subtle border-b py-4 md:border-r md:border-b-0 md:py-6 md:pl-8">
                <span className="mb-2 block font-mono text-muted text-xs uppercase tracking-widest">
                  Duration
                </span>
                <span className="text-secondary text-sm md:text-base">
                  {caseStudy.hero.duration}
                </span>
              </div>
              <div className="py-4 md:col-span-2 md:py-6 md:pl-8">
                <span className="mb-2 block font-mono text-muted text-xs uppercase tracking-widest">
                  Role & Tech
                </span>
                <div className="flex flex-wrap gap-x-4 text-secondary text-sm md:text-base">
                  {caseStudy.hero.technologies.slice(0, 4).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="break-words font-bold text-6xl text-primary uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl">
              {caseStudy.hero.title}
            </h1>

            <p className="ml-auto max-w-2xl font-light text-secondary text-xl leading-relaxed md:text-2xl">
              {caseStudy.hero.overview}
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video w-full border border-subtle bg-secondary/5"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ANIMATION_EASE_CUBIC }}
          >
            <Image
              alt={caseStudy.hero.title}
              className="object-cover"
              fill
              priority
              src={caseStudy.hero.heroImage}
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="border-subtle border-t">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid min-h-[50vh] grid-cols-1 md:grid-cols-12">
            <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
              <h2 className="sticky top-32 font-mono text-muted text-xs uppercase tracking-widest">
                01 — The Challenge
              </h2>
            </div>

            <div className="space-y-16 py-12 md:col-span-8 md:py-24 md:pl-12">
              <div className="space-y-8">
                <h3 className="font-medium text-3xl text-primary leading-tight md:text-4xl">
                  {caseStudy.challenge.problem}
                </h3>
                <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-4 font-mono text-muted text-sm uppercase">
                      Constraints
                    </h4>
                    <ul className="space-y-2">
                      {caseStudy.challenge.constraints.map((constraint) => (
                        <li
                          className="border-subtle border-l py-1 pl-4 text-secondary text-sm"
                          key={constraint}
                        >
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-mono text-muted text-sm uppercase">
                      Goals
                    </h4>
                    <ul className="space-y-2">
                      {caseStudy.goals.primary.map((goal) => (
                        <li
                          className="border-subtle border-l py-1 pl-4 text-secondary text-sm"
                          key={goal}
                        >
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-subtle border-t">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
              <h2 className="sticky top-32 font-mono text-muted text-xs uppercase tracking-widest">
                02 — Approach
              </h2>
            </div>
            <div className="py-12 md:col-span-8 md:py-24 md:pl-12">
              <p className="mb-16 text-secondary text-xl leading-relaxed">
                {caseStudy.approach.methodology}
              </p>

              <div className="space-y-0">
                {caseStudy.approach.phases.map((phase, index) => (
                  <div
                    className="group border-subtle border-t py-8 transition-colors first:border-t-0 hover:bg-secondary/5"
                    key={phase.name}
                  >
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-medium text-primary text-xl">
                          {phase.name}
                        </h3>
                        <span className="font-mono text-muted text-sm">
                          0{index + 1}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {phase.activities.map((act) => (
                          <li className="text-secondary text-sm" key={act}>
                            — {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-subtle border-t border-b">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
              <h2 className="sticky top-32 font-mono text-muted text-xs uppercase tracking-widest">
                03 — Impact
              </h2>
            </div>
            <div className="py-12 md:col-span-8 md:py-24 md:pl-12">
              <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
                {caseStudy.results.beforeAfter.map((metric) => (
                  <div className="space-y-4" key={metric.metric}>
                    <h3 className="font-mono text-muted text-xs uppercase tracking-widest">
                      {metric.metric}
                    </h3>
                    <div className="flex items-baseline gap-4">
                      <span className="font-bold text-4xl text-primary tracking-tight md:text-6xl">
                        {metric.after}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary text-sm">
                      <span className="text-muted line-through decoration-subtle">
                        {metric.before}
                      </span>
                      <span>→</span>
                      <span>Result</span>
                    </div>
                  </div>
                ))}
              </div>

              {caseStudy.results.metrics.length > 0 && (
                <div className="mt-20 grid grid-cols-2 gap-8 border-subtle border-t pt-12">
                  {caseStudy.results.metrics.map((m) => (
                    <p
                      className="border-primary border-l-2 py-2 pl-6 font-light text-lg text-primary"
                      key={m}
                    >
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-12 font-mono text-muted text-xs uppercase tracking-widest">
            Gallery
          </h2>
          <div className="space-y-32">
            {caseStudy.gallery.images.map((image, i) => (
              <div className="group space-y-4" key={image.src}>
                <div className="relative aspect-video w-full overflow-hidden border border-subtle bg-secondary/5">
                  <Image
                    alt={image.alt || `Project image ${i + 1}`}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    fill
                    src={image.src}
                  />
                </div>
                <div className="flex items-baseline justify-between border-subtle border-b pb-4">
                  <p className="font-medium text-primary text-sm uppercase tracking-wide">
                    {image.title}
                  </p>
                  <span className="font-mono text-muted text-xs">0{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
