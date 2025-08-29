"use client";

import { useState } from "react";
import { PlusIcon, ExternalLinkIcon } from "lucide-react";
import workExperienceData from "@/data/work-experience.json";
import educationData from "@/data/education.json";
import { formatDate } from "@/lib/utils";
import {
  useScrollAnimation,
  workContainer,
  workItemVariants,
} from "@/hooks/use-scroll-animation";
import { motion, AnimatePresence } from "motion/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  // Sort work experience by year (newest first)
  const sortedWorkExperience = [...workExperience].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Sort education by year (newest first)
  const sortedEducation = [...education].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <section
      ref={workRef}
      className="py-20 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] overflow-hidden">
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
          <div className="relative inline-flex items-center p-1 bg-light-mini/20 dark:bg-dark-mini/20 rounded-full border border-light-mini/10 dark:border-dark-mini/10">
            {TABS.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 500, damping: 30 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-gray-900 dark:text-white shadow-sm"
                    : "text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading"
                }`}
                type="button"
              >
                <span className="text-base">{tabIcons[tab]}</span>
                {tab === "work" ? "Experience" : "Education"}
              </motion.button>
            ))}
            {/* Active Tab Background */}
            <motion.div
              layoutId="activeTab"
              className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md"
              initial={false}
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
              key="work"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 28,
              }}
              className="relative"
            >
              {/* Timeline Container */}
              <motion.div
                variants={workContainer}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Right Side Decorative Elements */}
                <div className="absolute right-5 md:right-9 lg:right-8 xl:right-11 top-0 bottom-0 w-8 lg:w-9">
                  {/* Horizontal Line */}
                  <div className="absolute -bottom-10 right-5 w-64 md:w-96 h-px bg-light-mini/20 dark:bg-dark-mini/20" />
                </div>

                {/* Main Accordion Container */}
                <div className="rounded-3xl border border-light-mini/20 dark:border-dark-mini/20 bg-gradient-to-br from-light-mini/5 to-light-mini/10 dark:from-dark-mini/5 dark:to-dark-mini/10 relative">
                  <Accordion
                    type="single"
                    collapsible
                    value={openItem}
                    onValueChange={handleOpenChange}
                    className="relative"
                  >
                    <ul>
                      {sortedWorkExperience.map((job, i) => {
                        const firstItem = i === 0;
                        const lastItem = sortedWorkExperience.length - 1 === i;
                        const key = job.id;
                        const open = openItem === key;

                        return (
                          <AccordionItem
                            value={key}
                            key={key}
                            className="relative group"
                          >
                            <li>
                              <AnimatePresence>
                                {open && (
                                  <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br from-light-mini/25 to-light-mini/10 dark:from-dark-mini/25 dark:to-dark-mini/10 -z-10 ${
                                      lastItem ? "rounded-b-3xl" : ""
                                    } ${firstItem ? "rounded-t-3xl" : ""}`}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: { opacity: 1 },
                                    }}
                                    transition={ANIMATIONS.motion}
                                  />
                                )}
                              </AnimatePresence>

                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br from-light-mini/15 to-light-mini/5 dark:from-dark-mini/15 dark:to-dark-mini/5 -z-20 ${
                                  firstItem ? "rounded-t-3xl" : ""
                                } ${lastItem ? "rounded-b-3xl" : ""}`}
                                initial={{ opacity: 0, scale: 0.99 }}
                                whileHover={{
                                  opacity: 1,
                                  scale: 1,
                                  transition: {
                                    ...ANIMATIONS.hover,
                                    scale: { duration: 0.2 },
                                  },
                                }}
                                transition={ANIMATIONS.hover}
                              />

                              {/* Separator Line */}
                              {!lastItem && (
                                <div className="absolute bottom-0 border-b border-light-mini/3 dark:border-dark-mini/3 left-0 right-0" />
                              )}

                              <motion.div
                                className="overflow-hidden"
                                animate={open ? "open" : "closed"}
                              >
                                <AccordionTrigger
                                  className={`grid grid-cols-[auto_auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] md:grid-cols-[4.25rem_3.25rem_1fr_8.5rem] lg:grid-cols-[5.25rem_3.25rem_1fr_8.5rem] gap-y-2 px-5 md:px-7 xl:px-10 py-5 xl:py-6 items-center relative w-full text-left rounded-xl hover:no-underline cursor-pointer transition-all duration-300 ${
                                    firstItem ? "rounded-t-3xl" : ""
                                  } ${lastItem ? "rounded-b-3xl" : ""}`}
                                  aria-label={`${new Date(
                                    job.startDate
                                  ).getFullYear()}, ${job.position}, ${
                                    job.company
                                  }`}
                                  value={key}
                                >
                                  {/* Year */}
                                  <div className="hidden sm:block col-start-3 sm:col-start-auto sm:mr-10">
                                    <div className="relative font-semibold text-light-mini dark:text-dark-mini text-xs md:text-sm">
                                      {new Date(job.startDate).getFullYear()}
                                    </div>
                                  </div>

                                  {/* Company Logo */}
                                  <div className="col-start-1 col-span-2 sm:col-span-1 sm:col-start-auto mr-4 md:mr-0">
                                    {job.logoUrl ? (
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white overflow-hidden flex items-center justify-center">
                                        <img
                                          src={
                                            job.logoUrl || "/placeholder.svg"
                                          }
                                          alt={`${job.company} logo`}
                                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                          onError={(e) => {
                                            // Fallback to initials if logo fails to load
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const fallback =
                                              target.nextElementSibling as HTMLElement;
                                            if (fallback)
                                              fallback.style.display = "flex";
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                    <div
                                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        job.logoUrl ? "hidden" : ""
                                      }`}
                                    >
                                      {job.company.charAt(0)}
                                    </div>
                                  </div>

                                  {/* Company & Role Info */}
                                  <span className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-y-2 md:items-center col-start-3 sm:col-start-auto sm:row-start-auto pt-1 md:pt-0 ml-8">
                                    <motion.h3
                                      className="text-sm sm:text-base md:text-lg col-span-2 md:col-span-1 font-medium text-light-heading dark:text-dark-heading"
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
                                          className="text-xs md:text-sm lg:text-base text-light-text dark:text-dark-text font-normal col-start-1 col-span-2 md:col-span-1 md:col-start-2"
                                          initial="closed"
                                          animate="open"
                                          exit="closed"
                                          variants={{
                                            open: { opacity: 1, y: "0%" },
                                            closed: { opacity: 0, y: "100%" },
                                          }}
                                          transition={ANIMATIONS.motion}
                                        >
                                          {job.position}
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </span>

                                  {/* Plus Icon */}
                                  <div className="flex justify-end col-start-4">
                                    <div className="p-1.5 md:p-2 border border-light-mini/20 dark:border-dark-mini/20 rounded-full bg-gradient-to-br from-light-mini/10 to-light-mini/5 dark:from-dark-mini/10 dark:to-dark-mini/5">
                                      <motion.div
                                        initial={false}
                                        variants={{
                                          open: { rotate: 45, scale: 1.1 },
                                          closed: { rotate: 0, scale: 1 },
                                        }}
                                        transition={ANIMATIONS.spring}
                                      >
                                        <PlusIcon className="text-light-heading dark:text-dark-heading w-4 h-4 md:w-5 md:h-5" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
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
                                      className="overflow-hidden"
                                    >
                                      <div className="md:pl-[4.25rem] lg:pl-[5.25rem] pb-14 pt-2 relative px-5 md:px-7 xl:px-10">
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                          }}
                                          transition={{
                                            delay: 0.12,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            duration: 0.4,
                                          }}
                                        >
                                          {/* Left Side Decorative Elements */}
                                          <div className="hidden md:block absolute left-0 bottom-14 w-20 h-px bg-light-mini/20 dark:bg-dark-mini/20" />

                                          {/* Description */}
                                          <p className="font-normal text-sm md:text-base text-light-text dark:text-dark-text max-w-[50em] leading-relaxed mb-10 md:mb-12">
                                            {job.description}
                                          </p>

                                          {/* Key Details Grid */}
                                          <div className="flex flex-col lg:flex-row gap-7 md:gap-8 lg:gap-16 items-start">
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
                                                <div className="font-medium text-sm md:text-base mb-3 md:mb-4 text-light-heading dark:text-dark-heading">
                                                  {label}
                                                </div>

                                                {value === job.companyUrl ? (
                                                  <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm md:text-base block underline underline-offset-2 decoration-light-mini/30 dark:decoration-dark-mini/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                                  >
                                                    {value}
                                                    <ExternalLinkIcon className="inline w-3 h-3 ml-1" />
                                                  </a>
                                                ) : (
                                                  <div className="font-normal text-sm md:text-base text-light-text dark:text-dark-text">
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
                                                <div className="font-medium text-sm md:text-base mb-3 md:mb-4 text-light-heading dark:text-dark-heading">
                                                  Technologies
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {job.technologies.map(
                                                    (tech, techIdx) => (
                                                      <span
                                                        key={techIdx}
                                                        className="px-3 py-1 bg-light-mini/10 dark:bg-dark-mini/10 text-xs text-light-text dark:text-dark-text rounded-full border border-light-mini/20 dark:border-dark-mini/20"
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
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 28,
              }}
              className="relative"
            >
              {/* Timeline Container */}
              <motion.div
                variants={workContainer}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Right Side Decorative Elements */}
                <div className="absolute right-5 md:right-9 lg:right-8 xl:right-11 top-0 bottom-0 w-8 lg:w-9">
                  {/* Horizontal Line */}
                  <div className="absolute -bottom-10 right-5 w-64 md:w-96 h-px bg-light-mini/20 dark:bg-dark-mini/20" />
                </div>

                {/* Main Accordion Container */}
                <div className="rounded-3xl border border-light-mini/20 dark:border-dark-mini/20 bg-gradient-to-br from-light-mini/5 to-light-mini/10 dark:from-dark-mini/5 dark:to-dark-mini/10 relative">
                  <Accordion
                    type="single"
                    collapsible
                    value={openItem}
                    onValueChange={handleOpenChange}
                    className="relative"
                  >
                    <ul>
                      {sortedEducation.map((edu, i) => {
                        const firstItem = i === 0;
                        const lastItem = sortedEducation.length - 1 === i;
                        const key = edu.id;
                        const open = openItem === key;

                        return (
                          <AccordionItem
                            value={key}
                            key={key}
                            className="relative group"
                          >
                            <li>
                              <AnimatePresence>
                                {open && (
                                  <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br from-light-mini/25 to-light-mini/10 dark:from-dark-mini/25 dark:to-dark-mini/10 -z-10 ${
                                      lastItem ? "rounded-b-3xl" : ""
                                    } ${firstItem ? "rounded-t-3xl" : ""}`}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: { opacity: 1 },
                                    }}
                                    transition={ANIMATIONS.motion}
                                  />
                                )}
                              </AnimatePresence>

                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br from-light-mini/15 to-light-mini/5 dark:from-dark-mini/15 dark:to-dark-mini/5 -z-20 ${
                                  firstItem ? "rounded-t-3xl" : ""
                                } ${lastItem ? "rounded-b-3xl" : ""}`}
                                initial={{ opacity: 0, scale: 0.99 }}
                                whileHover={{
                                  opacity: 1,
                                  scale: 1,
                                  transition: {
                                    ...ANIMATIONS.hover,
                                    scale: { duration: 0.2 },
                                  },
                                }}
                                transition={ANIMATIONS.hover}
                              />

                              {/* Separator Line */}
                              {!lastItem && (
                                <div className="absolute bottom-0 border-b border-light-mini/3 dark:border-dark-mini/3 left-0 right-0" />
                              )}

                              <motion.div
                                className="overflow-hidden"
                                animate={open ? "open" : "closed"}
                              >
                                <AccordionTrigger
                                  className={`grid grid-cols-[auto_auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] md:grid-cols-[4.25rem_3.25rem_1fr_8.5rem] lg:grid-cols-[5.25rem_3.25rem_1fr_8.5rem] gap-y-2 px-5 md:px-7 xl:px-10 py-5 xl:py-6 items-center relative w-full text-left rounded-xl hover:no-underline cursor-pointer transition-all duration-300 ${
                                    firstItem ? "rounded-t-3xl" : ""
                                  } ${lastItem ? "rounded-b-3xl" : ""}`}
                                  aria-label={`${new Date(
                                    edu.startDate
                                  ).getFullYear()}, ${edu.degree}, ${
                                    edu.institution
                                  }`}
                                  value={key}
                                >
                                  {/* Year */}
                                  <div className="hidden sm:block col-start-3 sm:col-start-auto sm:mr-10">
                                    <div className="relative font-semibold text-light-mini dark:text-dark-mini text-xs md:text-sm">
                                      {new Date(edu.startDate).getFullYear()}
                                    </div>
                                  </div>

                                  {/* Institution Logo */}
                                  <div className="col-start-1 col-span-2 sm:col-span-1 sm:col-start-auto mr-4 md:mr-0">
                                    {edu.logoUrl ? (
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white overflow-hidden flex items-center justify-center">
                                        <img
                                          src={
                                            edu.logoUrl || "/placeholder.svg"
                                          }
                                          alt={`${edu.institution} logo`}
                                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                          onError={(e) => {
                                            // Fallback to initials if logo fails to load
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const fallback =
                                              target.nextElementSibling as HTMLElement;
                                            if (fallback)
                                              fallback.style.display = "flex";
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                    <div
                                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        edu.logoUrl ? "hidden" : ""
                                      }`}
                                    >
                                      {edu.institution.charAt(0)}
                                    </div>
                                  </div>

                                  {/* Institution & Degree Info */}
                                  <span className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 gap-y-2 md:items-center col-start-3 sm:col-start-auto sm:row-start-auto pt-1 md:pt-0 ml-8">
                                    <motion.h3
                                      className="text-sm sm:text-base md:text-lg col-span-2 md:col-span-1 font-medium text-light-heading dark:text-dark-heading"
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
                                          className="text-xs md:text-sm lg:text-base text-light-text dark:text-dark-text font-normal col-start-1 col-span-2 md:col-span-1 md:col-start-2"
                                          initial="closed"
                                          animate="open"
                                          exit="closed"
                                          variants={{
                                            open: { opacity: 1, y: "0%" },
                                            closed: { opacity: 0, y: "100%" },
                                          }}
                                          transition={ANIMATIONS.motion}
                                        >
                                          {edu.degree}
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </span>

                                  {/* Plus Icon */}
                                  <div className="flex justify-end col-start-4">
                                    <div className="p-1.5 md:p-2 border border-light-mini/20 dark:border-dark-mini/20 rounded-full bg-gradient-to-br from-light-mini/10 to-light-mini/5 dark:from-dark-mini/10 dark:to-dark-mini/5">
                                      <motion.div
                                        initial={false}
                                        variants={{
                                          open: { rotate: 45, scale: 1.1 },
                                          closed: { rotate: 0, scale: 1 },
                                        }}
                                        transition={ANIMATIONS.spring}
                                      >
                                        <PlusIcon className="text-light-heading dark:text-dark-heading w-4 h-4 md:w-5 md:h-5" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
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
                                      className="overflow-hidden"
                                    >
                                      <div className="md:pl-[4.25rem] lg:pl-[5.25rem] pb-14 pt-2 relative px-5 md:px-7 xl:px-10">
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                          }}
                                          transition={{
                                            delay: 0.12,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            duration: 0.4,
                                          }}
                                        >
                                          {/* Left Side Decorative Elements */}
                                          <div className="hidden md:block absolute left-0 bottom-14 w-20 h-px bg-light-mini/20 dark:bg-dark-mini/20" />

                                          {/* Field */}
                                          {edu.field && (
                                            <div className="mb-6">
                                              <div className="font-medium text-sm md:text-base mb-3 md:mb-4 text-light-heading dark:text-dark-heading">
                                                Field
                                              </div>
                                              <div className="font-normal text-sm md:text-base text-light-text dark:text-dark-text">
                                                {edu.field}
                                              </div>
                                            </div>
                                          )}

                                          {/* Key Details Grid */}
                                          <div className="flex flex-col lg:flex-row gap-7 md:gap-8 lg:gap-16 items-start">
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
                                                <div className="font-medium text-sm md:text-base mb-3 md:mb-4 text-light-heading dark:text-dark-heading">
                                                  {label}
                                                </div>

                                                {value ===
                                                edu.institutionUrl ? (
                                                  <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm md:text-base block underline underline-offset-2 decoration-light-mini/30 dark:decoration-dark-mini/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                                  >
                                                    {value}
                                                    <ExternalLinkIcon className="inline w-3 h-3 ml-1" />
                                                  </a>
                                                ) : (
                                                  <div className="font-normal text-sm md:text-base text-light-text dark:text-dark-text">
                                                    {value}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>

                                          {/* Location */}
                                          {edu.location && (
                                            <div className="mt-8">
                                              <div className="font-medium text-sm md:text-base mb-3 md:mb-4 text-light-heading dark:text-dark-heading">
                                                Location
                                              </div>
                                              <div className="font-normal text-sm md:text-base text-light-text dark:text-dark-text">
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
