"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { m } from "motion/react";
import { useState } from "react";

import MotionRoot from "@/components/motion-root";
import { Button } from "@/components/ui/button";
import projectsDataJson from "@/data/all-projects.json" with { type: "json" };

interface Project {
  description: string;
  featured?: boolean;
  id: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  techStack: string[];
  thumbnail: string;
  title: string;
  type: "case-study" | "standard";
}

const ProjectRow = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryLink =
    project.links.caseStudy ||
    project.links.live ||
    project.links.github ||
    "#";

  return (
    <m.div
      className="border-subtle relative border-b last:border-none"
      initial={{ opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.05,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <a
        className="group block w-full py-12 focus:outline-none md:py-16"
        href={primaryLink}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between gap-8">
          {/* Left: Index & Title */}
          <div className="flex items-baseline gap-8 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-4 motion-reduce:transform-none md:gap-16">
            <span className="text-muted font-mono text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-primary group-hover:text-accent text-3xl font-semibold tracking-tight md:text-5xl">
              {project.title}
            </h3>
          </div>

          {/* Right: Tech & Year (or Arrow) */}
          <div className="flex items-center gap-8 md:gap-16">
            <p className="text-secondary hidden font-mono text-sm tracking-tight md:block">
              {project.techStack.slice(0, 3).join(" / ")}
            </p>
            <HugeiconsIcon
              className="text-muted group-hover:text-accent shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none"
              color="currentColor"
              icon={ArrowUpRight01Icon}
              size={24}
              strokeWidth={2}
            />
          </div>
        </div>

        <div
          className={`pointer-events-none absolute top-1/2 right-10 z-20 h-[200px] w-[300px] -translate-y-1/2 overflow-hidden rounded-lg opacity-0 transition-opacity duration-200 ease-out md:h-[300px] md:w-[450px] ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ transformOrigin: "center center" }}
        >
          <img
            alt={project.title}
            className="object-contain"
            loading="lazy"
            src={project.thumbnail}
          />
        </div>
      </a>
    </m.div>
  );
};

const normalizeProject = (
  project: (typeof projectsDataJson.projects)[number]
): Project => ({
  ...project,
  type: project.type === "case-study" ? "case-study" : "standard",
});

const featuredProjects = projectsDataJson.projects.flatMap((project) =>
  project.featured ? [normalizeProject(project)] : []
);

const ProjectsGrid = () => (
  <MotionRoot>
    <section className="bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="flex flex-col gap-24">
          <div className="border-subtle flex items-end justify-between border-b pb-8">
            <h2 className="text-primary font-mono text-sm tracking-widest uppercase">
              Selected Works
            </h2>
            <span className="text-muted font-mono text-sm">
              {featuredProjects.length} Projects
            </span>
          </div>

          <div className="flex flex-col">
            {featuredProjects.map((project, index) => (
              <ProjectRow index={index} key={project.id} project={project} />
            ))}
          </div>

          <div className="pt-24 text-center">
            <Button asChild className="group gap-2" variant="outline">
              <a href="/projects">
                View All Projects
                <HugeiconsIcon
                  className="text-muted group-hover:text-primary"
                  color="currentColor"
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </MotionRoot>
);

export default ProjectsGrid;
