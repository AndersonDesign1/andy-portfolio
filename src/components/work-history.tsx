"use client";

import React, { useState } from "react";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import workExperienceData from "@/data/work-experience.json";
import educationData from "@/data/education.json";
import { getAnimationDelay, formatDate } from "@/lib/utils";
import {
  useScrollAnimation,
  workContainer,
  workItemVariants,
  timelineDotVariants,
} from "@/hooks/use-scroll-animation";
import { motion, AnimatePresence } from "motion/react";

const TABS = ["work", "education"] as const;
type Tab = (typeof TABS)[number];

const tabIcons = {
  work: <BriefcaseIcon className="w-4 h-4" />,
  education: <AcademicCapIcon className="w-4 h-4" />,
};

export default function WorkHistory() {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const workExperience = workExperienceData.workExperience;
  const education = educationData.education;
  const { ref: workRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={workRef}
      className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
        {/* Header & Toggle */}
        <motion.div
          variants={workItemVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-xl font-semibold mb-8 text-light-heading dark:text-dark-heading">
            Professional Background
          </h2>
          <div className="relative inline-flex items-center p-1 bg-light-mini/10 dark:bg-dark-mini/10 rounded-full">
            {TABS.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative z-10 flex items-center gap-2 px-7 py-2 text-sm font-medium rounded-full cursor-pointer ${
                  activeTab === tab
                    ? "text-light-bg dark:text-dark-bg"
                    : "text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading"
                }`}
                style={{ fontWeight: activeTab === tab ? 600 : 500 }}
                type="button"
              >
                {tabIcons[tab]}
                {tab === "work" ? "Experience" : "Education"}
              </motion.button>
            ))}
            {/* Active Tab Background */}
            <motion.div
              layoutId="activeTab"
              className="absolute top-1 bottom-1 bg-light-heading dark:bg-dark-heading rounded-full shadow-lg"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "work" ? (
            <motion.div
              key="work"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="space-y-12"
            >
              <motion.div
                variants={workContainer}
                initial="hidden"
                animate="visible"
              >
                {workExperience.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    variants={workItemVariants}
                    whileHover={{
                      x: 8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      },
                    }}
                    className="relative flex flex-col sm:flex-row gap-6 mb-12 last:mb-0 group"
                  >
                    {/* Timeline Line - hidden on mobile */}
                    {idx < workExperience.length - 1 && (
                      <motion.div
                        variants={timelineDotVariants}
                        className="absolute left-6 sm:left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20 hidden sm:block origin-top"
                      />
                    )}
                    {/* Timeline Dot */}
                    <motion.div
                      variants={timelineDotVariants}
                      className="relative flex-shrink-0 mx-auto sm:mx-0"
                    >
                      <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                        <BriefcaseIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                      </div>
                      {job.current && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-light-heading dark:bg-dark-heading rounded-full"
                        />
                      )}
                    </motion.div>
                    {/* Content */}
                    <motion.div
                      variants={workItemVariants}
                      className="flex-1 space-y-4 min-w-0"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div>
                            <motion.h3
                              whileHover={{
                                x: 5,
                                transition: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                },
                              }}
                              className="text-lg font-semibold text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                            >
                              {job.position}
                            </motion.h3>
                            <div className="flex items-center gap-2 text-light-text dark:text-dark-text flex-wrap">
                              <span className="font-medium">{job.company}</span>
                              {job.companyUrl && (
                                <motion.a
                                  whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    transition: {
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 25,
                                    },
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  href={job.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-light-mini dark:text-dark-mini hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                                >
                                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(job.startDate)}</span>
                            <span>-</span>
                            <span>{job.endDate || "Present"}</span>
                          </div>
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                      </div>
                      <motion.p
                        variants={workItemVariants}
                        whileHover={{
                          x: 5,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                        }}
                        className="text-sm text-light-text dark:text-dark-text leading-relaxed"
                      >
                        {job.description}
                      </motion.p>
                      {job.achievements && job.achievements.length > 0 && (
                        <motion.ul
                          variants={workItemVariants}
                          className="space-y-2"
                        >
                          {job.achievements.map(
                            (achievement, achievementIdx) => (
                              <motion.li
                                key={achievementIdx}
                                whileHover={{
                                  x: 5,
                                  transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  },
                                }}
                                className="flex items-start gap-2 text-sm text-light-text dark:text-dark-text"
                              >
                                <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{achievement}</span>
                              </motion.li>
                            )
                          )}
                        </motion.ul>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="space-y-12"
            >
              <motion.div
                variants={workContainer}
                initial="hidden"
                animate="visible"
              >
                {education.map((edu, idx) => (
                  <motion.div
                    key={edu.id}
                    variants={workItemVariants}
                    whileHover={{
                      x: 8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      },
                    }}
                    className="relative flex flex-col sm:flex-row gap-6 mb-12 last:mb-0 group"
                  >
                    {/* Timeline Line - hidden on mobile */}
                    {idx < education.length - 1 && (
                      <motion.div
                        variants={timelineDotVariants}
                        className="absolute left-6 sm:left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20 hidden sm:block origin-top"
                      />
                    )}
                    {/* Timeline Dot */}
                    <motion.div
                      variants={timelineDotVariants}
                      className="relative flex-shrink-0 mx-auto sm:mx-0"
                    >
                      <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                        <AcademicCapIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                      </div>
                    </motion.div>
                    {/* Content */}
                    <motion.div
                      variants={workItemVariants}
                      className="flex-1 space-y-4 min-w-0"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div>
                            <motion.h3
                              whileHover={{
                                x: 5,
                                transition: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                },
                              }}
                              className="text-lg font-semibold text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                            >
                              {edu.degree}
                            </motion.h3>
                            <div className="flex items-center gap-2 text-light-text dark:text-dark-text flex-wrap">
                              <span className="font-medium">
                                {edu.institution}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(edu.startDate)}</span>
                            <span>-</span>
                            <span>{edu.endDate || "Present"}</span>
                          </div>
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
