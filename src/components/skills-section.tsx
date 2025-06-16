"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  PresentationChartLineIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

interface Skill {
  name: string;
  icon: string;
  category: string;
}

const skillsData: {
  [category: string]: {
    icon: React.ComponentType<{ className?: string }>;
    skills: Skill[];
  };
} = {
  "Full Stack Development": {
    icon: CodeBracketIcon,
    skills: [
      {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        category: "Frontend",
      },
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        category: "Frontend",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        category: "Frontend",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        category: "Frontend",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        category: "Frontend",
      },
      {
        name: "Astro",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg",
        category: "Frontend",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        category: "Frontend",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        category: "Backend",
      },
      {
        name: "Postman",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
        category: "Backend",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        category: "Database",
      },
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        category: "Database",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        category: "Database",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        category: "Tools",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
        category: "Tools",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
        category: "Tools",
      },
      {
        name: "Google Cloud",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
        category: "Tools",
      },
      {
        name: "Cloudflare",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
        category: "Tools",
      },
    ],
  },
  SEO: {
    icon: PresentationChartLineIcon,
    skills: [
      {
        name: "Google Analytics",
        icon: "https://www.vectorlogo.zone/logos/google_analytics/google_analytics-icon.svg",
        category: "Tools",
      },
      {
        name: "Google Search Console",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
        category: "Tools",
      },
      {
        name: "Ahrefs",
        icon: "https://cdn.brandfetch.io/idxB1p5kuP/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Tools",
      },
      {
        name: "SEMrush",
        icon: "https://cdn.brandfetch.io/idt3n8W3ef/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Tools",
      },
      {
        name: "Keyword Research",
        icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
        category: "Skills",
      },
      {
        name: "On-page SEO",
        icon: "https://cdn-icons-png.flaticon.com/512/3039/3039393.png",
        category: "Skills",
      },
      {
        name: "Technical SEO",
        icon: "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
        category: "Skills",
      },
      {
        name: "Link Building",
        icon: "https://cdn-icons-png.flaticon.com/512/3039/3039386.png",
        category: "Skills",
      },
    ],
  },
  "Web Design": {
    icon: PaintBrushIcon,
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.brandfetch.io/idZHcZ_i7F/w/320/h/320/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
      {
        name: "Webflow",
        icon: "https://cdn.brandfetch.io/id4knLKYsV/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
      {
        name: "Framer",
        icon: "https://cdn.brandfetch.io/idCeIE9B96/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
      {
        name: "WordPress",
        icon: "https://cdn.brandfetch.io/idbnlnCBDY/w/200/h/200/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
      {
        name: "Wix",
        icon: "https://cdn.brandfetch.io/id93wC1WMj/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
      {
        name: "Bubble",
        icon: "https://cdn.brandfetch.io/id6z4_raly/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
        category: "Design Tools",
      },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.25, 0.25, 0, 1] },
  },
};

const skillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.12, ease: "easeOut" },
  },
  hover: {
    scale: 1.12,
    y: -2,
    transition: { duration: 0.1, ease: "easeOut" },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

const SkillsSection: React.FC = () => {
  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-[150px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={titleVariants} className="text-left mb-16">
            <motion.h2
              className="text-xl font-semibold mb-4 text-light-heading dark:text-dark-heading transition-colors duration-300"
              whileInView={{ scale: [0.98, 1] }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              Technical Skills
            </motion.h2>
            <motion.p
              className="text-base text-light-text dark:text-dark-text transition-colors duration-300 max-w-2xl leading-relaxed"
              initial={{ opacity: 0.8 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.12, delay: 0.05 }}
            >
              A comprehensive overview of my technical expertise across
              development, SEO, and design.
            </motion.p>
          </motion.div>

          {/* Skills Categories */}
          <div className="space-y-16">
            {Object.entries(skillsData).map(
              ([categoryName, categoryData], categoryIndex) => {
                const IconComponent = categoryData.icon;

                return (
                  <motion.div
                    key={categoryName}
                    variants={categoryVariants}
                    className="space-y-8"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-8">
                      <motion.div
                        className="p-0 rounded-lg"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.1 }}
                      >
                        <IconComponent className="w-6 h-6 text-light-heading dark:text-dark-heading" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-light-heading dark:text-dark-heading transition-colors duration-300">
                        {categoryName}
                      </h3>
                    </div>

                    {/* Skills Grid */}
                    <motion.div
                      className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4"
                      variants={containerVariants}
                    >
                      {categoryData.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          variants={skillVariants}
                          whileHover="hover"
                          className="group flex flex-col items-center gap-2 p-0 bg-transparent rounded-none transition-all duration-200"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.12,
                            delay: skillIndex * 0.02,
                          }}
                        >
                          {/* Skill Icon */}
                          <motion.div
                            className="relative w-8 h-8 flex items-center justify-center"
                            whileHover={{ rotate: [0, -3, 3, 0] }}
                            transition={{ duration: 0.18 }}
                          >
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-6 h-6 object-contain filter group-hover:brightness-110 transition-all duration-200"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-6 h-6 bg-light-mini/20 dark:bg-dark-mini/20 rounded-md flex items-center justify-center text-light-mini dark:text-dark-mini text-xs font-medium">${skill.name.charAt(
                                    0
                                  )}</div>`;
                                }
                              }}
                            />
                          </motion.div>

                          {/* Skill Name (no link) */}
                          <span className="text-xs font-medium text-light-text dark:text-dark-text text-center leading-tight group-hover:text-light-heading dark:group-hover:text-dark-heading transition-colors duration-200">
                            {skill.name}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Category Divider */}
                    {categoryIndex < Object.entries(skillsData).length - 1 && (
                      <motion.div
                        className="w-full h-px bg-light-mini/20 dark:bg-dark-mini/20 mt-8"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      />
                    )}
                  </motion.div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
