"use client";

import { motion } from "motion/react";
import educationData from "@/data/education.json" with { type: "json" };
import workExperienceData from "@/data/work-experience.json" with {
  type: "json",
};
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { formatDate } from "@/lib/utils";

export default function WorkHistory() {
  const { ref: workRef } = useScrollAnimation({ threshold: 0.1 });
  const workExperience = workExperienceData.workExperience;
  const education = educationData.education;

  return (
    <section className="bg-primary py-24 md:py-32" ref={workRef}>
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-32">
          {/* Experience Column */}
          <div>
            <h2 className="mb-12 border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
              Experience
            </h2>
            <div className="flex flex-col gap-12">
              {workExperience
                .filter((job) => {
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
                })
                .map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    key={job.id}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium text-lg text-primary leading-tight">
                        {job.company}
                      </h3>
                      <p className="mb-2 text-secondary text-sm">
                        {job.position}
                      </p>
                      <p className="mb-4 font-mono text-muted text-xs">
                        {formatDate(job.startDate)} —{" "}
                        {job.endDate ? formatDate(job.endDate) : "Present"}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Resume Button */}
            <div className="mt-12">
              <a
                className="group inline-flex items-center gap-2 rounded-sm border border-subtle px-6 py-3 font-medium text-primary text-sm transition-all duration-300 hover:border-primary hover:bg-secondary/50 hover:backdrop-blur-sm"
                href="/Anderson Joseph Resume.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                View Resume
                <span className="text-muted transition-colors duration-300 group-hover:text-primary">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h2 className="mb-12 border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
              Education
            </h2>
            <div className="flex flex-col gap-12">
              {education.map((edu) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  key={edu.id}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-lg text-primary leading-tight">
                      {edu.institution}
                    </h3>
                    <p className="mb-2 text-secondary text-sm">{edu.degree}</p>
                    <p className="font-mono text-muted text-xs">
                      {formatDate(edu.startDate)} —{" "}
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
