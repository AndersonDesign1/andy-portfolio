"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import projectsData from "@/data/projects.json" with { type: "json" };
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ArrowUpRight } from "lucide-react";

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
};

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine the primary link (Case study > Live > GitHub)
  const primaryLink = project.links.caseStudy || project.links.live || project.links.github || "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative border-b border-subtle last:border-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={primaryLink} className="block group w-full py-12 md:py-16 focus:outline-none">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Index & Title */}
          <div className="flex items-baseline gap-8 md:gap-16 transition-transform duration-300 group-hover:translate-x-4">
            <span className="font-mono text-sm text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-3xl md:text-5xl font-semibold text-primary tracking-tight transition-colors group-hover:text-accent">
              {project.title}
            </h3>
          </div>

          {/* Right: Tech & Year (or Arrow) */}
          <div className="flex items-center gap-8 md:gap-16">
            <p className="hidden md:block text-sm text-secondary font-mono tracking-tight opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
               {project.techStack.slice(0, 3).join(" / ")}
            </p>
            <ArrowUpRight className="shrink-0 w-6 h-6 text-muted transition-transform duration-300 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2} />
          </div>
        </div>

        {/* Floating Image Reveal - Absolute positioned relative to the row (or fixed if desired, but row-relative is safer for spacing) */}
        {/* We position it vaguely center-right to avoid blocking text, or right under the cursor if we tracked it. 
            For minimalism, let's put it fixed z-index near the mouse or just simple absolute right.
        */}
        <div
          className={`pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 z-20 h-[200px] w-[300px] md:h-[300px] md:w-[450px] overflow-hidden rounded-lg transition-all duration-500 ease-out ${
            isHovered ? "opacity-100 scale-100 rotate-2" : "opacity-0 scale-90 rotate-0"
          }`}
          style={{ transformOrigin: "center center" }}
        >
          <Image
            alt={project.title}
            src={project.thumbnail}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 450px"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectsGrid() {
  const { ref: gridRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="bg-primary py-24 md:py-32" ref={gridRef}>
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="mb-24 flex items-end justify-between border-b border-subtle pb-8">
          <h2 className="text-primary text-sm font-mono tracking-widest uppercase">
            Selected Works
          </h2>
          <span className="text-muted text-sm font-mono">
            {projectsData.projects.length} Projects
          </span>
        </div>

        <div className="flex flex-col">
          {projectsData.projects.map((project, index) => (
            <ProjectRow
              index={index}
              key={project.id}
              project={{
                ...project,
                type: project.type as "case-study" | "standard",
              }}
            />
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary border border-subtle px-6 py-3 rounded-sm hover:bg-secondary/50 hover:backdrop-blur-sm hover:border-primary transition-all duration-300"
            href="/projects"
          >
            View Archive
             <span className="text-muted transition-colors duration-300 group-hover:text-primary">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
