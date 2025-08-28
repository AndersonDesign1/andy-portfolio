"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
              className={`whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? "bg-light-heading dark:bg-dark-heading text-light-bg dark:text-dark-bg"
                  : "text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group space-y-4"
              >
                {/* Project Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Project Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full">
                        +{project.techStack.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-3 pt-2">
                    {project.links.caseStudy && (
                      <Link
                        href={project.links.caseStudy}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                      >
                        Case Study →
                      </Link>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-200"
                      >
                        View Live →
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-200"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
