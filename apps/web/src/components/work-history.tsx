"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import educationData from "@/data/education.json" with { type: "json" };
import workExperienceData from "@/data/work-experience.json" with { type: "json" };
import { formatDate } from "@/lib/utils";

const WorkHistory = () => {
  const { workExperience } = workExperienceData;
  const { education } = educationData;

  const filteredExperience = workExperience.filter((job) => {
    const title = job.position.toLowerCase();
    const company = job.company.toLowerCase();
    return (
      title.includes("full stack") ||
      title.includes("developer") ||
      title.includes("engineer") ||
      title.includes("founding") ||
      title.includes("backend") ||
      title.includes("seo") ||
      title.includes("instructor") ||
      title.includes("teacher") ||
      title.includes("mentor") ||
      company.includes("training")
    );
  });

  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-32">
          {/* Experience Column */}
          <div>
            <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
              Experience
            </h2>
            <div className="flex flex-col gap-12 pt-12">
              {filteredExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-primary text-lg leading-tight font-medium">
                      {job.company}
                    </h3>
                    <p className="text-secondary pb-2 text-sm">
                      {job.position}
                    </p>
                    <p className="text-muted pb-4 font-mono text-xs">
                      {formatDate(job.startDate)} —{" "}
                      {job.endDate ? formatDate(job.endDate) : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resume Button */}
            <div className="pt-12">
              <a
                className="group border-subtle text-primary hover:border-primary hover:bg-secondary/50 inline-flex items-center gap-2 rounded-sm border px-6 py-3 text-sm font-medium transition-[background-color,border-color,transform,backdrop-filter] duration-200 ease-[var(--ease-out)] hover:backdrop-blur-sm active:scale-[0.96] motion-reduce:active:scale-100"
                href="/Anderson Joseph Resume.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                View Resume
                <HugeiconsIcon
                  className="text-muted group-hover:text-primary transition-colors duration-200 ease-out"
                  color="currentColor"
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
              Education
            </h2>
            <div className="flex flex-col gap-12 pt-12">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-primary text-lg leading-tight font-medium">
                      {edu.institution}
                    </h3>
                    <p className="text-secondary pb-2 text-sm">{edu.degree}</p>
                    <p className="text-muted font-mono text-xs">
                      {formatDate(edu.startDate)} —{" "}
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkHistory;
