"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon, CheckIcon, TrophyIcon, StarIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"

interface CaseStudy {
  id: string
  hero: {
    title: string
    client: string
    duration: string
    overview: string
    heroImage: string
    technologies: string[]
  }
  challenge: {
    problem: string
    constraints: string[]
    context: string
    metrics: string[]
  }
  goals: {
    primary: string[]
    stakeholder: string[]
    success: string[]
  }
  approach: {
    methodology: string
    phases: Array<{
      name: string
      duration: string
      activities: string[]
    }>
    keyDecisions: Array<{
      decision: string
      rationale: string
    }>
    research: string[]
    wireframes: string[]
    collaboration: string
    iterations: string[]
    userFeedback: string
  }
  results: {
    beforeAfter: Array<{
      metric: string
      before: string
      after: string
      improvement: string
    }>
    metrics: string[]
    testimonials: Array<{
      name: string
      role: string
      quote: string
    }>
    deliverables: string[]
    achievements: string[]
  }
}

interface CaseStudyPageProps {
  caseStudy: CaseStudy
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ caseStudy }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const metricCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  const improvementBadgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, delay: 0.3, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  const getImprovementIcon = (improvement: string) => {
    const isPositive = improvement.includes('+') || improvement.includes('faster') || improvement.includes('better')
    const isNegative = improvement.includes('-') || improvement.includes('reduced') || improvement.includes('lower')
    
    if (isPositive) {
      return <ArrowUpIcon className="w-3 h-3" />
    } else if (isNegative) {
      return <ArrowDownIcon className="w-3 h-3" />
    }
    return null
  }

  const getImprovementColor = (improvement: string) => {
    const isPositive = improvement.includes('+') || improvement.includes('faster') || improvement.includes('better')
    const isNegative = improvement.includes('-') || improvement.includes('reduced') || improvement.includes('lower')
    
    if (isPositive) {
      return "text-light-heading dark:text-dark-heading"
    } else if (isNegative) {
      return "text-light-heading dark:text-dark-heading"
    }
    return "text-light-text dark:text-dark-text"
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
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
            Back to Projects
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Hero Content */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl font-bold text-light-heading dark:text-dark-heading transition-colors duration-300"
                  variants={slideInLeft}
                >
                  {caseStudy.hero.title}
                </motion.h1>
                
                <motion.div 
                  className="space-y-2 text-sm text-light-mini dark:text-dark-mini"
                  variants={slideInLeft}
                >
                  <p><span className="font-medium">Client:</span> {caseStudy.hero.client}</p>
                  <p><span className="font-medium">Duration:</span> {caseStudy.hero.duration}</p>
                </motion.div>
              </div>

              <motion.p 
                className="text-base text-light-text dark:text-dark-text leading-relaxed"
                variants={slideInLeft}
              >
                {caseStudy.hero.overview}
              </motion.p>

              <motion.div variants={slideInLeft} className="space-y-3">
                <h3 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.hero.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              variants={fadeInUp}
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
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
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Challenge & Context
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                    {caseStudy.challenge.constraints.map((constraint, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-light-text dark:text-dark-text"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                        {constraint}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-3">
                    Initial Metrics
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.challenge.metrics.map((metric, index) => (
                      <motion.li
                        key={index}
                        className="text-light-text dark:text-dark-text"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        • {metric}
                      </motion.li>
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
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Project Goals
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Primary Objectives
                </h3>
                <ul className="space-y-3">
                  {caseStudy.goals.primary.map((goal, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                      {goal}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Stakeholder Requirements
                </h3>
                <ul className="space-y-3">
                  {caseStudy.goals.stakeholder.map((requirement, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                      {requirement}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Success Criteria
                </h3>
                <ul className="space-y-3">
                  {caseStudy.goals.success.map((criteria, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                      {criteria}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach & Process */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
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

              {/* Project Phases */}
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-6">
                  Project Phases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudy.approach.phases.map((phase, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
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
                        {phase.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="text-sm text-light-text dark:text-dark-text">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Decisions */}
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-6">
                  Key Decisions & Rationale
                </h3>
                <div className="space-y-4">
                  {caseStudy.approach.keyDecisions.map((decision, index) => (
                    <motion.div
                      key={index}
                      className="border-l-4 border-light-mini dark:border-dark-mini pl-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <h4 className="font-medium text-light-heading dark:text-dark-heading mb-2">
                        {decision.decision}
                      </h4>
                      <p className="text-sm text-light-text dark:text-dark-text">
                        {decision.rationale}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Wireframes */}
              <div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading mb-6">
                  Design Process
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {caseStudy.approach.wireframes.map((wireframe, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Image
                        src={wireframe}
                        alt={`Wireframe ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-light-text dark:text-dark-text">
                  {caseStudy.approach.userFeedback}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results & Impact */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Results & Impact
            </motion.h2>

            {/* Enhanced Before/After Metrics */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                Before vs After
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudy.results.beforeAfter.map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={metricCardVariants}
                    whileHover="hover"
                    className="group relative overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {/* Card Background with Subtle Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-light-bg via-light-bg to-light-bg/50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg/50 rounded-xl" />
                    
                    {/* Border with Hover Effect */}
                    <div className="relative bg-light-bg dark:bg-dark-bg rounded-xl p-8 backdrop-blur-sm group-hover:shadow-md transition-all duration-300">
                      
                      {/* Metric Title */}
                      <motion.h4 
                        className="text-xl font-semibold text-light-heading dark:text-dark-heading mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                      >
                        {metric.metric}
                      </motion.h4>

                      {/* Before/After Values */}
                      <div className="space-y-4 mb-6">
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        >
                          <span className="text-sm font-medium text-light-mini dark:text-dark-mini">Before:</span>
                          <span className="text-lg font-mono text-light-text dark:text-dark-text">{metric.before}</span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                        >
                          <span className="text-sm font-medium text-light-mini dark:text-dark-mini">After:</span>
                          <span className="text-lg font-mono text-light-heading dark:text-dark-heading font-semibold">{metric.after}</span>
                        </motion.div>
                      </div>

                      {/* Improvement Badge */}
                      <motion.div 
                        variants={improvementBadgeVariants}
                        whileHover="hover"
                        className="flex items-center justify-center"
                      >
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light-mini/10 dark:bg-dark-mini/10 backdrop-blur-sm ${getImprovementColor(metric.improvement)}`}>
                          {getImprovementIcon(metric.improvement)}
                          <span className="text-sm font-semibold tracking-wide">
                            {metric.improvement}
                          </span>
                        </div>
                      </motion.div>

                      {/* Subtle Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-light-heading/5 to-transparent dark:from-dark-heading/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Metrics */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                Additional Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.results.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TrophyIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    <span className="text-sm text-light-text dark:text-dark-text">{metric}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                Client Testimonials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudy.results.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-light-mini dark:fill-dark-mini text-light-mini dark:text-dark-mini" />
                      ))}
                    </div>
                    <p className="text-light-text dark:text-dark-text mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-medium text-light-heading dark:text-dark-heading">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-light-mini dark:text-dark-mini">
                        {testimonial.role}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Back to Projects */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-[150px] text-center">
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
  )
}

export default CaseStudyPage