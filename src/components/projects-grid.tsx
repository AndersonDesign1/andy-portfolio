"use client";

import React from "react";
import { motion } from "motion/react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
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
      variants={cardVariants}
      whileHover={{
        y: -12,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      className="group space-y-6 bg-light-bg/50 dark:bg-dark-bg/50 rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Project Image */}
      <motion.div
        variants={imageVariants}
        whileHover="hover"
        className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-lg"
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index < 2}
        />
        <motion.div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
          whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          aria-hidden
        />
      </motion.div>

      {/* Project Content */}
      <div className="space-y-4">
        {/* Project Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <motion.h3
            whileHover={{
              x: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="text-lg font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
          >
            {project.title}
          </motion.h3>
          <div className="flex gap-4 flex-shrink-0 flex-wrap">
            {project.links.github && (
              <motion.a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                GitHub ↗
              </motion.a>
            )}
            {project.links.live && (
              <motion.a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
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
                  href={project.links.caseStudy}
                  className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Case Study ↗
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Project Description */}
        <motion.p
          whileHover={{
            x: 5,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
          className="text-sm text-light-text dark:text-dark-text leading-relaxed"
        >
          {project.description}
        </motion.p>

        {/* Metrics for Case Studies */}
        {project.metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Key Results
            </h4>
            <div className="space-y-1">
              {Object.entries(project.metrics).map(([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{
                    x: 5,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="text-sm text-light-text dark:text-dark-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="ml-2 font-medium">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="space-y-2"
        >
          <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            Tech Stack
          </h4>
          <p className="text-xs text-light-mini dark:text-dark-mini transition-colors duration-300 break-words">
            {project.techStack.join(" / ")}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsGrid() {
  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
          className="text-left mb-16"
        >
          <h2 className="text-xl font-semibold mb-4 text-light-heading dark:text-dark-heading">
            Featured Projects
          </h2>
          <p className="text-base text-light-text dark:text-dark-text max-w-2xl leading-relaxed">
            A selection of projects that showcase my expertise in full-stack
            development, SEO optimization, and user experience design.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16"
        >
          {projectsData.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
