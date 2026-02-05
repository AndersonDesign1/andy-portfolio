"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
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

interface RawProject {
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
}

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
            <motion.div
              animate="animate"
              className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2"
              exit="exit"
              initial="initial"
              key={activeCategory}
              variants={gridVariants}
            >
              {featuredProjects.map((project, index) => (
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
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-secondary/5">
                    {project.links.caseStudy ? (
                      <Link
                        className="block h-full w-full"
                        href={project.links.caseStudy}
                      >
                        <Image
                          alt={project.title}
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                          fill
                          priority={index < 2 && activeCategory === "All"}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={project.thumbnail}
                        />
                      </Link>
                    ) : (
                      <Image
                        alt={project.title}
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                        fill
                        priority={index < 2 && activeCategory === "All"}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        src={project.thumbnail}
                      />
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="flex flex-col gap-6 pt-6">
                    <div className="flex items-baseline justify-between gap-2">
                      {project.links.caseStudy ? (
                        <Link
                          className="group/title"
                          href={project.links.caseStudy}
                        >
                          <h3 className="font-medium text-primary text-xl transition-opacity duration-300 group-hover:opacity-70">
                            {project.title}
                          </h3>
                        </Link>
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

                    <p className="line-clamp-2 text-base text-secondary leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-subtle border-t pt-4">
                      <p className="max-w-[60%] truncate font-mono text-muted text-xs uppercase tracking-wider transition-colors duration-300 group-hover:text-primary">
                        {project.techStack.slice(0, 3).join(" / ")}
                      </p>
                      <div className="flex gap-6">
                        {project.links.caseStudy && (
                          <Link
                            className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                            href={project.links.caseStudy}
                          >
                            Read Case Study
                          </Link>
                        )}
                        {project.links.live && (
                          <Link
                            className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                            href={project.links.live}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Live Site
                          </Link>
                        )}
                        {project.links.github && (
                          <Link
                            className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                            href={project.links.github}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Code
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Other Projects List */}
          {otherProjects.length > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8 pt-32"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="pb-12 font-mono text-muted text-xs uppercase tracking-widest">
                Freelance & Individual Projects
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {otherProjects.map((project, index) => (
                  <motion.div
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
                        <Link
                          className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                          href={project.links.live}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Visit
                        </Link>
                      )}
                      {project.links.github && (
                        <Link
                          className="font-medium text-primary text-sm transition-opacity hover:opacity-70"
                          href={project.links.github}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Code
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
  );
};

export default ProjectsShowcase;
