"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ServerIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon
} from "@heroicons/react/24/outline"
import { ThemeToggle } from "@/components/theme-toggle"

const AboutPage: React.FC = () => {
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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  const funFacts = [
    {
      icon: CodeBracketIcon,
      title: "Coffee-Powered Coding",
      description: "I've calculated that I've consumed over 2,847 cups of coffee while debugging code. Each cup represents a problem solved!"
    },
    {
      icon: ChartBarIcon,
      title: "SEO Detective",
      description: "I once spent 3 days tracking down why a client's site wasn't ranking, only to discover a single missing meta tag that boosted their traffic by 340%."
    },
    {
      icon: ServerIcon,
      title: "Infrastructure Enthusiast",
      description: "I have a home lab with 6 Raspberry Pis running different services. My friends call it overkill, I call it 'research'."
    },
    {
      icon: SparklesIcon,
      title: "Midnight Eureka Moments",
      description: "My best solutions come at 2 AM. I keep a notebook by my bed because inspiration doesn't follow business hours."
    }
  ]

  return (
    <div className="pt-24 min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

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
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <motion.h1 
                className="text-4xl font-bold text-light-heading dark:text-dark-heading transition-colors duration-300"
                variants={slideInLeft}
              >
                About Me
              </motion.h1>
              
              <motion.p 
                className="text-lg text-light-text dark:text-dark-text leading-relaxed max-w-3xl"
                variants={slideInLeft}
              >
                I'm a passionate full-stack developer who lives at the intersection of code, SEO, and infrastructure. 
                What started as curiosity about "how websites work" has evolved into a deep obsession with creating 
                digital experiences that not only look beautiful but perform exceptionally well.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Professional Overview */}
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
              Professional Journey
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                  >
                    <ChartBarIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                    SEO Optimization Expert
                  </h3>
                </div>
                
                <p className="text-light-text dark:text-dark-text leading-relaxed">
                  Over the past 5 years, I've helped businesses increase their organic traffic by an average of 
                  <span className="font-semibold text-light-heading dark:text-dark-heading"> 285%</span>. 
                  My approach combines technical SEO mastery with content strategy, focusing on sustainable, 
                  white-hat techniques that deliver long-term results.
                </p>

                <div className="space-y-3">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">Key Achievements:</h4>
                  <ul className="space-y-2 text-sm text-light-text dark:text-dark-text">
                    <li>• Improved Core Web Vitals for 50+ websites, achieving 95+ PageSpeed scores</li>
                    <li>• Increased organic traffic by 400% for an e-commerce client in 8 months</li>
                    <li>• Developed SEO automation tools that reduced audit time by 70%</li>
                    <li>• Successfully recovered 15+ websites from Google penalties</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                  >
                    <CodeBracketIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                    Full-Stack Development
                  </h3>
                </div>
                
                <p className="text-light-text dark:text-dark-text leading-relaxed">
                  I specialize in building scalable web applications that serve 
                  <span className="font-semibold text-light-heading dark:text-dark-heading"> 100,000+ users</span>. 
                  My development philosophy centers on writing clean, maintainable code while prioritizing 
                  performance and user experience at every step.
                </p>

                <div className="space-y-3">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">Notable Projects:</h4>
                  <ul className="space-y-2 text-sm text-light-text dark:text-dark-text">
                    <li>• Built e-commerce platform handling $2M+ in annual transactions</li>
                    <li>• Developed real-time analytics dashboard processing 1M+ data points daily</li>
                    <li>• Created microservices architecture reducing server costs by 40%</li>
                    <li>• Implemented CI/CD pipelines improving deployment speed by 85%</li>
                  </ul>
                </div>
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
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Technical Expertise
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                >
                  <ServerIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                </motion.div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Software Infrastructure Passion
                </h3>
              </div>
              
              <p className="text-light-text dark:text-dark-text leading-relaxed">
                What truly excites me is the invisible foundation that makes everything work. I'm fascinated by 
                how distributed systems communicate, how databases scale, and how infrastructure decisions made 
                today impact performance years down the line. This passion drives me to constantly explore new 
                technologies and architectural patterns.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">Cloud & DevOps</h4>
                  <ul className="space-y-1 text-sm text-light-text dark:text-dark-text">
                    <li>• AWS/GCP architecture design</li>
                    <li>• Docker containerization</li>
                    <li>• Kubernetes orchestration</li>
                    <li>• Infrastructure as Code</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">Performance Optimization</h4>
                  <ul className="space-y-1 text-sm text-light-text dark:text-dark-text">
                    <li>• Database query optimization</li>
                    <li>• Caching strategies (Redis, CDN)</li>
                    <li>• Load balancing & scaling</li>
                    <li>• Monitoring & observability</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">SEO Technical Skills</h4>
                  <ul className="space-y-1 text-sm text-light-text dark:text-dark-text">
                    <li>• Core Web Vitals optimization</li>
                    <li>• Schema markup implementation</li>
                    <li>• Technical auditing & analysis</li>
                    <li>• International SEO (hreflang)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              The Person Behind the Code
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                >
                  <HeartIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                </motion.div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  My Journey & Philosophy
                </h3>
              </div>
              
              <div className="space-y-6 text-light-text dark:text-dark-text leading-relaxed">
                <p>
                  My fascination with technology began in high school when I built my first website using HTML 
                  tables (yes, tables!). What started as a simple curiosity about "how do websites work?" 
                  quickly evolved into an obsession with understanding every layer of the web stack.
                </p>
                
                <p>
                  I discovered SEO during my first internship when I noticed our company's website wasn't 
                  showing up in Google searches. That moment of realization – that building something amazing 
                  isn't enough if people can't find it – shaped my entire career trajectory.
                </p>
                
                <p>
                  My approach to problem-solving is methodical yet creative. I believe in understanding the 
                  "why" before jumping to solutions, and I'm not satisfied until I've explored at least three 
                  different approaches to any challenge. Continuous learning isn't just a buzzword for me – 
                  it's a necessity in our rapidly evolving field.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm"
                >
                  <LightBulbIcon className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                </motion.div>
                <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading">
                  Problem-Solving Approach
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">My Process:</h4>
                  <ol className="space-y-2 text-sm text-light-text dark:text-dark-text">
                    <li>1. <strong>Listen & Understand:</strong> Every problem has context that matters</li>
                    <li>2. <strong>Research & Analyze:</strong> Data-driven decisions beat assumptions</li>
                    <li>3. <strong>Prototype & Test:</strong> Fail fast, learn faster</li>
                    <li>4. <strong>Iterate & Improve:</strong> Perfect is the enemy of good, but good isn't the end goal</li>
                  </ol>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-light-heading dark:text-dark-heading">Learning Philosophy:</h4>
                  <ul className="space-y-2 text-sm text-light-text dark:text-dark-text">
                    <li>• Stay curious about emerging technologies</li>
                    <li>• Learn from failures as much as successes</li>
                    <li>• Share knowledge through mentoring and writing</li>
                    <li>• Question best practices – they evolve for a reason</li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Fun Facts About Me
            </motion.h2>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {funFacts.map((fact, index) => {
                const IconComponent = fact.icon
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group p-6 bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className="p-3 bg-light-mini/10 dark:bg-dark-mini/10 rounded-lg flex-shrink-0"
                      >
                        <IconComponent className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                      </motion.div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {fact.title}
                        </h3>
                        <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                          {fact.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
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
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-semibold text-light-heading dark:text-dark-heading"
            >
              Let's Build Something Amazing Together
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-light-text dark:text-dark-text max-w-2xl mx-auto leading-relaxed"
            >
              Whether you need help with SEO optimization, full-stack development, or infrastructure design, 
              I'm always excited to tackle new challenges and create solutions that make a real impact.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                href="mailto:hello@example.com"
                className="px-6 py-3 bg-light-heading dark:bg-dark-heading text-light-bg dark:text-dark-bg rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Get In Touch
              </Link>
              <Link 
                href="/"
                className="px-6 py-3 border border-light-mini/20 dark:border-dark-mini/20 text-light-heading dark:text-dark-heading rounded-lg hover:bg-light-mini/5 dark:hover:bg-dark-mini/5 transition-colors duration-300"
              >
                View My Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage