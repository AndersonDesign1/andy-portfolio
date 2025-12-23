"use client";

import { motion } from "motion/react";
import {
  skillCategoryVariants,
  skillsContainer,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";

type SkillCategory = {
  title: string;
  skills: string[];
};

const skillsData: SkillCategory[] = [
  {
    title: "Development",
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Astro", "Tailwind CSS"],
  },
  {
    title: "Backend & Database",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma", "REST API", "GraphQL"],
  },
  {
    title: "Tools & DevOps",
    skills: ["Git", "Docker", "AWS", "Vercel", "Cloudflare", "Postman", "Figma"],
  },
  {
    title: "SEO & Performance",
    skills: ["Technical SEO", "Google Analytics", "Search Console", "Core Web Vitals", "Ahrefs"],
  }
];

export default function SkillsSection() {
  const { ref: skillsRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="bg-primary py-24 md:py-32" ref={skillsRef}>
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <motion.div
          animate="visible"
          className="mb-20 border-b border-subtle pb-8 flex items-end justify-between"
          initial="hidden"
          variants={skillCategoryVariants}
        >
          <h2 className="text-secondary text-sm font-mono tracking-widest uppercase">
            Expertise
          </h2>
        </motion.div>

        <motion.div
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-y-24"
          initial="hidden"
          variants={skillsContainer}
        >
          {skillsData.map((category) => (
            <motion.div
              key={category.title}
              variants={skillCategoryVariants}
              className="group"
            >
              <h3 className="text-primary text-xl font-medium mb-6">
                {category.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {category.skills.map((skill) => (
                  <li 
                    key={skill} 
                    className="text-secondary text-base hover:text-primary transition-colors duration-200"
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
