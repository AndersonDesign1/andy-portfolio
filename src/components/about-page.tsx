"use client";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import {
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_DURATION_SHORT,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

const funFacts = [
  {
    icon: CodeBracketIcon,
    title: "Teaching & Mentorship",
    description:
      "I love sharing what I know—I've taught and mentored over 1,000 students (and counting), helping others break into tech and level up their skills.",
  },
  {
    icon: ChartBarIcon,
    title: "Accidental SEO Enthusiast",
    description:
      "I learned SEO because my boss told me to. I started watching YouTube tutorials just to keep my job, but ended up falling in love with the challenge and creativity of search optimization.",
  },
  {
    icon: ServerIcon,
    title: "Modern Infrastructure Explorer",
    description:
      "I'm obsessed with how modern infrastructure works. I spend hours reading docs, case studies, and exploring how big tech companies build and scale their systems.",
  },
  {
    icon: SparklesIcon,
    title: "Driven by Doubt",
    description:
      "I've spent a lot of my life proving people wrong about how I am or how I would end up. It's the reason I'm obsessed with building perfect solutions.",
  },
];

const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-light-bg pt-24 transition-colors duration-300 dark:bg-dark-bg">
    {/* Back Navigation */}
    <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:px-8 md:px-16 lg:px-[150px]">
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          className="inline-flex items-center gap-2 text-light-mini text-sm transition-colors duration-300 hover:text-light-heading dark:text-dark-mini dark:hover:text-dark-heading"
          href="/"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>

    {/* Hero Section */}
    <section className="py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate="visible"
          className="space-y-8"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <motion.h1
            className="font-bold text-3xl text-light-heading sm:text-4xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_MEDIUM,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            About Me
          </motion.h1>
          <motion.p
            className="max-w-3xl text-base text-light-text leading-relaxed sm:text-lg dark:text-dark-text"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_MEDIUM,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            I&apos;m a passionate full-stack developer with expertise in SEO and
            infrastructure. My journey started after winning a scholarship to
            learn a tech skill for a year—choosing development because of a
            childhood obsession with computers and how things work. Now, I
            create digital experiences that look beautiful and perform
            exceptionally well.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Professional Journey */}
    <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          className="space-y-12"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          <motion.h2
            className="font-semibold text-light-heading text-xl sm:text-2xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            Professional Journey
          </motion.h2>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: ANIMATION_DURATION_SHORT,
                    ease: ANIMATION_EASE_CUBIC,
                  },
                },
              }}
            >
              <div className="mb-2 flex items-center gap-3">
                <ChartBarIcon className="h-6 w-6 text-light-heading dark:text-dark-heading" />
                <h3 className="font-medium text-lg text-light-heading dark:text-dark-heading">
                  SEO Optimization Expert
                </h3>
              </div>
              <p className="text-light-text dark:text-dark-text">
                I&apos;ve helped businesses increase their organic traffic by an
                average of{" "}
                <span className="font-semibold text-light-heading dark:text-dark-heading">
                  285%
                </span>
                . My approach combines technical SEO mastery with content
                strategy, focusing on sustainable, white-hat techniques.
              </p>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>• Improved Core Web Vitals for 20+ websites</li>
                <li>
                  • Increased organic traffic by 400% for an e-commerce client
                </li>
                <li>• Built SEO automation tools to speed up audits</li>
                <li>• Recovered 5+ websites from Google penalties</li>
              </ul>
            </motion.div>
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: ANIMATION_DURATION_SHORT,
                    ease: ANIMATION_EASE_CUBIC,
                  },
                },
              }}
            >
              <div className="mb-2 flex items-center gap-3">
                <CodeBracketIcon className="h-6 w-6 text-light-heading dark:text-dark-heading" />
                <h3 className="font-medium text-lg text-light-heading dark:text-dark-heading">
                  Full-Stack Development
                </h3>
              </div>
              <p className="text-light-text dark:text-dark-text">
                I build scalable web applications for{" "}
                <span className="font-semibold text-light-heading dark:text-dark-heading">
                  millions of users
                </span>
                , writing clean, maintainable code and prioritizing performance
                and UX.
              </p>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>
                  • Built tens of web applications using modern stacks and tools
                </li>
                <li>• Developed real-time analytics dashboards</li>
                <li>• Created microservices to reduce server costs</li>
                <li>• Implemented CI/CD pipelines for rapid deployment</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Technical Expertise */}
    <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          className="space-y-12"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          <motion.h2
            className="font-semibold text-light-heading text-xl sm:text-2xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            Technical Expertise
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-medium text-light-heading dark:text-dark-heading">
                Cloud & DevOps
              </h4>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>• AWS/GCP architecture</li>
                <li>• Docker & Kubernetes</li>
                <li>• Infrastructure as Code</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-light-heading dark:text-dark-heading">
                Performance Optimization
              </h4>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>• Database/query optimization</li>
                <li>• Caching (Redis, CDN)</li>
                <li>• Load balancing & scaling</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-light-heading dark:text-dark-heading">
                SEO Technical Skills
              </h4>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>• Core Web Vitals</li>
                <li>• Schema markup</li>
                <li>• Technical audits</li>
                <li>• International SEO</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Personal Touch */}
    <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          className="space-y-12"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          <motion.h2
            className="font-semibold text-light-heading text-xl sm:text-2xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            The Person Behind the Code
          </motion.h2>
          <motion.p
            className="max-w-3xl text-light-text leading-relaxed dark:text-dark-text"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            My fascination with technology began after a scholarship gave me the
            chance to learn web development for a year. My curiosity about
            &ldquo;how things work&rdquo; turned into a career focused on
            building, optimizing, and scaling digital products. I believe in
            methodical, creative problem-solving and continuous learning.
          </motion.p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-light-heading dark:text-dark-heading">
                My Process
              </h4>
              <ol className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>1. Listen & Understand</li>
                <li>2. Research & Analyze</li>
                <li>3. Prototype & Test</li>
                <li>4. Iterate & Improve</li>
              </ol>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-light-heading dark:text-dark-heading">
                Learning Philosophy
              </h4>
              <ul className="space-y-1 text-light-text text-sm dark:text-dark-text">
                <li>• Stay curious about new tech</li>
                <li>• Learn from failures and successes</li>
                <li>• Share knowledge and mentor</li>
                <li>• Question best practices</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Fun Facts */}
    <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          className="space-y-12"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          <motion.h2
            className="font-semibold text-light-heading text-xl sm:text-2xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            Fun Facts About Me
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {funFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  className="group rounded-lg bg-light-bg p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-dark-bg"
                  key={fact.title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: ANIMATION_DURATION_SHORT,
                        ease: ANIMATION_EASE_CUBIC,
                      },
                    },
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-light-mini/10 p-3 dark:bg-dark-mini/10">
                      <Icon className="h-6 w-6 text-light-heading dark:text-dark-heading" />
                    </div>
                    <div>
                      <h3 className="font-medium text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
                        {fact.title}
                      </h3>
                      <p className="text-light-text text-sm leading-relaxed dark:text-dark-text">
                        {fact.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="border-light-mini/20 border-t py-16 dark:border-dark-mini/20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          className="space-y-8 text-center"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          <motion.h2
            className="font-semibold text-light-heading text-xl sm:text-2xl dark:text-dark-heading"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            Let&apos;s Build Something Amazing Together
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-light-text leading-relaxed dark:text-dark-text"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            Whether you need help with SEO, full-stack development, or
            infrastructure, I&apos;m always excited to tackle new challenges and
            create solutions that make a real impact.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ANIMATION_DURATION_SHORT,
                  ease: ANIMATION_EASE_CUBIC,
                },
              },
            }}
          >
            <Link
              className="rounded-lg bg-light-heading px-6 py-3 text-light-bg transition-opacity duration-300 hover:opacity-90 dark:bg-dark-heading dark:text-dark-bg"
              href="/contact"
            >
              Get In Touch
            </Link>
            <Link
              className="rounded-lg border border-light-mini/20 px-6 py-3 text-light-heading transition-colors duration-300 hover:bg-light-mini/5 dark:border-dark-mini/20 dark:text-dark-heading dark:hover:bg-dark-mini/5"
              href="/projects"
            >
              View My Work
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default AboutPage;
