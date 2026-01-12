"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json" with { type: "json" };
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

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
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryLink =
    project.links.caseStudy ||
    project.links.live ||
    project.links.github ||
    "#";

  return (
    <motion.div
      className="relative border-subtle border-b last:border-none"
      initial={{ opacity: 0, y: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
        className="group block w-full py-12 focus:outline-none md:py-16"
        href={primaryLink}
      >
        <div className="flex items-center justify-between gap-8">
          {/* Left: Index & Title */}
          <div className="flex items-baseline gap-8 transition-transform duration-300 group-hover:translate-x-4 md:gap-16">
            <span className="font-mono text-muted text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold text-3xl text-primary tracking-tight transition-colors group-hover:text-accent md:text-5xl">
              {project.title}
            </h3>
          </div>

          {/* Right: Tech & Year (or Arrow) */}
          <div className="flex items-center gap-8 md:gap-16">
            <p className="hidden font-mono text-secondary text-sm tracking-tight md:block">
              {project.techStack.slice(0, 3).join(" / ")}
            </p>
            <ArrowUpRight
              className="size-6 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
              strokeWidth={2}
            />
          </div>
        </div>

        <div
          className={`pointer-events-none absolute top-1/2 right-10 z-20 h-[200px] w-[300px] -translate-y-1/2 overflow-hidden rounded-lg transition-all duration-500 ease-out md:h-[300px] md:w-[450px] ${
            isHovered
              ? "rotate-2 scale-100 opacity-100"
              : "rotate-0 scale-90 opacity-0"
          }`}
          style={{ transformOrigin: "center center" }}
        >
          <Image
            alt={project.title}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            src={project.thumbnail}
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
        <div className="flex flex-col gap-24">
          <div className="flex items-end justify-between border-subtle border-b pb-8">
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest">
              Selected Works
            </h2>
            <span className="font-mono text-muted text-sm">
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

          <div className="pt-24 text-center">
            <Button asChild className="group gap-2" variant="outline">
              <Link href="/projects">
                View All Projects
                <span className="text-muted transition-colors duration-300 group-hover:text-primary">
                  ↗
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
