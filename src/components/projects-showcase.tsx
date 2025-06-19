"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import projectsDataJson from "@/data/all-projects.json";

// --- Types ---
interface Project {
  id: string;
  type: "case-study" | "standard";
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  metrics?: Record<string, string>;
}

// Clean metrics and cast type for type safety
const projects: Project[] = projectsDataJson.projects.map((p: any) => ({
  ...p,
  type: p.type as "case-study" | "standard",
  metrics: p.metrics
    ? Object.fromEntries(
        Object.entries(p.metrics).filter(
          ([, value]) => typeof value === "string"
        )
      )
    : undefined,
}));

const categories = ["All", "Full Stack", "SEO", "Web Design"];

const gridVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } },
};

const ProjectsShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Filter by category, but keep original order
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    if (activeCategory === "Full Stack")
      return projects.filter((project) =>
        project.techStack.some((tech) =>
          [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Redis",
            "Content Management Systems",
          ].includes(tech)
        )
      );
    if (activeCategory === "SEO")
      return projects.filter((project) =>
        project.techStack.some((tech) =>
          [
            "Ahrefs",
            "Google Search Console",
            "Google Analytics",
            "Screaming Frog",
            "PageSpeed Insights",
            "Mailchimp",
            "Yoast SEO",
          ].includes(tech)
        )
      );
    if (activeCategory === "Web Design")
      return projects.filter((project) =>
        project.techStack.some((tech) =>
          ["WordPress", "Wix", "Webflow"].includes(tech)
        )
      );
    return [];
  }, [activeCategory]);

  return (
    <div className="pt-28 min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] pt-8">
        <h1 className="text-3xl font-semibold text-light-heading dark:text-dark-heading mb-4">
          Projects
        </h1>
        {/* Responsive, single-line, scrollable category selector */}
        <div className="flex gap-1 sm:gap-3 mb-8 overflow-x-auto whitespace-nowrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              onClick={() => setActiveCategory(category)}
              className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 shadow-none transition-colors duration-200
                ${
                  activeCategory === category
                    ? "font-bold text-light-heading dark:text-dark-heading"
                    : "text-light-mini dark:text-dark-mini"
                }
                hover:text-blue-600 dark:hover:text-blue-400
              `}
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                minWidth: "70px",
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid with AnimatePresence */}
      <section className="pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16"
              variants={gridVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group space-y-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.32,
                    ease: [0.25, 0.25, 0, 1],
                    delay: index * 0.06,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Project Image */}
                  <motion.div
                    className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.025 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2 && activeCategory === "All"}
                    />
                    <div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
                      aria-hidden
                    />
                  </motion.div>
                  {/* Project Content */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <motion.h3
                        className="text-lg font-medium text-light-heading dark:text-dark-heading transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        {project.title}
                      </motion.h3>
                      <div className="flex gap-4 flex-shrink-0 flex-wrap">
                        {project.links.github && (
                          <motion.a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            GitHub ↗
                          </motion.a>
                        )}
                        {project.links.live && (
                          <motion.a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            View ↗
                          </motion.a>
                        )}
                        {project.links.caseStudy && (
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            <Link
                              href={project.links.caseStudy}
                              className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
                            >
                              Case Study ↗
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                      {project.description}
                    </p>
                    {/* Metrics for Case Studies */}
                    {project.type === "case-study" && project.metrics && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading transition-colors duration-300">
                          Key Results
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(project.metrics).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="text-sm text-light-text dark:text-dark-text transition-colors duration-300"
                              >
                                <span className="capitalize">{key}:</span>
                                <span className="ml-2 font-medium">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading transition-colors duration-300">
                        Tech Stack
                      </h4>
                      <p className="text-xs text-light-mini dark:text-dark-mini transition-colors duration-300 break-words">
                        {project.techStack.join(" / ")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-light-text dark:text-dark-text">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsShowcase;
