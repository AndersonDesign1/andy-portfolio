"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CodeBracketIcon,
  ChartBarIcon,
  ServerIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

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
  <div className="pt-24 min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
    {/* Back Navigation */}
    <div className="max-w-screen-xl mx-auto px-[150px] pt-8">
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
          Back to Home
        </Link>
      </motion.div>
    </div>

    {/* Hero Section */}
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-[150px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-bold text-light-heading dark:text-dark-heading"
          >
            About Me
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-light-text dark:text-dark-text leading-relaxed max-w-3xl"
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
    <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="max-w-screen-xl mx-auto px-[150px]">
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
            Professional Journey
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <ChartBarIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
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
              <ul className="space-y-1 text-sm text-light-text dark:text-dark-text">
                <li>• Improved Core Web Vitals for 20+ websites</li>
                <li>
                  • Increased organic traffic by 400% for an e-commerce client
                </li>
                <li>• Built SEO automation tools to speed up audits</li>
                <li>• Recovered 5+ websites from Google penalties</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <CodeBracketIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
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
              <ul className="space-y-1 text-sm text-light-text dark:text-dark-text">
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
    <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="max-w-screen-xl mx-auto px-[150px]">
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
            Technical Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                Cloud & DevOps
              </h4>
              <ul className="text-sm text-light-text dark:text-dark-text space-y-1">
                <li>• AWS/GCP architecture</li>
                <li>• Docker & Kubernetes</li>
                <li>• Infrastructure as Code</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                Performance Optimization
              </h4>
              <ul className="text-sm text-light-text dark:text-dark-text space-y-1">
                <li>• Database/query optimization</li>
                <li>• Caching (Redis, CDN)</li>
                <li>• Load balancing & scaling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                SEO Technical Skills
              </h4>
              <ul className="text-sm text-light-text dark:text-dark-text space-y-1">
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
    <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="max-w-screen-xl mx-auto px-[150px]">
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
            The Person Behind the Code
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-light-text dark:text-dark-text leading-relaxed max-w-3xl"
          >
            My fascination with technology began after a scholarship gave me the
            chance to learn web development for a year. My curiosity about “how
            things work” turned into a career focused on building, optimizing,
            and scaling digital products. I believe in methodical, creative
            problem-solving and continuous learning.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                My Process
              </h4>
              <ol className="text-sm text-light-text dark:text-dark-text space-y-1">
                <li>1. Listen & Understand</li>
                <li>2. Research & Analyze</li>
                <li>3. Prototype & Test</li>
                <li>4. Iterate & Improve</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                Learning Philosophy
              </h4>
              <ul className="text-sm text-light-text dark:text-dark-text space-y-1">
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
    <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="max-w-screen-xl mx-auto px-[150px]">
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
            Fun Facts About Me
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funFacts.map((fact, i) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-light-mini/10 dark:bg-dark-mini/10 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                    </div>
                    <div>
                      <h3 className="font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {fact.title}
                      </h3>
                      <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
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
    <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="max-w-screen-xl mx-auto px-[150px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center space-y-8"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
          >
            Let&apos;s Build Something Amazing Together
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-light-text dark:text-dark-text max-w-2xl mx-auto leading-relaxed"
          >
            Whether you need help with SEO, full-stack development, or
            infrastructure, I&apos;m always excited to tackle new challenges and
            create solutions that make a real impact.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/contact"
              className="px-6 py-3 bg-light-heading dark:bg-dark-heading text-light-bg dark:text-dark-bg rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
              Get In Touch
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 border border-light-mini/20 dark:border-dark-mini/20 text-light-heading dark:text-dark-heading rounded-lg hover:bg-light-mini/5 dark:hover:bg-dark-mini/5 transition-colors duration-300"
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
