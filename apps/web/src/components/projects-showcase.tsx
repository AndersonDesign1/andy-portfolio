"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
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
    <div className="min-h-screen bg-primary pt-48 md:pt-64">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <h1 className="font-bold text-6xl md:text-8xl text-primary tracking-tighter mb-16">
          Selected Work
        </h1>

        {/* Minimal Filters */}
        <div className="mb-20 flex gap-8 border-b border-subtle pb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? "text-primary"
                  : "text-muted hover:text-primary"
              }`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <section className="pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24"
              exit="exit"
              initial="initial"
              key={activeCategory}
              variants={gridVariants}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  className="group"
                  initial={{ opacity: 0, y: 24 }}
                  key={project.id}
                  transition={{
                    duration: ANIMATION_DURATION_PROJECT,
                    ease: ANIMATION_EASE_CUBIC,
                    delay: index * ANIMATION_DELAY_PROJECT,
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Project Image */}
                  <motion.div
                    className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 bg-secondary/5"
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <Image
                      alt={project.title}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fill
                      priority={index < 2 && activeCategory === "All"}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={project.thumbnail}
                    />
                  </motion.div>

                  {/* Project Content */}
                  <div className="flex flex-col">
                    <div className="flex items-baseline justify-between mb-2">
                       <h3 className="text-xl font-medium text-primary">
                          {project.title}
                        </h3>
                        <span className="text-xs font-mono text-muted uppercase tracking-widest">
                           {project.type === 'case-study' ? 'Case Study' : 'Project'}
                        </span>
                    </div>

                     <p className="text-secondary text-base leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-subtle pt-4 mt-auto">
                        <p className="text-xs text-muted font-mono uppercase tracking-wider truncate max-w-[60%]">
                            {project.techStack.slice(0, 3).join(" / ")}
                        </p>
                        <div className="flex gap-6">
                            {project.links.caseStudy ? (
                                <Link
                                    href={project.links.caseStudy}
                                    className="text-sm font-medium text-primary hover:text-muted transition-colors"
                                >
                                    Read Case Study
                                </Link>
                            ) : (
                                <>
                                    {project.links.live && (
                                         <Link
                                            href={project.links.live}
                                            target="_blank"
                                            className="text-sm font-medium text-primary hover:text-muted transition-colors"
                                        >
                                            Live Site
                                        </Link>
                                    )}
                                     {project.links.github && (
                                         <Link
                                            href={project.links.github}
                                            target="_blank"
                                            className="text-sm font-medium text-primary hover:text-muted transition-colors"
                                        >
                                            Code
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredProjects.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-secondary text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
