"use client";

import { motion } from "motion/react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
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
    icon: FaGithub,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: FaXTwitter,
    href: "https://twitter.com/HeyItsAndersonJ",
    label: "Twitter",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/in/anderson-josh",
    label: "LinkedIn",
  },
  {
    icon: FaEnvelope,
    href: "mailto:hello@andersonjoseph.com",
    label: "Email",
  },
];

export default function Hero() {
  const { ref: heroRef } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      className="relative flex min-h-[90vh] items-end bg-primary pt-40 pb-32 md:pt-56 md:pb-48"
      ref={heroRef}
    >
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <motion.div
          animate="visible"
          className="flex flex-col gap-8"
          initial="hidden"
          variants={heroStagger}
        >
          {/* Name - Extreme Scale */}
          <motion.h1
            className="-ml-[0.05em] font-bold text-[5rem] text-primary leading-[0.9] tracking-tighter md:text-[8rem] lg:text-[10rem]"
            variants={heroTextVariants}
          >
            Andy
            <br />
            Joseph
          </motion.h1>

          <div className="mt-8 flex flex-col justify-between gap-12 md:mt-16 md:flex-row md:items-end">
            {/* Bio - Short and impactful */}
            <motion.p
              className="max-w-md text-lg text-secondary leading-relaxed md:text-xl"
              variants={heroTextVariants}
            >
              Building digital products with a focus on motion, interaction, and
              precise engineering.
            </motion.p>

            {/* Social Links - Minimal Row */}
            <motion.div className="flex gap-6" variants={heroTextVariants}>
              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <motion.a
                  animate={{ opacity: 1, scale: 1 }}
                  aria-label={label}
                  className="text-muted transition-colors duration-200 hover:text-primary"
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
