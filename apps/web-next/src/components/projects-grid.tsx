"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryLink =
    project.links.caseStudy ||
    project.links.live ||
    project.links.github ||
    "#";

  return (
    <m.div
      className="relative border-subtle border-b last:border-none"
      initial={{ opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.05,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
        className="group block w-full py-12 focus:outline-none md:py-16"
        href={primaryLink}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-baseline gap-8 transition-transform duration-300 ease-out group-hover:translate-x-4 md:gap-16">
            <span className="font-mono text-muted text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold text-3xl text-primary tracking-tight transition-colors duration-200 ease-out group-hover:text-accent md:text-5xl">
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-8 md:gap-16">
            <p className="hidden font-mono text-secondary text-sm tracking-tight md:block">
              {project.techStack.slice(0, 3).join(" / ")}
            </p>
            <HugeiconsIcon
              className="shrink-0 text-muted transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
              color="currentColor"
              icon={ArrowUpRight01Icon}
              size={24}
              strokeWidth={2}
            />
          </div>
        </div>

        <div
          className={`pointer-events-none absolute top-1/2 right-10 z-20 h-[200px] w-[300px] -translate-y-1/2 overflow-hidden rounded-lg opacity-0 transition-all duration-300 ease-out md:h-[300px] md:w-[450px] ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ transformOrigin: "center center" }}
        >
          <Image
            alt={project.title}
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
            className="object-contain"
            fill
            loading="lazy"
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 450px"
            src={project.thumbnail}
          />
        </div>
      </Link>
    </m.div>
  );
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="flex flex-col gap-24">
          <div className="flex items-end justify-between border-subtle border-b pb-8">
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest">
              Selected Works
            </h2>
            <span className="font-mono text-muted text-sm">
              {projects.length} Projects
            </span>
          </div>

          <div className="flex flex-col">
            {projects.map((project, index) => (
              <ProjectRow index={index} key={project.slug} project={project} />
            ))}
          </div>

          <div className="pt-24 text-center">
            <Button asChild className="group gap-2" variant="outline">
              <Link href="/projects">
                View All Projects
                <HugeiconsIcon
                  className="text-muted transition-colors duration-200 ease-out group-hover:text-primary"
                  color="currentColor"
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
