"use client";

import { motion } from "motion/react";
import {
  skillCategoryVariants,
  skillsContainer,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";

interface SkillCategory {
  title: string;
  skills: string[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Development",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Astro",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend & Database",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma", "REST API", "GraphQL"],
  },
  {
    title: "Tools & DevOps",
    skills: [
      "Git",
      "Docker",
      "AWS",
      "Vercel",
      "Cloudflare",
      "Postman",
      "Figma",
    ],
  },
  {
    title: "SEO & Performance",
    skills: [
      "Technical SEO",
      "Google Analytics",
      "Search Console",
      "Core Web Vitals",
      "Ahrefs",
    ],
  },
];

export default function SkillsSection() {
  const { ref: skillsRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="bg-primary py-24 md:py-32" ref={skillsRef}>
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <motion.div
          animate="visible"
          className="mb-20 flex items-end justify-between border-subtle border-b pb-8"
          initial="hidden"
          variants={skillCategoryVariants}
        >
          <h2 className="font-mono text-secondary text-sm uppercase tracking-widest">
            Expertise
          </h2>
        </motion.div>

        <motion.div
          animate="visible"
          className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-y-24"
          initial="hidden"
          variants={skillsContainer}
        >
          {skillsData.map((category) => (
            <motion.div
              className="group"
              key={category.title}
              variants={skillCategoryVariants}
            >
              <h3 className="mb-6 font-medium text-primary text-xl">
                {category.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {category.skills.map((skill) => (
                  <li
                    className="text-base text-secondary transition-colors duration-200 hover:text-primary"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
