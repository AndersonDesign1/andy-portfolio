"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/theme-toggle";
import projectsData from "@/data/all-projects.json";

interface Project {
  id: string;
  title: string;
  description: string;
  category: "Web Design" | "SEO" | "Full Stack";
  technologies: string[];
  image: string;
  liveDemo: string;
  github: string | null;
  completionDate: string;
  keyFeatures: string[];
  type?: "case-study" | "standard";
  caseStudySlug?: string;
  metrics?: {
    [key: string]: string;
  };
}

const categories = ["All", "Web Design", "SEO", "Full Stack"];

const ProjectsShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Type assertion for category and type
  const projects: Project[] = projectsData.projects.map((project: any) => ({
    ...project,
    category: project.category as "Web Design" | "SEO" | "Full Stack",
    type: project.type as "case-study" | "standard" | undefined,
  }));

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      x: 3,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
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

      {/* Header Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.h1
                className="text-3xl font-semibold text-light-heading dark:text-dark-heading transition-colors duration-300"
                whileInView={{ scale: [0.98, 1] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                Projects
              </motion.h1>

              <motion.p
                className="text-base text-light-text dark:text-dark-text leading-relaxed max-w-2xl"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A collection of my work spanning web development, SEO
                optimization, and design. Each project represents a unique
                challenge solved with creativity and technical expertise.
              </motion.p>
            </motion.div>

            {/* Category Filter Tabs */}
            <motion.div variants={itemVariants} className="flex gap-6">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`text-sm transition-colors duration-300 ${
                    activeCategory === category
                      ? "text-light-heading dark:text-dark-heading"
                      : "text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading"
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="max-w-screen-xl mx-auto px-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              {filteredProjects.map((project, index) => {
                const isCaseStudy = project.type === "case-study";

                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className="group space-y-6"
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      <motion.div
                        variants={imageVariants}
                        whileHover="hover"
                        className="relative w-full h-full"
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </motion.div>

                      {/* Subtle overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"
                        initial={false}
                      />
                    </div>

                    {/* Project Content */}
                    <div className="space-y-4">
                      {/* Title and Links */}
                      <div className="flex items-start justify-between gap-4">
                        <motion.h3
                          className="text-lg font-medium text-light-heading dark:text-dark-heading transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {project.title}
                        </motion.h3>
                        <div className="flex gap-4 flex-shrink-0">
                          {project.github && (
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                              variants={linkVariants}
                              whileHover="hover"
                            >
                              GitHub ↗
                            </motion.a>
                          )}
                          <motion.a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                            variants={linkVariants}
                            whileHover="hover"
                          >
                            View ↗
                          </motion.a>
                          {isCaseStudy && project.caseStudySlug && (
                            <motion.div
                              variants={linkVariants}
                              whileHover="hover"
                            >
                              <Link
                                href={`/case-studies/${project.caseStudySlug}`}
                                className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                              >
                                Case Study ↗
                              </Link>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <motion.p
                        className="text-sm text-light-text dark:text-dark-text leading-relaxed"
                        initial={{ opacity: 0.8 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {project.description}
                      </motion.p>

                      {/* Metrics for Case Studies */}
                      {isCaseStudy && project.metrics && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                            Key Results
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(project.metrics).map(
                              ([key, value], metricIndex) => (
                                <motion.div
                                  key={key}
                                  className="text-sm text-light-text dark:text-dark-text"
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: metricIndex * 0.1,
                                  }}
                                >
                                  <span className="capitalize">{key}:</span>
                                  <span className="ml-2 font-medium">
                                    {value}
                                  </span>
                                </motion.div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Tech Stack */}
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          Tech Stack
                        </h4>
                        <p className="text-xs text-light-mini dark:text-dark-mini">
                          {project.technologies.join(" / ")}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-light-text dark:text-dark-text">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t border-light-mini/20 dark:border-dark-mini/20">
        <div className="max-w-screen-xl mx-auto px-[150px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-light-heading dark:text-dark-heading">
              Interested in Working Together?
            </h2>
            <p className="text-light-text dark:text-dark-text max-w-2xl mx-auto">
              I'm always excited to take on new challenges and create innovative
              solutions. Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="mailto:hello@example.com"
                className="px-6 py-3 bg-light-heading dark:bg-dark-heading text-light-bg dark:text-dark-bg rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Get In Touch
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-light-mini/20 dark:border-dark-mini/20 text-light-heading dark:text-dark-heading rounded-lg hover:bg-light-mini/5 dark:hover:bg-dark-mini/5 transition-colors duration-300"
              >
                Learn More About Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsShowcase;
