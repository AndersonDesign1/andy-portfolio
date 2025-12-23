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

      <section className="mx-auto max-w-screen-xl px-4 md:px-8 mb-24 md:mb-32">
        <motion.div
           animate="visible"
           initial="hidden"
           variants={stagger}
           className="space-y-12 md:space-y-24"
        >
          <motion.div className="space-y-8 md:space-y-12" variants={fadeInUp}>
             <div className="grid grid-cols-1 md:grid-cols-4 border-y border-subtle">
                <div className="py-4 md:py-6 border-b md:border-b-0 md:border-r border-subtle">
                    <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-2">Client</span>
                    <span className="text-secondary text-sm md:text-base">{caseStudy.hero.client}</span>
                </div>
                <div className="py-4 md:py-6 border-b md:border-b-0 md:border-r border-subtle md:pl-8">
                    <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-2">Timeline</span>
                    <span className="text-secondary text-sm md:text-base">{caseStudy.hero.duration}</span>
                </div>
                <div className="py-4 md:py-6 md:pl-8 md:col-span-2">
                     <span className="block text-xs font-mono uppercase tracking-widest text-muted mb-2">Role & Tech</span>
                     <div className="flex flex-wrap gap-x-4 text-secondary text-sm md:text-base">
                         {caseStudy.hero.technologies.slice(0, 4).map(t => <span key={t}>{t}</span>)}
                     </div>
                </div>
             </div>

            <h1 className="font-bold text-6xl md:text-8xl lg:text-9xl text-primary tracking-tighter leading-[0.85] uppercase break-words">
              {caseStudy.hero.title}
            </h1>
            
            <p className="max-w-2xl text-xl md:text-2xl text-secondary leading-relaxed font-light ml-auto">
              {caseStudy.hero.overview}
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-video border border-subtle bg-secondary/5"
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

      <section className="border-t border-subtle">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[50vh]">
            <div className="md:col-span-4 py-12 md:py-24 md:border-r border-subtle">
               <h2 className="sticky top-32 text-xs font-mono tracking-widest uppercase text-muted">
                  01 — The Challenge
               </h2>
            </div>
            
            <div className="md:col-span-8 py-12 md:py-24 md:pl-12 space-y-16">
               <div className="space-y-8">
                  <h3 className="text-3xl md:text-4xl text-primary font-medium leading-tight">
                    {caseStudy.challenge.problem}
                  </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                       <div>
                           <h4 className="text-sm font-mono uppercase text-muted mb-4">Constraints</h4>
                            <ul className="space-y-2">
                            {caseStudy.challenge.constraints.map((constraint) => (
                                <li className="text-secondary text-sm border-l border-subtle pl-4 py-1" key={constraint}>
                                {constraint}
                                </li>
                            ))}
                            </ul>
                       </div>
                       <div>
                           <h4 className="text-sm font-mono uppercase text-muted mb-4">Goals</h4>
                            <ul className="space-y-2">
                            {caseStudy.goals.primary.map((goal) => (
                                <li className="text-secondary text-sm border-l border-subtle pl-4 py-1" key={goal}>
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

      <section className="border-t border-subtle">
         <div className="mx-auto max-w-screen-xl px-4 md:px-8">
             <div className="grid grid-cols-1 md:grid-cols-12">
                 <div className="md:col-span-4 py-12 md:py-24 md:border-r border-subtle">
                     <h2 className="sticky top-32 text-xs font-mono tracking-widest uppercase text-muted">
                        02 — Approach
                    </h2>
                 </div>
                 <div className="md:col-span-8 py-12 md:py-24 md:pl-12">
                     <p className="text-xl text-secondary leading-relaxed mb-16">
                         {caseStudy.approach.methodology}
                     </p>
                     
                     <div className="space-y-0">
                         {caseStudy.approach.phases.map((phase, index) => (
                            <div key={phase.name} className="group border-t border-subtle first:border-t-0 py-8 transition-colors hover:bg-secondary/5">
                                <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                                    <span className="font-mono text-sm text-muted">0{index + 1}</span>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-baseline">
                                             <h3 className="text-xl font-medium text-primary">{phase.name}</h3>
                                             <span className="text-xs font-mono text-muted">{phase.duration}</span>
                                        </div>
                                        <ul className="space-y-1">
                                            {phase.activities.map(act => (
                                                <li key={act} className="text-sm text-secondary">— {act}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                         ))}
                     </div>
                 </div>
             </div>
         </div>
      </section>

      <section className="border-t border-subtle border-b">
         <div className="mx-auto max-w-screen-xl px-4 md:px-8">
             <div className="grid grid-cols-1 md:grid-cols-12">
                 <div className="md:col-span-4 py-12 md:py-24 md:border-r border-subtle">
                    <h2 className="sticky top-32 text-xs font-mono tracking-widest uppercase text-muted">
                        03 — Impact
                    </h2>
                 </div>
                 <div className="md:col-span-8 py-12 md:py-24 md:pl-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                          {caseStudy.results.beforeAfter.map((metric) => (
                              <div key={metric.metric} className="space-y-4">
                                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted">{metric.metric}</h3>
                                  <div className="flex items-baseline gap-4">
                                      <span className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
                                          {metric.after}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-secondary">
                                      <span className="line-through decoration-subtle text-muted">{metric.before}</span>
                                      <span>→</span>
                                      <span>Result</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                       {caseStudy.results.metrics.length > 0 && (
                          <div className="mt-20 pt-12 border-t border-subtle grid grid-cols-2 gap-8">
                              {caseStudy.results.metrics.map((m) => (
                                  <p key={m} className="text-lg text-primary font-light border-l-2 border-primary pl-6 py-2">
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
             <h2 className="text-xs font-mono tracking-widest uppercase text-muted mb-12">
                Gallery
            </h2>
            <div className="space-y-32">
                {caseStudy.gallery.images.map((image, i) => (
                     <div key={i} className="space-y-4 group">
                        <div className="relative aspect-video w-full overflow-hidden border border-subtle bg-secondary/5">
                             <Image
                                alt={image.alt || `Project image ${i + 1}`}
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                fill
                                src={image.src}
                            />
                        </div>
                         <div className="flex justify-between items-baseline border-b border-subtle pb-4">
                             <p className="text-sm text-primary font-medium uppercase tracking-wide">
                                {image.title}
                            </p>
                            <span className="text-xs font-mono text-muted">0{i + 1}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
