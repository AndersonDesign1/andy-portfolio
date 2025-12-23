"use client";
import {
  ArrowLeftIcon,
  CheckIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ANIMATION_EASE_CUBIC, STAR_RATING_COUNT } from "@/lib/constants";
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
    <div className="min-h-screen bg-light-bg transition-colors duration-300 dark:bg-dark-bg">
      {/* Back Navigation */}
      <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-light-mini text-sm transition-colors duration-300 hover:text-light-heading dark:text-dark-mini dark:hover:text-dark-heading"
            href="/case-studies"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Case Studies
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-screen-xl px-4 py-16 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate="visible"
          className="space-y-8"
          initial="hidden"
          variants={stagger}
        >
          {/* Project Header */}
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-light-mini/10 px-4 py-2 text-light-mini text-sm dark:bg-dark-mini/10 dark:text-dark-mini">
                  {caseStudy.hero.duration}
                </span>
                <span className="rounded-full bg-light-mini/10 px-4 py-2 text-light-mini text-sm dark:bg-dark-mini/10 dark:text-dark-mini">
                  {caseStudy.hero.client}
                </span>
              </div>
              <h1 className="font-bold text-4xl text-light-heading transition-colors duration-300 md:text-5xl lg:text-6xl dark:text-dark-heading">
                {caseStudy.hero.title}
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-light-text leading-relaxed dark:text-dark-text">
              {caseStudy.hero.overview}
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: ANIMATION_EASE_CUBIC }}
          >
            <Image
              alt={caseStudy.hero.title}
              className="h-80 w-full object-cover md:h-96 lg:h-[500px]"
              height={500}
              src={caseStudy.hero.heroImage}
              width={1200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-light-heading/20 to-transparent dark:from-dark-heading/20" />
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-light-heading/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-heading/5" />
          </motion.div>

          {/* Technologies */}
          <motion.div className="space-y-4" variants={fadeInUp}>
            <h3 className="font-medium text-lg text-light-heading dark:text-dark-heading">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.hero.technologies.map((tech, index) => (
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-full bg-light-mini/10 px-3 py-1 text-light-mini text-sm dark:bg-dark-mini/10 dark:text-dark-mini"
                  initial={{ opacity: 0, y: 20 }}
                  key={tech}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: ANIMATION_EASE_CUBIC,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Challenge & Solution */}
      <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            animate="visible"
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
            initial="hidden"
            variants={stagger}
          >
            {/* Challenge */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <motion.h2
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-2xl text-light-heading dark:text-dark-heading"
                initial={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: ANIMATION_EASE_CUBIC }}
              >
                The Challenge
              </motion.h2>
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="text-light-text leading-relaxed dark:text-dark-text"
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                {caseStudy.challenge.problem}
              </motion.p>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                <h3 className="font-medium text-lg text-light-heading dark:text-dark-heading">
                  Key Constraints
                </h3>
                <ul className="space-y-2">
                  {caseStudy.challenge.constraints.map((constraint, index) => (
                    <motion.li
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 text-light-text dark:text-dark-text"
                      initial={{ opacity: 0, x: -20 }}
                      key={constraint}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + index * 0.05,
                        ease: ANIMATION_EASE_CUBIC,
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        animate={{ scale: 1 }}
                        initial={{ scale: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.4 + index * 0.05,
                          ease: "backOut",
                        }}
                      >
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-light-mini dark:text-dark-mini" />
                      </motion.div>
                      {constraint}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Goals */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <motion.h2
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-2xl text-light-heading dark:text-dark-heading"
                initial={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, ease: ANIMATION_EASE_CUBIC }}
              >
                Goals & Success Metrics
              </motion.h2>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                <h3 className="font-medium text-lg text-light-heading dark:text-dark-heading">
                  Primary Objectives
                </h3>
                <ul className="space-y-2">
                  {caseStudy.goals.primary.map((goal, index) => (
                    <motion.li
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 text-light-text dark:text-dark-text"
                      initial={{ opacity: 0, x: 20 }}
                      key={goal}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                        ease: ANIMATION_EASE_CUBIC,
                      }}
                      whileHover={{ x: -5 }}
                    >
                      <motion.div
                        animate={{ scale: 1, rotate: 0 }}
                        initial={{ scale: 0, rotate: -180 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.3 + index * 0.05,
                          ease: "backOut",
                        }}
                      >
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-light-mini dark:text-dark-mini" />
                      </motion.div>
                      {goal}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            animate="visible"
            className="space-y-12"
            initial="hidden"
            variants={stagger}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <h2 className="mb-4 font-bold text-2xl text-light-heading dark:text-dark-heading">
                My Approach
              </h2>
              <p className="mx-auto max-w-2xl text-light-text leading-relaxed dark:text-dark-text">
                {caseStudy.approach.methodology}
              </p>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
              variants={stagger}
            >
              {caseStudy.approach.phases.map((phase, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative rounded-lg bg-light-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-dark-bg"
                  initial={{ opacity: 0, y: 30 }}
                  key={phase.name}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: ANIMATION_EASE_CUBIC,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-light-heading/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-heading/5" />
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex items-start justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  >
                    <h4 className="font-medium text-light-heading dark:text-dark-heading">
                      {phase.name}
                    </h4>
                    <motion.span
                      animate={{ scale: 1 }}
                      className="rounded-full bg-light-mini/10 px-2 py-1 text-light-mini text-xs dark:bg-dark-mini/10 dark:text-dark-mini"
                      initial={{ scale: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.2 + index * 0.1,
                        ease: "backOut",
                      }}
                    >
                      {phase.duration}
                    </motion.span>
                  </motion.div>
                  <ul className="space-y-2">
                    {phase.activities.map((activity, activityIndex) => (
                      <motion.li
                        animate={{ opacity: 1, x: 0 }}
                        className="text-light-text text-sm dark:text-dark-text"
                        initial={{ opacity: 0, x: -20 }}
                        key={activity}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + index * 0.1 + activityIndex * 0.05,
                          ease: ANIMATION_EASE_CUBIC,
                        }}
                        whileHover={{ x: 5 }}
                      >
                        • {activity}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            animate="visible"
            className="space-y-12"
            initial="hidden"
            variants={stagger}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <h2 className="mb-4 font-bold text-2xl text-light-heading dark:text-dark-heading">
                Results & Impact
              </h2>
            </motion.div>

            {/* Before/After Metrics */}
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
              variants={stagger}
            >
              {caseStudy.results.beforeAfter.map((metric, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="group relative overflow-hidden rounded-xl bg-light-bg p-6 shadow-sm dark:bg-dark-bg"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  key={metric.metric}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: ANIMATION_EASE_CUBIC,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-light-heading/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-heading/5" />
                  <motion.h4
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 font-semibold text-lg text-light-heading dark:text-dark-heading"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  >
                    {metric.metric}
                  </motion.h4>
                  <div className="mb-4 space-y-4">
                    {["before", "after"].map((k, kIndex) => (
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: k === "before" ? -20 : 20 }}
                        key={k}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + index * 0.1 + kIndex * 0.05,
                          ease: ANIMATION_EASE_CUBIC,
                        }}
                      >
                        <span className="text-light-mini text-sm capitalize dark:text-dark-mini">
                          {k}:
                        </span>
                        <motion.span
                          animate={{ scale: 1 }}
                          className={`font-medium ${
                            k === "after"
                              ? "font-semibold text-light-heading dark:text-dark-heading"
                              : "text-light-text dark:text-dark-text"
                          }`}
                          initial={{ scale: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: 0.3 + index * 0.1 + kIndex * 0.05,
                            ease: "backOut",
                          }}
                        >
                          {metric[k as keyof typeof metric]}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 rounded-full bg-light-mini/10 px-4 py-2 backdrop-blur-sm dark:bg-dark-mini/10"
                    initial={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + index * 0.1,
                      ease: "backOut",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 0 }}
                      initial={{ rotate: -180 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.5 + index * 0.1,
                        ease: "backOut",
                      }}
                    >
                      <TrophyIcon className="h-4 w-4 text-light-mini dark:text-dark-mini" />
                    </motion.div>
                    <span className="font-semibold text-sm tracking-wide">
                      {metric.improvement}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional Metrics */}
            {caseStudy.results.metrics.length > 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: ANIMATION_EASE_CUBIC }}
              >
                <motion.h3
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium text-lg text-light-heading dark:text-dark-heading"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: ANIMATION_EASE_CUBIC }}
                >
                  Additional Impact
                </motion.h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {caseStudy.results.metrics.map((metric, index) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex items-center gap-3 rounded-xl bg-light-bg p-4 shadow-sm dark:bg-dark-bg"
                      initial={{ opacity: 0, y: 20 }}
                      key={metric}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: ANIMATION_EASE_CUBIC,
                      }}
                    >
                      <motion.div
                        animate={{ scale: 1, rotate: 0 }}
                        initial={{ scale: 0, rotate: -180 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                          ease: "backOut",
                        }}
                      >
                        <TrophyIcon className="h-5 w-5 text-light-mini dark:text-dark-mini" />
                      </motion.div>
                      <motion.span
                        animate={{ opacity: 1, x: 0 }}
                        className="text-light-text text-sm dark:text-dark-text"
                        initial={{ opacity: 0, x: -10 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + index * 0.05,
                          ease: ANIMATION_EASE_CUBIC,
                        }}
                      >
                        {metric}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Testimonials */}
            {caseStudy.results.testimonials &&
              caseStudy.results.testimonials.length > 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, ease: ANIMATION_EASE_CUBIC }}
                >
                  <motion.h3
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium text-lg text-light-heading dark:text-dark-heading"
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: ANIMATION_EASE_CUBIC }}
                  >
                    Client Feedback
                  </motion.h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {caseStudy.results.testimonials.map(
                      (testimonial, index) => (
                        <motion.div
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="group relative rounded-xl bg-light-bg p-6 shadow-sm dark:bg-dark-bg"
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          key={testimonial.name}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: ANIMATION_EASE_CUBIC,
                          }}
                        >
                          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-light-heading/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-heading/5" />
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-3 flex items-center gap-1"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + index * 0.1,
                            }}
                          >
                            {[...new Array(STAR_RATING_COUNT)].map(
                              (_, starIndex) => (
                                <motion.div
                                  animate={{ scale: 1, rotate: 0 }}
                                  initial={{ scale: 0, rotate: -180 }}
                                  key={`star-${starIndex}`}
                                  transition={{
                                    duration: 0.2,
                                    delay: 0.2 + index * 0.1 + starIndex * 0.05,
                                    ease: "backOut",
                                  }}
                                >
                                  <StarIcon className="h-4 w-4 fill-light-mini text-light-mini dark:fill-dark-mini dark:text-dark-mini" />
                                </motion.div>
                              )
                            )}
                          </motion.div>
                          <motion.p
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 text-light-text italic dark:text-dark-text"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + index * 0.1,
                            }}
                          >
                            &quot;{testimonial.quote}&quot;
                          </motion.p>
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.4 + index * 0.1,
                            }}
                          >
                            <p className="font-medium text-light-heading dark:text-dark-heading">
                              {testimonial.name}
                            </p>
                            <p className="text-light-mini text-sm dark:text-dark-mini">
                              {testimonial.role}
                            </p>
                          </motion.div>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
          </motion.div>
        </div>
      </section>

      {/* Project Images Gallery */}
      <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            animate="visible"
            className="space-y-12"
            initial="hidden"
            variants={stagger}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <h2 className="mb-4 font-bold text-2xl text-light-heading dark:text-dark-heading">
                Project Gallery
              </h2>
              <p className="mx-auto max-w-2xl text-light-text leading-relaxed dark:text-dark-text">
                Visual documentation of the project process and outcomes
              </p>
            </motion.div>

            {/* Main Project Images */}
            <motion.div className="space-y-8" variants={stagger}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: ANIMATION_EASE_CUBIC }}
              >
                <Image
                  alt={
                    caseStudy.gallery.images[0]?.alt ||
                    "Project wireframes and planning"
                  }
                  className="h-[500px] w-full object-cover md:h-[600px] lg:h-[700px]"
                  height={700}
                  src={caseStudy.gallery.images[0]?.src || "/my-website.webp"}
                  width={1200}
                />

                {/* Image Title Overlay */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 rounded-lg bg-light-bg/90 px-3 py-2 backdrop-blur-sm dark:bg-dark-bg/90"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.2,
                  }}
                >
                  <p className="font-medium text-light-heading text-sm dark:text-dark-heading">
                    {caseStudy.gallery.images[0]?.title ||
                      "Project wireframes and planning"}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                <Image
                  alt={
                    caseStudy.gallery.images[1]?.alt ||
                    "Development process and code"
                  }
                  className="h-[500px] w-full object-cover md:h-[600px] lg:h-[700px]"
                  height={700}
                  src={
                    caseStudy.gallery.images[1]?.src || "/new-hampshire.webp"
                  }
                  width={1200}
                />

                {/* Image Title Overlay */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 rounded-lg bg-light-bg/90 px-3 py-2 backdrop-blur-sm dark:bg-dark-bg/90"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3,
                  }}
                >
                  <p className="font-medium text-light-heading text-sm dark:text-dark-heading">
                    {caseStudy.gallery.images[1]?.title ||
                      "Development process and code"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Challenge Analysis Image */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: ANIMATION_EASE_CUBIC,
              }}
            >
              <Image
                alt={
                  caseStudy.gallery.images[2]?.alt ||
                  "Challenge analysis and problem solving"
                }
                className="h-[500px] w-full object-cover md:h-[600px] lg:h-[700px]"
                height={700}
                src={caseStudy.gallery.images[2]?.src || "/promptearn.webp"}
                width={1200}
              />

              {/* Image Title Overlay */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 rounded-lg bg-light-bg/90 px-3 py-2 backdrop-blur-sm dark:bg-dark-bg/90"
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: 0.4,
                }}
              >
                <p className="font-medium text-light-heading text-sm dark:text-dark-heading">
                  {caseStudy.gallery.images[2]?.title ||
                    "Challenge analysis and problem solving"}
                </p>
              </motion.div>
            </motion.div>

            {/* Process Images */}
            <motion.div className="space-y-8" variants={stagger}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                <Image
                  alt={
                    caseStudy.gallery.images[3]?.alt ||
                    "Development workflow and process"
                  }
                  className="h-[500px] w-full object-cover md:h-[600px] lg:h-[700px]"
                  height={700}
                  src={caseStudy.gallery.images[3]?.src || "/craigwal.webp"}
                  width={1200}
                />

                {/* Image Title Overlay */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 rounded-lg bg-light-bg/90 px-3 py-2 backdrop-blur-sm dark:bg-dark-bg/90"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.5,
                  }}
                >
                  <p className="font-medium text-light-heading text-sm dark:text-dark-heading">
                    {caseStudy.gallery.images[3]?.title ||
                      "Development workflow and process"}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4,
                  ease: ANIMATION_EASE_CUBIC,
                }}
              >
                <Image
                  alt={
                    caseStudy.gallery.images[4]?.alt ||
                    "Testing and optimization phase"
                  }
                  className="h-[500px] w-full object-cover md:h-[600px] lg:h-[700px]"
                  height={700}
                  src={caseStudy.gallery.images[4]?.src || "/dubiss.webp"}
                  width={1200}
                />

                {/* Image Title Overlay */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 rounded-lg bg-light-bg/90 px-3 py-2 backdrop-blur-sm dark:bg-dark-bg/90"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6,
                  }}
                >
                  <p className="font-medium text-light-heading text-sm dark:text-dark-heading">
                    {caseStudy.gallery.images[4]?.title ||
                      "Testing and optimization phase"}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
