"use client";

import { Clock, ExternalLinkIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import educationData from "@/data/education.json" with { type: "json" };
import workExperienceData from "@/data/work-experience.json" with {
  type: "json",
};
import {
  useScrollAnimation,
  workContainer,
  workItemVariants,
} from "@/hooks/use-scroll-animation";
import { formatDate } from "@/lib/utils";

const TABS = ["work", "education"] as const;
type Tab = (typeof TABS)[number];

const tabIcons = {
  work: "💼",
  education: "🎓",
};

const ANIMATIONS = {
  motion: {
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    duration: 0.25,
  },
  spring: {
    type: "spring" as const,
    stiffness: 450,
    damping: 28,
  },
  hover: {
    ease: [0.23, 1, 0.32, 1] as const,
    duration: 0.2,
  },
} as const;

export default function WorkHistory() {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const [openItem, setOpenItem] = useState<string>("");
  const workExperience = workExperienceData.workExperience;
  const education = educationData.education;
  const { ref: workRef } = useScrollAnimation({ threshold: 0.1 });

  const handleOpenChange = (value: string) => {
    setOpenItem(value);
  };

  // Sort work experience: current roles first, then by year (newest first)
  const sortedWorkExperience = [...workExperience].sort((a, b) => {
    const aIsCurrent = !a.endDate;
    const bIsCurrent = !b.endDate;

    // Current roles come first
    if (aIsCurrent && !bIsCurrent) {
      return -1;
    }
    if (!aIsCurrent && bIsCurrent) {
      return 1;
    }

    // If both are current, prioritize developer roles above SEO roles
    if (aIsCurrent && bIsCurrent) {
      const aIsDeveloper =
        a.position.toLowerCase().includes("developer") ||
        a.position.toLowerCase().includes("full stack");
      const bIsDeveloper =
        b.position.toLowerCase().includes("developer") ||
        b.position.toLowerCase().includes("full stack");

      if (aIsDeveloper && !bIsDeveloper) {
        return -1;
      }
      if (!aIsDeveloper && bIsDeveloper) {
        return 1;
      }
    }

    // If both are current or both are past, sort by start date (newest first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Sort education: current education first, then by year (newest first)
  const sortedEducation = [...education].sort((a, b) => {
    const aIsCurrent = !a.endDate;
    const bIsCurrent = !b.endDate;

    // Current education comes first
    if (aIsCurrent && !bIsCurrent) {
      return -1;
    }
    if (!aIsCurrent && bIsCurrent) {
      return 1;
    }

    // If both are current or both are past, sort by start date (newest first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <section
      className="bg-light-bg py-20 transition-colors duration-300 dark:bg-dark-bg"
      ref={workRef}
    >
      <div className="mx-auto max-w-screen-xl overflow-hidden px-4 sm:px-8 md:px-16 lg:px-[150px]">
        {/* Header & Toggle */}
        <motion.div
          animate="visible"
          className="mb-16"
          initial="hidden"
          variants={workItemVariants}
        >
          <h2 className="mb-8 font-semibold text-light-heading text-xl dark:text-dark-heading">
            Professional Background
          </h2>
          <div className="relative inline-flex items-center rounded-full border border-light-mini/20 bg-light-mini/10 p-1 dark:border-dark-mini/20 dark:bg-dark-mini/10">
            {TABS.map((tab) => (
              <motion.button
                className={`relative z-10 flex cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-gray-900 shadow-sm dark:text-white"
                    : "text-light-text hover:text-light-heading dark:text-dark-text dark:hover:text-dark-heading"
                }`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 500, damping: 30 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">{tabIcons[tab]}</span>
                {tab === "work" ? "Experience" : "Education"}
              </motion.button>
            ))}
            {/* Active Tab Background */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-blue-600 shadow-sm dark:bg-blue-500"
              initial={false}
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 550,
                damping: 30,
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "work" ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="relative"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key="work"
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 28,
              }}
            >
              {/* Timeline Container */}
              <motion.div
                animate="visible"
                className="relative"
                initial="hidden"
                variants={workContainer}
              >
                {/* Main Accordion Container */}
                <div className="relative rounded-xl border border-light-mini/20 bg-light-bg/50 dark:border-dark-mini/20 dark:bg-dark-bg/50">
                  <Accordion
                    className="relative"
                    collapsible
                    onValueChange={handleOpenChange}
                    type="single"
                    value={openItem}
                  >
                    <ul>
                      {sortedWorkExperience.map((job, i) => {
                        const firstItem = i === 0;
                        const lastItem = sortedWorkExperience.length - 1 === i;
                        const key = job.id;
                        const open = openItem === key;

                        return (
                          <AccordionItem
                            className="group relative"
                            key={key}
                            value={key}
                          >
                            <li>
                              <motion.div
                                className={`absolute inset-0 -z-10 bg-light-mini/5 dark:bg-dark-mini/5 ${
                                  lastItem ? "rounded-b-xl" : ""
                                } ${firstItem ? "rounded-t-xl" : ""}`}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{
                                  opacity: 1,
                                  transition: { duration: 0.2 },
                                }}
                              />

                              {/* Separator Line */}
                              {!lastItem && (
                                <div className="absolute right-0 bottom-0 left-0 border-light-mini/10 border-b dark:border-dark-mini/10" />
                              )}

                              <motion.div
                                animate={open ? "open" : "closed"}
                                className="overflow-hidden"
                              >
                                <AccordionTrigger
                                  aria-label={`${new Date(
                                    job.startDate
                                  ).getFullYear()}, ${job.position}, ${
                                    job.company
                                  }`}
                                  className={`relative grid w-full cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-y-2 rounded-xl px-5 py-5 text-left transition-all duration-300 hover:no-underline sm:grid-cols-[auto_auto_1fr_auto] md:grid-cols-[4.25rem_3.25rem_1fr_8.5rem] md:px-7 lg:grid-cols-[5.25rem_3.25rem_1fr_8.5rem] xl:px-10 xl:py-6 ${
                                    firstItem ? "rounded-t-xl" : ""
                                  } ${lastItem ? "rounded-b-xl" : ""}`}
                                  value={key}
                                >
                                  {/* Year */}
                                  <div className="col-start-3 hidden sm:col-start-auto sm:mr-10 sm:block">
                                    <div className="relative font-semibold text-light-mini text-xs md:text-sm dark:text-dark-mini">
                                      {job.endDate ? (
                                        new Date(job.startDate).getFullYear()
                                      ) : (
                                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                          <Clock className="h-3 w-3" />
                                          Present
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Company Logo */}
                                  <div className="col-span-2 col-start-1 mr-4 sm:col-span-1 sm:col-start-auto md:mr-0">
                                    {job.logoUrl ? (
                                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-light-mini/20 bg-white sm:h-12 sm:w-12 dark:border-dark-mini/20">
                                        <img
                                          alt={`${job.company} logo`}
                                          className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                                          onError={(e) => {
                                            // Fallback to initials if logo fails to load
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const fallback =
                                              target.nextElementSibling as HTMLElement;
                                            if (fallback) {
                                              fallback.style.display = "flex";
                                            }
                                          }}
                                          src={
                                            job.logoUrl || "/placeholder.svg"
                                          }
                                        />
                                      </div>
                                    ) : null}
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-sm text-white sm:h-12 sm:w-12 dark:bg-blue-500 ${
                                        job.logoUrl ? "hidden" : ""
                                      }`}
                                    >
                                      {job.company.charAt(0)}
                                    </div>
                                  </div>

                                  {/* Company & Role Info */}
                                  <span className="col-start-3 ml-8 grid grid-cols-1 grid-rows-2 gap-y-2 pt-1 sm:col-start-auto sm:row-start-auto md:grid-cols-2 md:grid-rows-1 md:items-center md:pt-0">
                                    <motion.h3
                                      className="col-span-2 font-medium text-light-heading text-sm sm:text-base md:col-span-1 md:text-lg dark:text-dark-heading"
                                      transition={{
                                        ...ANIMATIONS.motion,
                                        color: { duration: 0.1 },
                                      }}
                                    >
                                      {job.company}
                                    </motion.h3>

                                    <AnimatePresence initial={false}>
                                      {!open && (
                                        <motion.p
                                          animate="open"
                                          className="col-span-2 col-start-1 font-normal text-light-text text-xs md:col-span-1 md:col-start-2 md:text-sm lg:text-base dark:text-dark-text"
                                          exit="closed"
                                          initial="closed"
                                          transition={ANIMATIONS.motion}
                                          variants={{
                                            open: { opacity: 1, y: "0%" },
                                            closed: { opacity: 0, y: "100%" },
                                          }}
                                        >
                                          {job.position}
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </span>

                                  {/* Plus Icon */}
                                  <div className="col-start-4 flex justify-end">
                                    <div className="rounded-full border border-light-mini/20 bg-light-mini/5 p-1.5 md:p-2 dark:border-dark-mini/20 dark:bg-dark-mini/5">
                                      <motion.div
                                        initial={false}
                                        transition={ANIMATIONS.spring}
                                        variants={{
                                          open: { rotate: 45, scale: 1.1 },
                                          closed: { rotate: 0, scale: 1 },
                                        }}
                                      >
                                        <PlusIcon className="h-4 w-4 text-light-heading md:h-5 md:w-5 dark:text-dark-heading" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      animate={{
                                        height: "auto",
                                        opacity: 1,
                                        transition: {
                                          height: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.7,
                                          },
                                          opacity: {
                                            delay: 0.08,
                                            duration: 0.25,
                                          },
                                        },
                                      }}
                                      className="overflow-hidden"
                                      exit={{
                                        height: 0,
                                        opacity: 0,
                                        transition: {
                                          height: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 28,
                                            mass: 0.6,
                                          },
                                          opacity: { duration: 0.2 },
                                        },
                                      }}
                                      initial={{ height: 0, opacity: 0 }}
                                    >
                                      <div className="relative px-5 pt-2 pb-14 md:px-7 md:pl-[4.25rem] lg:pl-[5.25rem] xl:px-10">
                                        <motion.div
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                          }}
                                          initial={{ opacity: 0, y: -10 }}
                                          transition={{
                                            delay: 0.12,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            duration: 0.4,
                                          }}
                                        >
                                          {/* Description */}
                                          <p className="mb-10 max-w-[50em] font-normal text-light-text text-sm leading-relaxed md:mb-12 md:text-base dark:text-dark-text">
                                            {job.description}
                                          </p>

                                          {/* Key Details Grid */}
                                          <div className="flex flex-col items-start gap-7 md:gap-8 lg:flex-row lg:gap-16">
                                            {[
                                              ["Home", job.companyUrl],
                                              ["Role", job.position],
                                              [
                                                "Tenure",
                                                `${formatDate(
                                                  job.startDate
                                                )} - ${
                                                  job.endDate
                                                    ? formatDate(job.endDate)
                                                    : "Present"
                                                }`,
                                              ],
                                            ].map(([label, value]) => (
                                              <div key={label}>
                                                <div className="mb-3 font-medium text-light-heading text-sm md:mb-4 md:text-base dark:text-dark-heading">
                                                  {label}
                                                </div>

                                                {value === job.companyUrl ? (
                                                  <a
                                                    className="block text-blue-600 text-sm underline decoration-light-mini/30 underline-offset-2 transition-colors hover:text-blue-700 md:text-base dark:text-blue-400 dark:decoration-dark-mini/30 dark:hover:text-blue-300"
                                                    href={value}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                  >
                                                    {value}
                                                    <ExternalLinkIcon className="ml-1 inline h-3 w-3" />
                                                  </a>
                                                ) : (
                                                  <div className="font-normal text-light-text text-sm md:text-base dark:text-dark-text">
                                                    {value}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>

                                          {/* Technologies */}
                                          {job.technologies &&
                                            job.technologies.length > 0 && (
                                              <div className="mt-8">
                                                <div className="mb-3 font-medium text-light-heading text-sm md:mb-4 md:text-base dark:text-dark-heading">
                                                  Technologies
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {job.technologies.map(
                                                    (tech, techIdx) => (
                                                      <span
                                                        className="rounded-full border border-light-mini/20 bg-light-mini/10 px-3 py-1 text-light-text text-xs dark:border-dark-mini/20 dark:bg-dark-mini/10 dark:text-dark-text"
                                                        key={techIdx}
                                                      >
                                                        {tech}
                                                      </span>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </li>
                          </AccordionItem>
                        );
                      })}
                    </ul>
                  </Accordion>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="relative"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key="education"
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 28,
              }}
            >
              {/* Timeline Container */}
              <motion.div
                animate="visible"
                className="relative"
                initial="hidden"
                variants={workContainer}
              >
                {/* Main Accordion Container */}
                <div className="relative rounded-xl border border-light-mini/20 bg-light-bg/50 dark:border-dark-mini/20 dark:bg-dark-bg/50">
                  <Accordion
                    className="relative"
                    collapsible
                    onValueChange={handleOpenChange}
                    type="single"
                    value={openItem}
                  >
                    <ul>
                      {sortedEducation.map((edu, i) => {
                        const firstItem = i === 0;
                        const lastItem = sortedEducation.length - 1 === i;
                        const key = edu.id;
                        const open = openItem === key;

                        return (
                          <AccordionItem
                            className="group relative"
                            key={key}
                            value={key}
                          >
                            <li>
                              <motion.div
                                className={`absolute inset-0 -z-10 bg-light-mini/5 dark:bg-dark-mini/5 ${
                                  lastItem ? "rounded-b-xl" : ""
                                } ${firstItem ? "rounded-t-xl" : ""}`}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{
                                  opacity: 1,
                                  transition: { duration: 0.2 },
                                }}
                              />

                              {/* Separator Line */}
                              {!lastItem && (
                                <div className="absolute right-0 bottom-0 left-0 border-light-mini/10 border-b dark:border-dark-mini/10" />
                              )}

                              <motion.div
                                animate={open ? "open" : "closed"}
                                className="overflow-hidden"
                              >
                                <AccordionTrigger
                                  aria-label={`${new Date(
                                    edu.startDate
                                  ).getFullYear()}, ${edu.degree}, ${
                                    edu.institution
                                  }`}
                                  className={`relative grid w-full cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-y-2 rounded-xl px-5 py-5 text-left transition-all duration-300 hover:no-underline sm:grid-cols-[auto_auto_1fr_auto] md:grid-cols-[4.25rem_3.25rem_1fr_8.5rem] md:px-7 lg:grid-cols-[5.25rem_3.25rem_1fr_8.5rem] xl:px-10 xl:py-6 ${
                                    firstItem ? "rounded-t-xl" : ""
                                  } ${lastItem ? "rounded-b-xl" : ""}`}
                                  value={key}
                                >
                                  {/* Year */}
                                  <div className="col-start-3 hidden sm:col-start-auto sm:mr-10 sm:block">
                                    <div className="relative font-semibold text-light-mini text-xs md:text-sm dark:text-dark-mini">
                                      {edu.endDate ? (
                                        new Date(edu.startDate).getFullYear()
                                      ) : (
                                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                          <Clock className="h-3 w-3" />
                                          Present
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Institution Logo */}
                                  <div className="col-span-2 col-start-1 mr-4 sm:col-span-1 sm:col-start-auto md:mr-0">
                                    {edu.logoUrl ? (
                                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-light-mini/20 bg-white sm:h-12 sm:w-12 dark:border-dark-mini/20">
                                        <img
                                          alt={`${edu.institution} logo`}
                                          className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                                          onError={(e) => {
                                            // Fallback to initials if logo fails to load
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const fallback =
                                              target.nextElementSibling as HTMLElement;
                                            if (fallback) {
                                              fallback.style.display = "flex";
                                            }
                                          }}
                                          src={
                                            edu.logoUrl || "/placeholder.svg"
                                          }
                                        />
                                      </div>
                                    ) : null}
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-sm text-white sm:h-12 sm:w-12 dark:bg-green-500 ${
                                        edu.logoUrl ? "hidden" : ""
                                      }`}
                                    >
                                      {edu.institution.charAt(0)}
                                    </div>
                                  </div>

                                  {/* Institution & Degree Info */}
                                  <span className="col-start-3 ml-8 grid grid-cols-1 gap-y-2 pt-1 sm:col-start-auto sm:row-start-auto md:grid-cols-2 md:grid-rows-1 md:items-center md:pt-0">
                                    <motion.h3
                                      className="col-span-2 font-medium text-light-heading text-sm sm:text-base md:col-span-1 md:text-lg dark:text-dark-heading"
                                      transition={{
                                        ...ANIMATIONS.motion,
                                        color: { duration: 0.1 },
                                      }}
                                    >
                                      {edu.institution}
                                    </motion.h3>

                                    <AnimatePresence initial={false}>
                                      {!open && (
                                        <motion.p
                                          animate="open"
                                          className="col-span-2 col-start-1 font-normal text-light-text text-xs md:col-span-1 md:col-start-2 md:text-sm lg:text-base dark:text-dark-text"
                                          exit="closed"
                                          initial="closed"
                                          transition={ANIMATIONS.motion}
                                          variants={{
                                            open: { opacity: 1, y: "0%" },
                                            closed: { opacity: 0, y: "100%" },
                                          }}
                                        >
                                          {edu.degree}
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </span>

                                  {/* Plus Icon */}
                                  <div className="col-start-4 flex justify-end">
                                    <div className="rounded-full border border-light-mini/20 bg-light-mini/5 p-1.5 md:p-2 dark:border-dark-mini/20 dark:bg-dark-mini/5">
                                      <motion.div
                                        initial={false}
                                        transition={ANIMATIONS.spring}
                                        variants={{
                                          open: { rotate: 45, scale: 1.1 },
                                          closed: { rotate: 0, scale: 1 },
                                        }}
                                      >
                                        <PlusIcon className="h-4 w-4 text-light-heading md:h-5 md:w-5 dark:text-dark-heading" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      animate={{
                                        height: "auto",
                                        opacity: 1,
                                        transition: {
                                          height: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.7,
                                          },
                                          opacity: {
                                            delay: 0.08,
                                            duration: 0.25,
                                          },
                                        },
                                      }}
                                      className="overflow-hidden"
                                      exit={{
                                        height: 0,
                                        opacity: 0,
                                        transition: {
                                          height: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 28,
                                            mass: 0.6,
                                          },
                                          opacity: { duration: 0.2 },
                                        },
                                      }}
                                      initial={{ height: 0, opacity: 0 }}
                                    >
                                      <div className="relative px-5 pt-2 pb-14 md:px-7 md:pl-[4.25rem] lg:pl-[5.25rem] xl:px-10">
                                        <motion.div
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                          }}
                                          initial={{ opacity: 0, y: -10 }}
                                          transition={{
                                            delay: 0.12,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            duration: 0.4,
                                          }}
                                        >
                                          {/* Field */}
                                          {edu.field && (
                                            <div className="mb-6">
                                              <div className="mb-3 font-medium text-light-heading text-sm md:mb-4 md:text-base dark:text-dark-heading">
                                                Field
                                              </div>
                                              <div className="font-normal text-light-text text-sm md:text-base dark:text-dark-text">
                                                {edu.field}
                                              </div>
                                            </div>
                                          )}

                                          {/* Key Details Grid */}
                                          <div className="flex flex-col items-start gap-7 md:gap-8 lg:flex-row lg:gap-16">
                                            {[
                                              ["Home", edu.institutionUrl],
                                              ["Degree", edu.degree],
                                              [
                                                "Duration",
                                                `${formatDate(
                                                  edu.startDate
                                                )} - ${
                                                  edu.endDate
                                                    ? formatDate(edu.endDate)
                                                    : "Present"
                                                }`,
                                              ],
                                            ].map(([label, value]) => (
                                              <div key={label}>
                                                <div className="mb-3 font-medium text-light-heading text-sm md:mb-4 md:text-base dark:text-dark-heading">
                                                  {label}
                                                </div>

                                                {value ===
                                                edu.institutionUrl ? (
                                                  <a
                                                    className="block text-blue-600 text-sm underline decoration-light-mini/30 underline-offset-2 transition-colors hover:text-blue-700 md:text-base dark:text-blue-400 dark:decoration-dark-mini/30 dark:hover:text-blue-300"
                                                    href={value}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                  >
                                                    {value}
                                                    <ExternalLinkIcon className="ml-1 inline h-3 w-3" />
                                                  </a>
                                                ) : (
                                                  <div className="font-normal text-light-text text-sm md:text-base dark:text-dark-text">
                                                    {value}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>

                                          {/* Location */}
                                          {edu.location && (
                                            <div className="mt-8">
                                              <div className="mb-3 font-medium text-light-heading text-sm md:mb-4 md:text-base dark:text-dark-heading">
                                                Location
                                              </div>
                                              <div className="font-normal text-light-text text-sm md:text-base dark:text-dark-text">
                                                {edu.location}
                                              </div>
                                            </div>
                                          )}
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </li>
                          </AccordionItem>
                        );
                      })}
                    </ul>
                  </Accordion>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
