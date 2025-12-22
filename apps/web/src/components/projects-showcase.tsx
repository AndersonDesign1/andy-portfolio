"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import projectsDataJson from "@/data/all-projects.json" with { type: "json" };
import {
  ANIMATION_DELAY_PROJECT,
  ANIMATION_DURATION_PROJECT,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

// --- Types ---
type Project = {
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
};

type RawProject = {
  id: string;
  type: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  metrics?: Record<string, unknown>;
};

// Clean metrics and cast type for type safety
const projects: Project[] = projectsDataJson.projects.map((p: RawProject) => ({
  ...p,
  type: p.type as "case-study" | "standard",
  metrics: p.metrics
    ? (Object.fromEntries(
        Object.entries(p.metrics).filter(
          ([, value]) => typeof value === "string"
        )
      ) as Record<string, string>)
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
    if (activeCategory === "All") {
      return projects;
    }
    if (activeCategory === "Full Stack") {
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
    }
    if (activeCategory === "SEO") {
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
    }
    if (activeCategory === "Web Design") {
      return projects.filter((project) =>
        project.techStack.some((tech) =>
          ["WordPress", "Wix", "Webflow"].includes(tech)
        )
      );
    }
    return [];
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-light-bg pt-28 transition-colors duration-300 dark:bg-dark-bg">
      {/* Header */}
      <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:px-8 md:px-16 lg:px-[150px]">
        <h1 className="mb-4 font-semibold text-3xl text-light-heading dark:text-dark-heading">
          Projects
        </h1>
        {/* Responsive, single-line, scrollable category selector */}
        <div className="mb-8 flex gap-1 overflow-x-auto whitespace-nowrap sm:gap-3">
          {categories.map((category) => (
            <Button
              className={`px-2 py-1 text-xs shadow-none transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                activeCategory === category
                  ? "font-bold text-light-heading dark:text-dark-heading"
                  : "text-light-mini dark:text-dark-mini"
              }hover:text-blue-600 dark:hover:text-blue-400`}
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                minWidth: "70px",
              }}
              variant="ghost"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid with AnimatePresence */}
      <section className="pb-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              animate="animate"
              className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
              exit="exit"
              initial="initial"
              key={activeCategory}
              variants={gridVariants}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  className="group space-y-6"
                  initial={{ opacity: 0, y: 24 }}
                  key={project.id}
                  transition={{
                    duration: ANIMATION_DURATION_PROJECT,
                    ease: ANIMATION_EASE_CUBIC,
                    delay: index * ANIMATION_DELAY_PROJECT,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Project Image */}
                  <motion.div
                    className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg"
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <Image
                      alt={project.title}
                      className="object-contain"
                      fill
                      priority={index < 2 && activeCategory === "All"}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={project.thumbnail}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
                    />
                  </motion.div>
                  {/* Project Content */}
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                      <motion.h3
                        className="font-medium text-lg text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400"
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        whileHover={{ x: 2 }}
                      >
                        {project.title}
                      </motion.h3>
                      <div className="flex flex-shrink-0 flex-wrap gap-4">
                        {project.links.github && (
                          <motion.a
                            className="text-light-mini text-sm transition-colors duration-300 hover:underline dark:text-dark-mini"
                            href={project.links.github}
                            rel="noopener noreferrer"
                            target="_blank"
                            transition={{ duration: 0.18 }}
                            whileHover={{ x: 2 }}
                          >
                            GitHub ↗
                          </motion.a>
                        )}
                        {project.links.live && (
                          <motion.a
                            className="text-light-mini text-sm transition-colors duration-300 hover:underline dark:text-dark-mini"
                            href={project.links.live}
                            rel="noopener noreferrer"
                            target="_blank"
                            transition={{ duration: 0.18 }}
                            whileHover={{ x: 2 }}
                          >
                            View ↗
                          </motion.a>
                        )}
                        {project.links.caseStudy && (
                          <motion.div
                            transition={{ duration: 0.18 }}
                            whileHover={{ x: 2 }}
                          >
                            <Link
                              className="text-light-mini text-sm transition-colors duration-300 hover:underline dark:text-dark-mini"
                              href={project.links.caseStudy}
                            >
                              Case Study ↗
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <p className="text-light-text text-sm leading-relaxed dark:text-dark-text">
                      {project.description}
                    </p>
                    {/* Metrics for Case Studies */}
                    {project.type === "case-study" && project.metrics && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-light-heading text-sm transition-colors duration-300 dark:text-dark-heading">
                          Key Results
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(project.metrics).map(
                            ([key, value]) => (
                              <div
                                className="text-light-text text-sm transition-colors duration-300 dark:text-dark-text"
                                key={key}
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
                      <h4 className="font-medium text-light-heading text-sm transition-colors duration-300 dark:text-dark-heading">
                        Tech Stack
                      </h4>
                      <p className="break-words text-light-mini text-xs transition-colors duration-300 dark:text-dark-mini">
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
            <div className="py-16 text-center">
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
