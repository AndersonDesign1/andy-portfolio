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
      {/* Back Navigation */}
      <div className="mx-auto max-w-screen-xl px-6 md:px-12 mb-20">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors duration-300"
            href="/projects"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-screen-xl px-6 md:px-12 mb-32">
        <motion.div
          animate="visible"
          className="space-y-12"
          initial="hidden"
          variants={stagger}
        >
          {/* Project Header */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div className="flex flex-wrap items-center gap-4">
               <span className="text-xs font-mono uppercase tracking-widest text-primary border border-primary px-3 py-1 rounded-full">
                  {caseStudy.hero.client}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-muted border border-subtle px-3 py-1 rounded-full">
                  {caseStudy.hero.duration}
                </span>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl text-primary tracking-tighter leading-[0.9]">
              {caseStudy.hero.title}
            </h1>
            <p className="max-w-3xl text-xl md:text-2xl text-secondary leading-relaxed">
              {caseStudy.hero.overview}
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-sm bg-secondary/5 aspect-video"
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

          {/* Technologies */}
          <motion.div className="border-t border-subtle pt-8" variants={fadeInUp}>
             <p className="text-xs font-mono uppercase tracking-widest text-muted mb-6">
                Technologies
             </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {caseStudy.hero.technologies.map((tech) => (
                <span
                  className="text-primary text-sm font-medium"
                  key={tech}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Challenge & Solution */}
      <section className="border-t border-subtle py-20 md:py-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <motion.div
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-20"
            initial="hidden"
            variants={stagger}
            viewport={{ once: true }}
            whileInView="visible"
          >
            {/* Challenge */}
            <motion.div className="space-y-8" variants={fadeInUp}>
              <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-8 pb-4 border-b border-subtle">
                The Challenge
              </h2>
              <p className="text-primary text-lg leading-relaxed">
                {caseStudy.challenge.problem}
              </p>
              <div className="space-y-4 pt-4">
                 <h3 className="text-primary font-medium">Constraints</h3>
                <ul className="space-y-2">
                  {caseStudy.challenge.constraints.map((constraint) => (
                    <li className="text-secondary text-sm flex items-start gap-3" key={constraint}>
                       <span className="text-muted block mt-1.5 h-1 w-1 rounded-full bg-current" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div className="space-y-8" variants={fadeInUp}>
               <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-8 pb-4 border-b border-subtle">
                Goals & Metrics
              </h2>
              <div className="space-y-4">
                 <h3 className="text-primary font-medium">Primary Objectives</h3>
                <ul className="space-y-2">
                  {caseStudy.goals.primary.map((goal) => (
                    <li className="text-secondary text-sm flex items-start gap-3" key={goal}>
                        <span className="text-muted block mt-1.5 h-1 w-1 rounded-full bg-current" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-subtle py-20 md:py-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
           <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-16 pb-4 border-b border-subtle">
                Approach & Methodology
            </h2>
            <div className="space-y-20">
                 <p className="max-w-2xl text-xl text-primary leading-relaxed">
                    {caseStudy.approach.methodology}
                  </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {caseStudy.approach.phases.map((phase, index) => (
                        <div key={phase.name} className="space-y-4">
                            <span className="text-xs font-mono text-muted">0{index + 1}</span>
                            <h3 className="text-lg font-medium text-primary">{phase.name}</h3>
                            <p className="text-xs text-secondary uppercase tracking-wider">{phase.duration}</p>
                             <ul className="space-y-2 pt-2 border-t border-subtle">
                                {phase.activities.map((activity) => (
                                    <li key={activity} className="text-sm text-secondary">
                                        {activity}
                                    </li>
                                ))}
                             </ul>
                        </div>
                     ))}
                   </div>
            </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-t border-subtle py-20 md:py-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
            <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-16 pb-4 border-b border-subtle">
                Impact
            </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                 {caseStudy.results.beforeAfter.map((metric) => (
                     <div key={metric.metric} className="bg-secondary/5 p-8 rounded-sm">
                         <h3 className="text-secondary text-sm uppercase tracking-wider mb-8">{metric.metric}</h3>
                         <div className="flex items-end justify-between">
                             <div>
                                 <p className="text-xs text-muted mb-1">Before</p>
                                 <p className="text-lg text-secondary font-mono">{metric.before}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-muted mb-1">After</p>
                                 <p className="text-4xl text-primary font-medium">{metric.after}</p>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
             
             {caseStudy.results.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {caseStudy.results.metrics.map((metric) => (
                        <div key={metric} className="border-l border-subtle pl-4">
                            <p className="text-sm text-primary">{metric}</p>
                        </div>
                    ))}
                </div>
             )}
        </div>
      </section>

      {/* Project Gallery */}
      <section className="border-t border-subtle py-20 pb-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
             <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-16 pb-4 border-b border-subtle">
                Gallery
            </h2>
            <div className="space-y-24">
                {caseStudy.gallery.images.map((image, i) => (
                     <div key={i} className="space-y-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-secondary/5">
                             <Image
                                alt={image.alt || `Project image ${i + 1}`}
                                className="object-cover"
                                fill
                                src={image.src}
                            />
                        </div>
                         <p className="text-sm text-secondary font-mono">
                            0{i + 1} — {image.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
