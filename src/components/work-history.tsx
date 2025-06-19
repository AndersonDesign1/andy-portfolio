"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const TABS = ["work", "education"] as const;
type Tab = (typeof TABS)[number];

const tabIcons = {
  work: <BriefcaseIcon className="w-4 h-4" />,
  education: <AcademicCapIcon className="w-4 h-4" />,
};

const WorkHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const workExperience = workExperienceData.workExperience;
  const education = educationData.education;

  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-[150px]">
        {/* Header & Toggle */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-8 text-light-heading dark:text-dark-heading">
            Professional Background
          </h2>
          <div className="relative inline-flex items-center p-1 bg-light-mini/10 dark:bg-dark-mini/10 rounded-full">
            {TABS.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex items-center gap-2 px-7 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "text-light-bg dark:text-dark-bg"
                    : "text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading"
                }`}
                style={{ fontWeight: activeTab === tab ? 600 : 500 }}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {tabIcons[tab]}
                {tab === "work" ? "Experience" : "Education"}
              </motion.button>
            ))}
            {/* Active Tab Background */}
            <motion.div
              className="absolute top-1 bottom-1 bg-light-heading dark:bg-dark-heading rounded-full shadow-lg"
              initial={false}
              animate={{
                left: activeTab === "work" ? "4px" : "50%",
                right: activeTab === "work" ? "50%" : "4px",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "work" ? (
            <motion.div
              key="work"
              className="space-y-12"
              initial={false}
              animate="visible"
              exit="hidden"
            >
              {workExperience.map((job, idx) => (
                <motion.div
                  key={job.id}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.25, 0.25, 0, 1] }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Timeline Line */}
                  {idx < workExperience.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20" />
                  )}
                  {/* Timeline Dot */}
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.08 }}
                  >
                    <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm">
                      <BriefcaseIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    </div>
                    {job.current && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-light-heading dark:bg-dark-heading rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <motion.h3
                            className="text-lg font-semibold text-light-heading dark:text-dark-heading"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            {job.position}
                          </motion.h3>
                          <div className="flex items-center gap-2 text-light-text dark:text-dark-text">
                            <span className="font-medium">{job.company}</span>
                            {job.companyUrl && (
                              <motion.a
                                href={job.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                        {job.current && (
                          <span className="px-3 py-1 text-xs font-medium bg-light-heading/10 dark:bg-dark-heading/10 text-light-heading dark:text-dark-heading rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-light-mini dark:text-dark-mini">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(job.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}{" "}
                            -{" "}
                            {job.endDate
                              ? new Date(job.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" }
                                )
                              : "Present"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-light-text dark:text-dark-text leading-relaxed">
                      {job.description}
                    </p>
                    {/* Achievements */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {job.achievements.map((ach, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                          >
                            <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Technologies */}
                    {job.technologies && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="education"
              className="space-y-12"
              initial={false}
              animate="visible"
              exit="hidden"
            >
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.25, 0.25, 0, 1] }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Timeline Line */}
                  {idx < education.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20" />
                  )}
                  {/* Timeline Dot */}
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.08 }}
                  >
                    <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm">
                      <AcademicCapIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    </div>
                  </motion.div>
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <motion.h3
                            className="text-lg font-semibold text-light-heading dark:text-dark-heading"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.18 }}
                          >
                            {edu.degree} in {edu.field}
                          </motion.h3>
                          <div className="flex items-center gap-2 text-light-text dark:text-dark-text">
                            <span className="font-medium">
                              {edu.institution}
                            </span>
                            {edu.institutionUrl && (
                              <motion.a
                                href={edu.institutionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                        {edu.gpa && (
                          <span className="px-3 py-1 text-xs font-medium bg-light-heading/10 dark:bg-dark-heading/10 text-light-heading dark:text-dark-heading rounded-full">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-light-mini dark:text-dark-mini">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(edu.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}{" "}
                            -{" "}
                            {new Date(edu.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>
                    {/* Honors */}
                    {edu.honors && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          Honors & Recognition
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.honors.map((honor) => (
                            <span
                              key={honor}
                              className="px-3 py-1 text-xs bg-light-mini/10 dark:bg-dark-mini/10 text-light-text dark:text-dark-text rounded-full"
                            >
                              {honor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Relevant Courses */}
                    {edu.relevantCourses && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          Relevant Coursework
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {edu.relevantCourses.map((course) => (
                            <div
                              key={course}
                              className="text-sm text-light-text dark:text-dark-text"
                            >
                              • {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Projects */}
                    {edu.projects && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-light-heading dark:text-dark-heading">
                          Notable Projects
                        </h4>
                        <ul className="space-y-2">
                          {edu.projects.map((project, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-light-text dark:text-dark-text"
                            >
                              <CheckIcon className="w-4 h-4 text-light-mini dark:text-dark-mini mt-0.5 flex-shrink-0" />
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkHistory;
