"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import projectsData from "@/data/projects.json";

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

const ProjectCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const isCaseStudy = project.type === "case-study";

  return (
    <motion.div
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
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index < 2}
        />
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
          aria-hidden
        />
      </motion.div>

      {/* Project Content */}
      <div className="space-y-4">
        {/* Project Header */}
        <div className="flex items-start justify-between gap-4">
          <motion.h3
            className="text-lg font-medium text-light-heading dark:text-dark-heading transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {project.title}
          </motion.h3>
          <div className="flex gap-4 flex-shrink-0">
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
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.18 }}>
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

        {/* Project Description */}
        <p className="text-sm text-light-text dark:text-dark-text transition-colors duration-300 leading-relaxed">
          {project.description}
        </p>

        {/* Metrics for Case Studies */}
        {project.metrics && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading transition-colors duration-300">
              Key Results
            </h4>
            <div className="space-y-1">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="text-sm text-light-text dark:text-dark-text transition-colors duration-300"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="ml-2 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading transition-colors duration-300">
            Tech Stack
          </h4>
          <p className="text-xs text-light-mini dark:text-dark-mini transition-colors duration-300">
            {project.techStack.join(" / ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsGrid: React.FC = () => {
  // Clean metrics and cast type for type safety
  const projects: Project[] = projectsData.projects.map((p) => ({
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

  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-[150px]">
        {/* Section Header */}
        <div className="text-left mb-16">
          <h2 className="text-xl font-semibold mb-4 text-light-heading dark:text-dark-heading transition-colors duration-300">
            Featured Projects
          </h2>
          <p className="text-base text-light-text dark:text-dark-text transition-colors duration-300 max-w-2xl leading-relaxed">
            A collection of my recent work, from detailed case studies to quick
            projects. Each one represents a unique challenge and creative
            solution.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View More Section */}
        <div className="text-center mt-16">
          <Link
            href="/projects"
            className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300"
          >
            View All Projects ↗
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
