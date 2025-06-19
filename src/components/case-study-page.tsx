"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  TrophyIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

function getImprovementIcon(improvement: string) {
  if (improvement.match(/\+|faster|better/))
    return <ArrowUpIcon className="w-3 h-3" />;
  if (improvement.match(/-|reduced|lower/))
    return <ArrowDownIcon className="w-3 h-3" />;
  return null;
}

function getImprovementColor(improvement: string) {
  return improvement.match(/\+|faster|better|reduced|lower|-/)
    ? "text-light-heading dark:text-dark-heading"
    : "text-light-text dark:text-dark-text";
}

export default function CaseStudyPage({ caseStudy }: { caseStudy: any }) {
  return (
    <div className="pt-24 min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Back Navigation */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="space-y-4">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold text-light-heading dark:text-dark-heading transition-colors duration-300"
                  variants={fadeInUp}
                >
                  {caseStudy.hero.title}
                </motion.h1>
                <motion.div
                  className="space-y-2 text-sm text-light-mini dark:text-dark-mini"
                  variants={fadeInUp}
                >
                  <p>
                    <span className="font-medium">Client:</span>{" "}
                    {caseStudy.hero.client}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {caseStudy.hero.duration}
                  </p>
                </motion.div>
              </div>
              <motion.p
                className="text-base text-light-text dark:text-dark-text leading-relaxed"
                variants={fadeInUp}
              >
                {caseStudy.hero.overview}
              </motion.p>
              <motion.div variants={fadeInUp} className="space-y-3">
                <h3 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.hero.technologies.map(
                    (tech: string, i: number) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="relative aspect-[4/3] rounded-lg overflow-hidden min-h-[200px] h-full"
            >
              <Image
                src={caseStudy.hero.heroImage}
                alt={caseStudy.hero.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Challenge & Context */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Challenge & Context
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                    The Problem
                  </h3>
                  <p className="text-light-text dark:text-dark-text leading-relaxed">
                    {caseStudy.challenge.problem}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                    Industry Context
                  </h3>
                  <p className="text-light-text dark:text-dark-text leading-relaxed">
                    {caseStudy.challenge.context}
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                    Key Constraints
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.challenge.constraints.map(
                      (c: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-light-text dark:text-dark-text"
                        >
                          <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                    Initial Metrics
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.challenge.metrics.map((m: string, i: number) => (
                      <li
                        key={i}
                        className="text-light-text dark:text-dark-text"
                      >
                        • {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Project Goals
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {["primary", "stakeholder", "success"].map((key) => (
                <motion.div key={key} variants={fadeInUp} className="space-y-4">
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                    {key === "primary"
                      ? "Primary Objectives"
                      : key === "stakeholder"
                      ? "Stakeholder Requirements"
                      : "Success Criteria"}
                  </h3>
                  <ul className="space-y-3">
                    {caseStudy.goals[key].map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                      >
                        <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach & Process */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Approach & Process
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                  Methodology
                </h3>
                <p className="text-light-text dark:text-dark-text leading-relaxed">
                  {caseStudy.approach.methodology}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-6">
                  Project Phases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudy.approach.phases.map((phase: any, i: number) => (
                    <div
                      key={i}
                      className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-light-heading dark:text-dark-heading">
                          {phase.name}
                        </h4>
                        <span className="text-xs text-light-mini dark:text-dark-mini">
                          {phase.duration}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {phase.activities.map((a: string, j: number) => (
                          <li
                            key={j}
                            className="text-sm text-light-text dark:text-dark-text"
                          >
                            • {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-6">
                  Key Decisions & Rationale
                </h3>
                <div className="space-y-4">
                  {caseStudy.approach.keyDecisions.map((d: any, i: number) => (
                    <div
                      key={i}
                      className="border-l-4 border-light-mini dark:border-dark-mini pl-4"
                    >
                      <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                        {d.decision}
                      </h4>
                      <p className="text-sm text-light-text dark:text-dark-text">
                        {d.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results & Impact */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Results & Impact
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-8">
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                Before vs After
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {caseStudy.results.beforeAfter.map((m: any, i: number) => (
                  <motion.div
                    key={i}
                    className="group relative overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-light-bg via-light-bg to-light-bg/50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg/50 rounded-xl" />
                    <div className="relative bg-light-bg dark:bg-dark-bg rounded-xl p-6 md:p-8 backdrop-blur-sm group-hover:shadow-md transition-all duration-300">
                      <h4 className="text-lg md:text-xl font-semibold text-light-heading dark:text-dark-heading mb-4 md:mb-6">
                        {m.metric}
                      </h4>
                      <div className="space-y-4 mb-4 md:mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-light-mini dark:text-dark-mini">
                            Before:
                          </span>
                          <span className="text-base md:text-lg font-mono text-light-text dark:text-dark-text">
                            {m.before}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-light-mini dark:text-dark-mini">
                            After:
                          </span>
                          <span className="text-base md:text-lg font-mono text-light-heading dark:text-dark-heading font-semibold">
                            {m.after}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light-mini/10 dark:bg-dark-mini/10 backdrop-blur-sm ${getImprovementColor(
                          m.improvement
                        )}`}
                      >
                        {getImprovementIcon(m.improvement)}
                        <span className="text-sm font-semibold tracking-wide">
                          {m.improvement}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-light-heading/5 to-transparent dark:from-dark-heading/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                Additional Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.results.metrics.map((m: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                  >
                    <TrophyIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    <span className="text-sm text-light-text dark:text-dark-text">
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Only render testimonials if they exist and have items */}
            {caseStudy.results.testimonials &&
              caseStudy.results.testimonials.length > 0 && (
                <motion.div variants={fadeInUp} className="space-y-6">
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                    Client Testimonials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {caseStudy.results.testimonials.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, j) => (
                            <StarIcon
                              key={j}
                              className="w-4 h-4 fill-light-mini dark:fill-dark-mini text-light-mini dark:text-dark-mini"
                            />
                          ))}
                        </div>
                        <p className="text-light-text dark:text-dark-text mb-4 italic">
                          &quot;{t.quote}&quot;
                        </p>
                        <div>
                          <p className="font-medium text-light-heading dark:text-dark-heading">
                            {t.name}
                          </p>
                          <p className="text-sm text-light-mini dark:text-dark-mini">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
          </motion.div>
        </div>
      </section>

      {/* Back to Projects */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to All Projects
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
