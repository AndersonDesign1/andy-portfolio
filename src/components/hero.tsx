"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  heroStagger,
  heroTextVariants,
  useScrollAnimation,
} from "@/hooks/use-scroll-animation";
import {
  ANIMATION_DELAY_BASE,
  ANIMATION_DELAY_INCREMENT,
} from "@/lib/constants";

const socialLinks = [
  {
    icon: <FaGithub className="h-5 w-5" />,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: <FaXTwitter className="h-5 w-5" />,
    href: "https://twitter.com/HeyItsAndersonJ",
    label: "Twitter",
  },
  {
    icon: <FaEnvelope className="h-5 w-5" />,
    href: "mailto:hello@andersonjoseph.com",
    label: "Email",
  },
  {
    icon: <FaLinkedin className="h-5 w-5" />,
    href: "https://linkedin.com/in/anderson-josh",
    label: "LinkedIn",
  },
  {
    icon: <FaInstagram className="h-5 w-5" />,
    href: "https://instagram.com/josephandy_official",
    label: "Instagram",
  },
];

const _containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const _itemVariants = {
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
  const { ref: heroRef } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      className="relative flex min-h-[60vh] items-center bg-light-bg py-20 pt-36 transition-colors duration-300 dark:bg-dark-bg"
      ref={heroRef}
    >
      <div className="mx-auto w-full max-w-screen-xl px-6 md:px-[150px]">
        <motion.div
          animate="visible"
          className="text-left"
          initial="hidden"
          variants={heroStagger}
        >
          <motion.h1
            className="mb-6 font-semibold text-3xl text-light-heading md:text-4xl dark:text-dark-heading"
            variants={heroTextVariants}
            whileHover={{
              scale: 1.02,
              x: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            Hello 👋, I&apos;m Andy
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl text-base text-light-text leading-relaxed dark:text-dark-text"
            variants={heroTextVariants}
            whileHover={{
              x: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            Full-stack developer who geeks out over SEO and software
            infrastructure. I&apos;m obsessed with crafting web experiences that
            are lightning-fast, generate revenue and solve problems.
          </motion.p>

          <motion.div className="mb-8 flex gap-6" variants={heroTextVariants}>
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                className="text-light-mini text-sm transition-colors duration-300 hover:text-light-heading hover:underline dark:text-dark-mini dark:hover:text-dark-heading"
                href="/about"
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
                className="text-light-mini text-sm transition-colors duration-300 hover:text-light-heading hover:underline dark:text-dark-mini dark:hover:text-dark-heading"
                href="/blog"
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
                className="text-light-mini text-sm transition-colors duration-300 hover:text-light-heading hover:underline dark:text-dark-mini dark:hover:text-dark-heading"
                href="/contact"
              >
                Contact ↗
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="flex gap-4" variants={heroTextVariants}>
            {socialLinks.map(({ icon, href, label }, index) => (
              <motion.a
                animate={{ opacity: 1, scale: 1 }}
                aria-label={label}
                className="rounded-full p-3 text-light-mini hover:bg-light-mini/10 dark:text-dark-mini dark:hover:bg-dark-mini/10"
                href={href}
                initial={{ opacity: 0, scale: 0 }}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
                transition={{
                  delay:
                    ANIMATION_DELAY_BASE + index * ANIMATION_DELAY_INCREMENT,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
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
