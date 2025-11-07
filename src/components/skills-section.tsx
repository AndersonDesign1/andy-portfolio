"use client";

import {
  CodeBracketIcon,
  PaintBrushIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import type React from "react";
import {
  skillCategoryVariants,
  skillItemVariants,
  skillsContainer,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";
import {
  SKILL_HOVER_SCALE,
  SKILL_ICON_HOVER_SCALE,
  SKILL_ICON_HOVER_Y,
  SKILL_ROTATION_ANGLES,
  SKILL_ICON_SIZE,
  SKILL_ICON_DISPLAY_SIZE,
} from "@/lib/constants";

type Skill = {
  name: string;
  icon: string;
  category: string;
};

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

export default function SkillsSection() {
  const { ref: skillsRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="bg-light-bg py-20 transition-colors duration-300 dark:bg-dark-bg"
      ref={skillsRef}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate="visible"
          className="mb-16 text-left"
          initial="hidden"
          variants={skillCategoryVariants}
        >
          <h2 className="mb-4 font-semibold text-light-heading text-xl transition-colors duration-300 dark:text-dark-heading">
            Technical Skills
          </h2>
          <p className="max-w-2xl text-base text-light-text leading-relaxed transition-colors duration-300 dark:text-dark-text">
            A comprehensive overview of my technical expertise across
            development, SEO, and design.
          </p>
        </motion.div>

        {/* Skills Categories */}
        <motion.div
          animate="visible"
          className="space-y-16"
          initial="hidden"
          variants={skillsContainer}
        >
          {Object.entries(skillsData).map(
            ([categoryName, categoryData], _categoryIndex) => {
              const IconComponent = categoryData.icon;

              return (
                <motion.div
                  className="space-y-8"
                  key={categoryName}
                  variants={skillCategoryVariants}
                >
                  {/* Category Header */}
                  <motion.div
                    className="mb-8 flex items-center gap-3"
                    variants={skillCategoryVariants}
                  >
                    <motion.div
                      className="rounded-lg bg-light-mini/5 p-3 transition-colors duration-300 group-hover:bg-light-mini/10 dark:bg-dark-mini/5 dark:group-hover:bg-dark-mini/10"
                      variants={skillCategoryVariants}
                      whileHover={{
                        scale: SKILL_HOVER_SCALE,
                        rotate: SKILL_ROTATION_ANGLES,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        },
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-light-heading dark:text-dark-heading" />
                    </motion.div>
                    <h3 className="font-semibold text-lg text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
                      {categoryName}
                    </h3>
                  </motion.div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                    {categoryData.skills.map((skill, _skillIndex) => (
                      <motion.div
                        className="group flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-transparent p-2"
                        key={skill.name}
                        variants={skillItemVariants}
                        whileHover={{
                          scale: SKILL_ICON_HOVER_SCALE,
                          y: SKILL_ICON_HOVER_Y,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                      >
                        {/* Skill Icon */}
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <img
                            alt={`${skill.name} icon`}
                            className="h-6 w-6 object-contain"
                            height={SKILL_ICON_SIZE}
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class='w-${SKILL_ICON_DISPLAY_SIZE} h-${SKILL_ICON_DISPLAY_SIZE} bg-light-mini/20 dark:bg-dark-mini/20 rounded-md flex items-center justify-center text-light-mini dark:text-dark-mini text-xs font-medium'>${skill.name.charAt(
                                  0
                                )}</div>`;
                              }
                            }}
                            src={skill.icon}
                            width={SKILL_ICON_SIZE}
                          />
                        </div>
                        {/* Skill Name */}
                        <span className="break-words text-center font-medium text-light-text text-xs leading-tight transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-text dark:group-hover:text-blue-400">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            }
          )}
        </motion.div>
      </div>
    </section>
  );
}
