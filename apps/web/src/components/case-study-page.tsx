"use client";
import { ArrowLeft, ArrowRight, Globe, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ANIMATION_EASE_CUBIC } from "@/lib/constants";
import type { CaseStudy, CaseStudyNavigation } from "@/types/case-study";

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

export default function CaseStudyPage({
  caseStudy,
  navigation,
}: {
  caseStudy: CaseStudy;
  navigation?: CaseStudyNavigation;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-primary pt-48 md:pt-64">
      <div className="mx-auto max-w-screen-xl px-6 pb-20 md:px-12">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm transition-opacity duration-300 hover:opacity-70"
            href="/projects"
          >
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>

          {caseStudy.hero.liveUrl && (
            <Link
              className="inline-flex items-center gap-2 text-secondary text-sm transition-opacity duration-300 hover:opacity-70"
              href={caseStudy.hero.liveUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Globe className="size-4" />
              Live Site
            </Link>
          )}
        </motion.div>
      </div>

      <section className="mx-auto max-w-screen-xl px-4 pb-24 md:px-8 md:pb-32">
        <motion.div
          animate="visible"
          className="flex flex-col gap-12 md:gap-24"
          initial="hidden"
          variants={stagger}
        >
          <motion.div
            className="flex flex-col gap-8 md:gap-12"
            variants={fadeInUp}
          >
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
                  Tech
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
              className="object-contain"
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

            <div className="flex flex-col gap-16 py-12 md:col-span-8 md:py-24 md:pl-12">
              <div className="flex flex-col gap-8">
                <h3 className="font-medium text-3xl text-primary leading-tight md:text-4xl">
                  {caseStudy.challenge.problem}
                </h3>
                <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2">
                  <div>
                    <h4 className="pb-4 font-mono text-muted text-sm uppercase">
                      Constraints
                    </h4>
                    <ul className="flex flex-col gap-2">
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
                    <h4 className="pb-4 font-mono text-muted text-sm uppercase">
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
              <p className="pb-16 text-secondary text-xl leading-relaxed">
                {caseStudy.approach.methodology}
              </p>

              <div className="flex flex-col gap-0">
                {caseStudy.approach.phases.map((phase, index) => (
                  <div
                    className="group border-subtle border-t py-8 transition-colors first:border-t-0 hover:bg-secondary/5"
                    key={phase.name}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-medium text-primary text-xl">
                          {phase.name}
                        </h3>
                        <span className="font-mono text-muted text-sm">
                          0{index + 1}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-1">
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
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                {caseStudy.results.beforeAfter.map((metric) => (
                  <div className="flex flex-col gap-1" key={metric.metric}>
                    <h3 className="font-mono text-muted text-xs uppercase tracking-widest">
                      {metric.metric}
                    </h3>
                    <div className="flex items-baseline gap-4">
                      <span className="font-bold text-2xl text-primary tracking-tight md:text-4xl">
                        {metric.after}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary text-sm">
                      <span className="text-muted line-through decoration-subtle">
                        {metric.before}
                      </span>
                      <ArrowRight className="inline size-4" />
                      <span>Result</span>
                    </div>
                  </div>
                ))}
              </div>

              {caseStudy.results.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-8 border-subtle border-t pt-12 pt-20">
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
          <h2 className="pb-12 font-mono text-muted text-xs uppercase tracking-widest">
            Gallery
          </h2>
          <div className="flex flex-col gap-32">
            {caseStudy.gallery.images.map((image, i) => (
              <div className="group flex flex-col gap-4" key={image.src}>
                <button
                  className="relative aspect-video w-full cursor-zoom-in overflow-hidden border border-subtle bg-secondary/5"
                  onClick={() => setSelectedImage(image.src)}
                  type="button"
                >
                  <Image
                    alt={image.alt || `Project image ${i + 1}`}
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    src={image.src}
                  />
                </button>
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

      {navigation && (navigation.prev || navigation.next) && (
        <section className="border-subtle border-t">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="grid grid-cols-2">
              <div className="group border-subtle border-r py-12 pr-6 transition-colors hover:bg-secondary/5 md:py-24">
                {navigation.prev ? (
                  <Link
                    className="block h-full"
                    href={`/case-studies/${navigation.prev.slug}`}
                    scroll={false}
                  >
                    <span className="block pb-4 font-mono text-muted text-xs uppercase tracking-widest transition-colors group-hover:text-primary">
                      Previous Case Study
                    </span>
                    <div className="flex items-center gap-4">
                      <ArrowLeft className="size-5 text-secondary transition-transform duration-300 group-hover:-translate-x-2" />
                      <h3 className="font-medium text-primary text-xl transition-opacity duration-300 group-hover:opacity-70 md:text-3xl">
                        {navigation.prev.title}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <div className="select-none opacity-0">Placeholder</div>
                )}
              </div>
              <div className="group border-subtle py-12 pl-6 text-right transition-colors hover:bg-secondary/5 md:py-24 md:pl-12">
                {navigation.next ? (
                  <Link
                    className="block h-full"
                    href={`/case-studies/${navigation.next.slug}`}
                    scroll={false}
                  >
                    <span className="block pb-4 font-mono text-muted text-xs uppercase tracking-widest transition-colors group-hover:text-primary">
                      Next Case Study
                    </span>
                    <div className="flex items-center justify-end gap-4">
                      <h3 className="font-medium text-primary text-xl transition-opacity duration-300 group-hover:opacity-70 md:text-3xl">
                        {navigation.next.title}
                      </h3>
                      <ArrowRight className="size-5 text-secondary transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                  </Link>
                ) : (
                  <div className="select-none opacity-0">Placeholder</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 z-50 p-2 text-white/70 transition-colors hover:text-white"
              onClick={() => setSelectedImage(null)}
              type="button"
            >
              <X className="size-8" />
              <span className="sr-only">Close</span>
            </button>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-video w-full max-w-7xl overflow-hidden rounded-lg shadow-2xl"
              exit={{ scale: 0.9, opacity: 0 }}
              initial={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Image
                alt="Enlarged gallery view"
                className="object-contain"
                fill
                priority
                sizes="100vw"
                src={selectedImage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
