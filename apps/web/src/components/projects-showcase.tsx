"use client";

import { AnimatePresence, m, type Variants } from "motion/react";
import type React from "react";
import { useMemo, useState } from "react";
import MotionRoot from "@/components/motion-root";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import projectsDataJson from "@/data/all-projects.json" with { type: "json" };
import {
  ANIMATION_DELAY_PROJECT,
  ANIMATION_DURATION_PROJECT,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

interface Project {
  description: string;
  id: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  metrics?: Record<string, string>;
  techStack: string[];
  thumbnail: string;
  title: string;
  type: "case-study" | "standard";
}

interface RawProject {
  description: string;
  id: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  metrics?: Record<string, unknown>;
  techStack: string[];
  thumbnail: string;
  title: string;
  type: string;
}

const projects: Project[] = projectsDataJson.projects.map((p: RawProject) => ({
  ...p,
  metrics: p.metrics
    ? (Object.fromEntries(
        Object.entries(p.metrics).filter(
          ([, value]) => typeof value === "string"
        )
      ) as Record<string, string>)
    : undefined,
  type: p.type as "case-study" | "standard",
}));

const categories = ["All", "Full Stack", "SEO", "Web Design"];

const gridVariants: Variants = {
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" }, y: 0 },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" }, y: -30 },
  initial: { opacity: 0, y: 30 },
};

const ProjectsShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

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

  const featuredProjects = filteredProjects.slice(0, 4);
  const otherProjects = filteredProjects.slice(4);

  return (
    <MotionRoot>
      <div className="min-h-screen bg-primary pt-40 md:pt-48">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <h1 className="font-bold text-6xl text-primary tracking-tighter md:text-8xl">
            Selected Work
          </h1>

          {/* Minimal Filters */}
          <div className="flex flex-col gap-20 pt-16">
            <div>
              <Select onValueChange={setActiveCategory} value={activeCategory}>
                <SelectTrigger className="w-full border-subtle bg-transparent text-primary md:w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects Grid */}
          <section className="pb-32">
            <AnimatePresence mode="wait">
              <m.div
                animate="animate"
                className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2"
                exit="exit"
                initial="initial"
                key={activeCategory}
                variants={gridVariants}
              >
                {featuredProjects.map((project, index) => (
                  <m.div
                    className="group"
                    initial={{ opacity: 0, y: 24 }}
                    key={project.id}
                    transition={{
                      delay: index * ANIMATION_DELAY_PROJECT,
                      duration: ANIMATION_DURATION_PROJECT,
                      ease: ANIMATION_EASE_CUBIC,
                    }}
                    viewport={{ amount: 0.1, once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-secondary/5">
                      {project.links.caseStudy ? (
                        <a
                          className="block h-full w-full"
                          href={project.links.caseStudy}
                        >
                          <img
                            alt={project.title}
                            className="object-contain transition-transform duration-700 group-hover:scale-105"
                            src={project.thumbnail}
                          />
                        </a>
                      ) : (
                        <img
                          alt={project.title}
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                          src={project.thumbnail}
                        />
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="flex flex-col gap-6 pt-6">
                      <div className="flex items-baseline justify-between gap-2">
                        {project.links.caseStudy ? (
                          <a
                            className="group/title"
                            href={project.links.caseStudy}
                          >
                            <h3 className="font-medium text-primary text-xl transition-opacity duration-300 group-hover:opacity-70">
                              {project.title}
                            </h3>
                          </a>
                        ) : (
                          <h3 className="font-medium text-primary text-xl transition-opacity duration-300 group-hover:opacity-70">
                            {project.title}
                          </h3>
                        )}

                        <span className="font-mono text-muted text-xs uppercase tracking-widest">
                          {project.type === "case-study"
                            ? "Case Study"
                            : "Project"}
                        </span>
                      </div>

                      <p className="line-clamp-3 text-base text-secondary leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-subtle border-t pt-4">
                        <p className="max-w-[60%] truncate font-mono text-muted text-xs uppercase tracking-wider transition-colors duration-300 group-hover:text-primary">
                          {project.techStack.slice(0, 3).join(" / ")}
                        </p>
                        <div className="flex gap-6">
                          {project.links.caseStudy && (
                            <a
                              className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                              href={project.links.caseStudy}
                            >
                              Read Case Study
                            </a>
                          )}
                          {project.links.live && (
                            <a
                              className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                              href={project.links.live}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Live Site
                            </a>
                          )}
                          {project.links.github && (
                            <a
                              className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                              href={project.links.github}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </m.div>
                ))}
              </m.div>
            </AnimatePresence>

            {/* Other Projects List */}
            {otherProjects.length > 0 && (
              <m.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8 pt-32"
                initial={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="pb-12 font-mono text-muted text-xs uppercase tracking-widest">
                  Freelance & Individual Projects
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {otherProjects.map((project, index) => (
                    <m.div
                      className="group grid grid-cols-1 items-start gap-4 border-subtle border-t py-6 transition-colors hover:bg-secondary/5 md:grid-cols-12 md:items-center"
                      initial={{ opacity: 0, y: 10 }}
                      key={project.id}
                      transition={{ delay: index * 0.05 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {/* Title - 3 columns */}
                      <h3 className="font-medium text-lg text-primary transition-opacity duration-300 group-hover:opacity-70 md:col-span-3">
                        {project.title}
                      </h3>

                      {/* Description - 5 columns */}
                      <p className="text-secondary text-sm md:col-span-5">
                        {project.description}
                      </p>

                      {/* Tech Stack - 2 columns */}
                      <p className="font-mono text-muted text-xs uppercase tracking-wider transition-colors duration-300 group-hover:text-primary md:col-span-2">
                        {project.techStack.slice(0, 3).join(" / ")}
                      </p>

                      {/* Links - 2 columns */}
                      <div className="flex items-center justify-start gap-6 md:col-span-2 md:justify-end">
                        {project.links.live && (
                          <a
                            className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                            href={project.links.live}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Visit
                          </a>
                        )}
                        {project.links.github && (
                          <a
                            className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                            href={project.links.github}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Code
                          </a>
                        )}
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>
            )}

            {filteredProjects.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-lg text-secondary">
                  No projects found in this category.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </MotionRoot>
  );
};

export default ProjectsShowcase;
