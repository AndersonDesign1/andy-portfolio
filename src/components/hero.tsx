"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { FaGithub, FaEnvelope, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
  {
    icon: <FaGithub className="w-5 h-5" />,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: <FaXTwitter className="w-5 h-5" />,
    href: "https://twitter.com/HeyItsAndersonJ",
    label: "Twitter",
  },
  {
    icon: <FaEnvelope className="w-5 h-5" />,
    href: "mailto:hello@andersonjoseph.com",
    label: "Email",
  },
  {
    icon: <FaLinkedin className="w-5 h-5" />,
    href: "https://linkedin.com/in/anderson-josh",
    label: "LinkedIn",
  },
  {
    icon: <FaInstagram className="w-5 h-5" />,
    href: "https://instagram.com/josephandy_official",
    label: "Instagram",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const linkVariants = {
  hover: {
    x: 8,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const socialIconVariants = {
  hover: {
    y: -8,
    rotate: [0, -10, 10, 0],
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function Hero() {
  return (
    <section className="py-20 pt-36 bg-light-bg dark:bg-dark-bg transition-colors duration-300 relative min-h-[60vh] flex items-center">
      <div className="max-w-screen-xl mx-auto px-6 md:px-[150px] w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left"
        >
          <motion.h1
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              x: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="text-3xl md:text-4xl font-semibold mb-6 text-light-heading dark:text-dark-heading"
          >
            Hello 👋, I&apos;m Andy
          </motion.h1>

          <motion.p
            variants={itemVariants}
            whileHover={{
              x: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="text-base leading-relaxed mb-8 text-light-text dark:text-dark-text max-w-2xl"
          >
            Full-stack developer who geeks out over SEO and software
            infrastructure. I&apos;m obsessed with crafting web experiences that
            are lightning-fast, generate revenue and solve problems.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-6 mb-8">
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/about"
                className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
              >
                About Me ↗
              </Link>
            </motion.div>

            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/blog"
                className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
              >
                Blog ↗
              </Link>
            </motion.div>

            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/contact"
                className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
              >
                Contact ↗
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            {socialLinks.map(({ icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="text-light-mini dark:text-dark-mini p-3 rounded-full hover:bg-light-mini/10 dark:hover:bg-dark-mini/10"
                aria-label={label}
              >
                {icon}
                <span className="sr-only">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
