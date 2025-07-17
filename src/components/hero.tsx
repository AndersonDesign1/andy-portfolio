"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.25, 0.25, 0, 1] },
  },
};

const Hero: React.FC = () => {
  return (
    <section className="py-20 pt-36 bg-light-bg dark:bg-dark-bg transition-colors duration-300 relative min-h-[60vh] flex items-center">
      <div className="max-w-screen-xl mx-auto px-6 md:px-[150px] w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-left"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-semibold mb-6 text-light-heading dark:text-dark-heading transition-colors duration-300"
            variants={itemVariants}
          >
            Hello 👋, I&apos;m Andy
          </motion.h1>
          <motion.p
            className="text-base leading-relaxed mb-8 text-light-text dark:text-dark-text transition-colors duration-300 max-w-2xl"
            variants={itemVariants}
          >
            Full-stack developer who geeks out over SEO and software
            infrastructure. I&apos;m obsessed with crafting web experiences that
            are lightning-fast, generate revenue and solve problems.
          </motion.p>
          <motion.div className="flex gap-6 mb-8" variants={itemVariants}>
            <Link
              href="/about"
              className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
            >
              About Me ↗
            </Link>
            <Link
              href="/blog"
              className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
            >
              Blog ↗
            </Link>
            <Link
              href="/contact"
              className="text-sm hover:underline text-light-mini dark:text-dark-mini hover:text-light-heading dark:hover:text-dark-heading transition-colors duration-300"
            >
              Contact ↗
            </Link>
          </motion.div>
          <motion.div className="flex gap-4" variants={itemVariants}>
            {socialLinks.map(({ icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-all duration-300 text-light-mini dark:text-dark-mini"
                whileHover={{ y: -2, scale: 1.12 }}
                whileTap={{ scale: 0.96 }}
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
};

export default Hero;
