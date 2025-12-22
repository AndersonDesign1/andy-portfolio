"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import projectsData from "@/data/projects.json" with { type: "json" };
import {
  projectCardVariants,
  projectHeaderVariants,
  projectsContainer,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";

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
  metrics?: Record<string, string | undefined>;
};

const _containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const _cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const linkVariants = {
  hover: {
    x: 8,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      className="group space-y-6 rounded-xl bg-light-bg/50 p-6 transition-shadow duration-300 hover:shadow-lg dark:bg-dark-bg/50"
      variants={projectCardVariants}
      whileHover={{
        y: -4,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
    >
      {/* Project Image */}
      <motion.div
        className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg"
        variants={imageVariants}
        whileHover="hover"
      >
        <Image
          alt={project.title}
          className="object-contain"
          fill
          priority={index < 2}
          sizes="(max-width: 768px) 100vw, 50vw"
          src={project.thumbnail}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
          whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        />
      </motion.div>

      {/* Project Content */}
      <div className="space-y-4">
        {/* Project Header */}
        <motion.div
          className="flex flex-wrap items-start justify-between gap-4"
          variants={projectHeaderVariants}
        >
          <motion.h3
            className="font-medium text-lg text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400"
            whileHover={{
              x: 2,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            {project.title}
          </motion.h3>
          <div className="flex flex-shrink-0 flex-wrap gap-4">
            {project.links.github && (
              <motion.a
                className="text-light-mini text-sm transition-colors duration-300 hover:text-blue-600 hover:underline dark:text-dark-mini dark:hover:text-blue-400"
                href={project.links.github}
                rel="noopener noreferrer"
                target="_blank"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                GitHub ↗
              </motion.a>
            )}
            {project.links.live && (
              <motion.a
                className="text-light-mini text-sm transition-colors duration-300 hover:text-blue-600 hover:underline dark:text-dark-mini dark:hover:text-blue-400"
                href={project.links.live}
                rel="noopener noreferrer"
                target="_blank"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View ↗
              </motion.a>
            )}
            {project.links.caseStudy && (
              <motion.div
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  className="text-light-mini text-sm transition-colors duration-300 hover:text-blue-600 hover:underline dark:text-dark-mini dark:hover:text-blue-400"
                  href={project.links.caseStudy}
                >
                  Case Study ↗
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Project Description */}
        <motion.p
          className="text-light-text text-sm leading-relaxed dark:text-dark-text"
          variants={projectHeaderVariants}
          whileHover={{
            x: 2,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
        >
          {project.description}
        </motion.p>

        {/* Metrics for Case Studies */}
        {project.metrics && (
          <motion.div className="space-y-2" variants={projectHeaderVariants}>
            <h4 className="font-medium text-light-heading text-sm transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
              Key Results
            </h4>
            <div className="space-y-1">
              {Object.entries(project.metrics).map(([key, value]) => (
                <motion.div
                  className="text-light-text text-sm transition-colors duration-300 hover:text-blue-600 dark:text-dark-text dark:hover:text-blue-400"
                  key={key}
                  whileHover={{
                    x: 2,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <span className="capitalize">{key}:</span>
                  <span className="ml-2 font-medium">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        <motion.div className="space-y-2" variants={projectHeaderVariants}>
          <h4 className="font-medium text-lg text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
            Tech Stack
          </h4>
          <p className="break-words text-light-mini text-xs transition-colors duration-300 dark:text-dark-mini">
            {project.techStack.join(" / ")}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsGrid() {
  const { ref: gridRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="bg-light-bg py-20 transition-colors duration-300 dark:bg-dark-bg"
      ref={gridRef}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate="visible"
          className="mb-16 text-left"
          initial="hidden"
          variants={projectHeaderVariants}
        >
          <h2 className="mb-4 font-semibold text-light-heading text-xl dark:text-dark-heading">
            Featured Projects
          </h2>
          <p className="max-w-2xl text-base text-light-text leading-relaxed dark:text-dark-text">
            A selection of projects that showcase my expertise in full-stack
            development, SEO optimization, and user experience design.
          </p>
        </motion.div>

        <motion.div
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
          initial="hidden"
          variants={projectsContainer}
        >
          {projectsData.projects.map((project, index) => (
            <ProjectCard
              index={index}
              key={project.id}
              project={{
                ...project,
                type: project.type as "case-study" | "standard",
              }}
            />
          ))}
        </motion.div>

        {/* View More Section */}
        <div className="mt-16 text-center">
          <Link
            className="text-light-mini text-sm transition-colors duration-300 hover:underline dark:text-dark-mini"
            href="/projects"
          >
            View All Projects ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
