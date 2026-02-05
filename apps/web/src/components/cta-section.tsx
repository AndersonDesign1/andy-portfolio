"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  fadeInUp,
  staggerContainer,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";

export default function CtaSection() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="bg-primary py-24 md:py-32" ref={ref}>
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <motion.div
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-8 md:items-start"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {/* Headline */}
          <motion.h2
            className="max-w-xl font-bold text-4xl text-primary leading-[1.1] tracking-tighter md:text-5xl lg:text-6xl"
            variants={fadeInUp}
          >
            Ready to create something extraordinary?
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="max-w-md text-lg text-secondary leading-relaxed md:text-xl"
            variants={fadeInUp}
          >
            I'm currently available for new projects and collaborations. Let's
            build something that leaves a lasting impression.
          </motion.p>

          <motion.div className="pt-4" variants={fadeInUp}>
            <Link
              className="group inline-flex items-center gap-2 rounded-sm border border-subtle px-8 py-4 font-medium text-base text-primary transition-all duration-300 hover:border-primary hover:bg-secondary/50 hover:backdrop-blur-sm"
              href="/contact"
            >
              Get in Touch
              <ArrowUpRight className="size-4 text-muted transition-colors duration-300 group-hover:text-primary" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
