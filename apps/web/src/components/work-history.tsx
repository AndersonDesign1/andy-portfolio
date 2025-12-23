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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32">
          {/* Experience Column */}
          <div>
            <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-12 border-b border-subtle pb-4">
              Experience
            </h2>
            <div className="flex flex-col gap-12">
              {workExperience
                .filter((job) => {
                  const title = job.position.toLowerCase();
                  const company = job.company.toLowerCase();
                  // Keep Full Stack, SEO, and Training roles
                  return (
                    title.includes("full stack") ||
                    title.includes("developer") ||
                    title.includes("seo") ||
                    title.includes("instructor") ||
                    title.includes("teacher") ||
                    title.includes("mentor") ||
                     // Keep specific known relevant roles if any not covered above
                    company.includes("training")
                  );
                })
                .map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-primary font-medium text-lg leading-tight">
                        {job.company}
                      </h3>
                      <p className="text-secondary text-sm mb-2">
                        {job.position}
                      </p>
                      <p className="text-muted text-xs font-mono mb-4">
                        {formatDate(job.startDate)} —{" "}
                        {job.endDate ? formatDate(job.endDate) : "Present"}
                      </p>
                      <p className="text-secondary/80 text-sm leading-relaxed max-w-sm">
                        {job.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Resume Button */}
            <div className="mt-12">
              <a
                href="/Anderson Joseph Resume.pdf"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary border border-subtle px-6 py-3 rounded-sm hover:bg-secondary/50 hover:backdrop-blur-sm hover:border-primary transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                 View Resume
                 <span className="text-muted transition-colors duration-300 group-hover:text-primary">↗</span>
              </a>
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h2 className="text-secondary text-sm font-mono tracking-widest uppercase mb-12 border-b border-subtle pb-4">
              Education
            </h2>
             <div className="flex flex-col gap-12">
              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                   <div className="flex flex-col gap-1">
                     <h3 className="text-primary font-medium text-lg leading-tight">
                        {edu.institution}
                     </h3>
                     <p className="text-secondary text-sm mb-2">
                        {edu.degree}
                     </p>
                     <p className="text-muted text-xs font-mono">
                        {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
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
