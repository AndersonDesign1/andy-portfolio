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

  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px]">
        {/* Header & Toggle */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-semibold mb-8 text-light-heading dark:text-dark-heading">
            Professional Background
          </h2>
          <div className="relative inline-flex items-center p-1 bg-light-mini/10 dark:bg-dark-mini/10 rounded-full">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex items-center gap-2 px-7 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "text-light-bg dark:text-dark-bg"
                    : "text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading"
                }`}
                style={{ fontWeight: activeTab === tab ? 600 : 500 }}
                type="button"
              >
                {tabIcons[tab]}
                {tab === "work" ? "Experience" : "Education"}
              </button>
            ))}
            {/* Active Tab Background */}
            <div
              className={`absolute top-1 bottom-1 bg-light-heading dark:bg-dark-heading rounded-full shadow-lg transition-all duration-300 ${
                activeTab === "work"
                  ? "left-1 right-[50%]"
                  : "left-[50%] right-1"
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {activeTab === "work" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {workExperience.map((job, idx) => (
                <div
                  key={job.id}
                  className="relative flex flex-col sm:flex-row gap-6 mb-12 last:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: getAnimationDelay(idx) }}
                >
                  {/* Timeline Line - hidden on mobile */}
                  {idx < workExperience.length - 1 && (
                    <div className="absolute left-6 sm:left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20 hidden sm:block" />
                  )}
                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm">
                      <BriefcaseIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    </div>
                    {job.current && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-light-heading dark:bg-dark-heading rounded-full animate-pulse" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-light-heading dark:text-dark-heading">
                            {job.position}
                          </h3>
                          <div className="flex items-center gap-2 text-light-text dark:text-dark-text flex-wrap">
                            <span className="font-medium">{job.company}</span>
                            {job.companyUrl && (
                              <a
                                href={job.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-200"
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {job.current && (
                          <span className="px-3 py-1 text-xs font-medium bg-light-heading/10 dark:bg-dark-heading/10 text-light-heading dark:text-dark-heading rounded-full mt-2 sm:mt-0">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-light-mini dark:text-dark-mini">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {formatDate(job.startDate)} -{" "}
                            {job.endDate ? formatDate(job.endDate) : "Present"}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="relative flex flex-col sm:flex-row gap-6 mb-12 last:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: getAnimationDelay(idx) }}
                >
                  {/* Timeline Line - hidden on mobile */}
                  {idx < education.length - 1 && (
                    <div className="absolute left-6 sm:left-6 top-16 w-px h-full bg-light-mini/20 dark:bg-dark-mini/20 hidden sm:block" />
                  )}
                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-12 h-12 bg-light-bg dark:bg-dark-bg rounded-full flex items-center justify-center shadow-sm">
                      <AcademicCapIcon className="w-5 h-5 text-light-mini dark:text-dark-mini" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-light-heading dark:text-dark-heading">
                            {edu.degree} in {edu.field}
                          </h3>
                          <div className="flex items-center gap-2 text-light-text dark:text-dark-text flex-wrap">
                            <span className="font-medium">
                              {edu.institution}
                            </span>
                            {edu.institutionUrl && (
                              <a
                                href={edu.institutionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-200"
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {edu.gpa && (
                          <span className="px-3 py-1 text-xs font-medium bg-light-heading/10 dark:bg-dark-heading/10 text-light-heading dark:text-dark-heading rounded-full mt-2 sm:mt-0">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-light-mini dark:text-dark-mini">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
