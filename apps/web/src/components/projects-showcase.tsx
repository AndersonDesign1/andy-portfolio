"use client";

import { AnimatePresence, m } from "motion/react";
import type { Variants } from "motion/react";
import { useState } from "react";

import MotionRoot from "@/components/motion-root";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANIMATION_DELAY_PROJECT,
  ANIMATION_DURATION_PROJECT,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";
import type { Project } from "@/types/project";

const categories = ["All", "Full Stack", "SEO", "Web Design"];

// The featured grid is two columns from `md` up, so only the first row is
// reliably above the fold and worth loading eagerly.
const FEATURED_ABOVE_FOLD = 2;
const UI_EASE_OUT = [0.23, 1, 0.32, 1] as const;

const gridVariants: Variants = {
  animate: {
    opacity: 1,
    transition: { duration: 0.24, ease: UI_EASE_OUT },
    y: 0,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: UI_EASE_OUT },
    y: -12,
  },
  initial: { opacity: 0, y: 12 },
};

const ProjectsShowcase = ({ projects }: { projects: Project[] }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = (() => {
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
  })();

  const featuredProjects = filteredProjects.slice(0, 4);
  const otherProjects = filteredProjects.slice(4);

  return (
    <MotionRoot>
      <div className="bg-primary min-h-screen pt-40 md:pt-48">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <h1 className="text-primary text-6xl font-bold tracking-tighter md:text-8xl">
            Selected Work
          </h1>

          {/* Minimal Filters */}
          <div className="flex flex-col gap-20 pt-16">
            <div>
              <Select onValueChange={setActiveCategory} value={activeCategory}>
                <SelectTrigger className="border-subtle text-primary w-full bg-transparent md:w-[200px]">
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
                    key={project.slug}
                    transition={{
                      delay: index * ANIMATION_DELAY_PROJECT,
                      duration: ANIMATION_DURATION_PROJECT,
                      ease: ANIMATION_EASE_CUBIC,
                    }}
                    viewport={{ amount: 0.1, once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    {/* Project Image */}
                    <div className="bg-secondary/5 relative aspect-[16/10] overflow-hidden rounded-sm">
                      {project.links.caseStudy ? (
                        <a
                          className="block h-full w-full"
                          href={project.links.caseStudy}
                        >
                          <img
                            alt={project.title}
                            className="object-contain transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transform-none"
                            decoding="async"
                            height={1000}
                            loading={
                              index < FEATURED_ABOVE_FOLD ? "eager" : "lazy"
                            }
                            src={project.thumbnail}
                            width={1600}
                          />
                        </a>
                      ) : (
                        <img
                          alt={project.title}
                          className="object-contain transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transform-none"
                          decoding="async"
                          height={1000}
                          loading={
                            index < FEATURED_ABOVE_FOLD ? "eager" : "lazy"
                          }
                          src={project.thumbnail}
                          width={1600}
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
                            <h3 className="text-primary text-xl font-medium transition-opacity duration-300 group-hover:opacity-70">
                              {project.title}
                            </h3>
                          </a>
                        ) : (
                          <h3 className="text-primary text-xl font-medium transition-opacity duration-300 group-hover:opacity-70">
                            {project.title}
                          </h3>
                        )}

                        <span className="text-muted font-mono text-xs tracking-widest uppercase">
                          {project.type === "case-study"
                            ? "Case Study"
                            : "Project"}
                        </span>
                      </div>

                      <p className="text-secondary line-clamp-3 text-base leading-relaxed">
                        {project.description}
                      </p>

                      <div className="border-subtle mt-auto flex items-center justify-between border-t pt-4">
                        <p className="text-muted group-hover:text-primary max-w-[60%] truncate font-mono text-xs tracking-wider uppercase transition-colors duration-300">
                          {project.techStack.slice(0, 3).join(" / ")}
                        </p>
                        <div className="flex gap-6">
                          {project.links.caseStudy && (
                            <a
                              className="text-primary text-sm font-medium transition-opacity hover:opacity-70"
                              href={project.links.caseStudy}
                            >
                              Read Case Study
                            </a>
                          )}
                          {project.links.live && (
                            <a
                              className="text-primary text-sm font-medium transition-opacity hover:opacity-70"
                              href={project.links.live}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Live Site
                            </a>
                          )}
                          {project.links.github && (
                            <a
                              className="text-primary text-sm font-medium transition-opacity hover:opacity-70"
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
                initial={{ opacity: 0, y: 12 }}
                transition={{
                  delay: 0.2,
                  duration: 0.28,
                  ease: UI_EASE_OUT,
                }}
              >
                <h2 className="text-muted pb-12 font-mono text-xs tracking-widest uppercase">
                  Freelance & Individual Projects
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {otherProjects.map((project, index) => (
                    <m.div
                      className="group border-subtle hover:bg-secondary/5 grid grid-cols-1 items-start gap-4 border-t py-6 transition-colors md:grid-cols-12 md:items-center"
                      initial={{ opacity: 0, y: 10 }}
                      key={project.slug}
                      transition={{ delay: index * 0.05 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {/* Title - 3 columns */}
                      <h3 className="text-primary text-lg font-medium transition-opacity duration-300 group-hover:opacity-70 md:col-span-3">
                        {project.title}
                      </h3>

                      {/* Description - 5 columns */}
                      <p className="text-secondary text-sm md:col-span-5">
                        {project.description}
                      </p>

                      {/* Tech Stack - 2 columns */}
                      <p className="text-muted group-hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors duration-300 md:col-span-2">
                        {project.techStack.slice(0, 3).join(" / ")}
                      </p>

                      {/* Links - 2 columns */}
                      <div className="flex items-center justify-start gap-6 md:col-span-2 md:justify-end">
                        {project.links.live && (
                          <a
                            className="text-primary text-sm font-medium transition-opacity hover:opacity-70"
                            href={project.links.live}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Visit
                          </a>
                        )}
                        {project.links.github && (
                          <a
                            className="text-primary text-sm font-medium transition-opacity hover:opacity-70"
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
                <p className="text-secondary text-lg">
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
