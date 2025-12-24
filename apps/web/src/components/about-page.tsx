"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import {
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-primary pt-48 md:pt-64">
    {/* Back Navigation */}
    <div className="mx-auto max-w-screen-xl px-6 md:px-12">
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          className="inline-flex items-center gap-2 text-secondary text-sm transition-colors duration-300 hover:text-primary"
          href="/"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>

    {/* Hero Section */}
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <motion.div
          animate="visible"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.h1
            className="mb-12 font-bold text-6xl text-primary tracking-tighter md:text-8xl lg:text-9xl"
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
            className="max-w-2xl text-secondary text-xl leading-relaxed md:text-2xl"
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
    <section className="py-20">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <div>
            <h2 className="mb-12 border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
              Professional Journey
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="mb-4 font-medium text-primary text-xl">
                  SEO Optimization Expert
                </h3>
                <p className="mb-4 text-base text-secondary leading-relaxed">
                  I&apos;ve helped businesses increase their organic traffic by
                  an average of <span className="text-primary">285%</span>. My
                  approach combines technical SEO mastery with content strategy,
                  focusing on sustainable, white-hat techniques.
                </p>
                <ul className="space-y-2 font-mono text-muted text-sm">
                  <li>— Improved Core Web Vitals for 20+ websites</li>
                  <li>
                    — Increased organic traffic by 400% for an e-commerce client
                  </li>
                  <li>— Built SEO automation tools to speed up audits</li>
                  <li>— Recovered 5+ websites from Google penalties</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-medium text-primary text-xl">
                  Full-Stack Development
                </h3>
                <p className="mb-4 text-base text-secondary leading-relaxed">
                  I build scalable web applications for{" "}
                  <span className="text-primary">millions of users</span>,
                  writing clean, maintainable code and prioritizing performance
                  and UX.
                </p>
                <ul className="space-y-2 font-mono text-muted text-sm">
                  <li>— Built tens of web applications using modern stacks</li>
                  <li>— Developed real-time analytics dashboards</li>
                  <li>— Created microservices to reduce server costs</li>
                  <li>— Implemented CI/CD pipelines</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Expertise */}
          <div>
            <h2 className="mb-12 border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
              Technical Expertise
            </h2>
            <div className="space-y-12">
              <div>
                <h4 className="mb-6 font-medium text-primary">
                  Cloud & DevOps
                </h4>
                <ul className="grid grid-cols-2 gap-y-2 text-secondary text-sm">
                  <li>AWS/GCP architecture</li>
                  <li>Docker & Kubernetes</li>
                  <li>Infrastructure as Code</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 font-medium text-primary">Performance</h4>
                <ul className="grid grid-cols-2 gap-y-2 text-secondary text-sm">
                  <li>Database optimization</li>
                  <li>Redis / CDN Caching</li>
                  <li>Load balancing</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 font-medium text-primary">Technical SEO</h4>
                <ul className="grid grid-cols-2 gap-y-2 text-secondary text-sm">
                  <li>Core Web Vitals</li>
                  <li>Schema markup</li>
                  <li>Technical audits</li>
                  <li>International SEO</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy */}
    <section className="py-20 pb-32">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <h2 className="mb-12 border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
          Philosophy
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <p className="font-medium text-2xl text-primary leading-tight md:text-3xl">
            I believe in methodical, creative problem-solving and continuous
            learning. My curiosity about &ldquo;how things work&rdquo; fuels my
            obsession with building perfect solutions.
          </p>
          <div className="flex flex-col items-start justify-end gap-8 md:items-end">
            <Link
              className="border-primary border-b pb-1 text-lg text-primary transition-colors hover:border-muted hover:text-muted"
              href="/projects"
            >
              View My Work
            </Link>
            <Link
              className="border-primary border-b pb-1 text-lg text-primary transition-colors hover:border-muted hover:text-muted"
              href="/contact"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
