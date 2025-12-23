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
      className="relative flex min-h-[90vh] items-end pb-32 md:pb-48 pt-40 md:pt-56 bg-primary"
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
            className="text-primary text-[5rem] leading-[0.9] font-bold tracking-tighter md:text-[8rem] lg:text-[10rem] -ml-[0.05em]"
            variants={heroTextVariants}
          >
            Andy
            <br />
            Joseph
          </motion.h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mt-8 md:mt-16">
             {/* Bio - Short and impactful */}
             <motion.p
              className="text-secondary max-w-md text-lg leading-relaxed md:text-xl"
              variants={heroTextVariants}
            >
              Building digital products with a focus on motion, interaction, and precise engineering.
            </motion.p>

            {/* Social Links - Minimal Row */}
            <motion.div className="flex gap-6" variants={heroTextVariants}>
              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <motion.a
                  animate={{ opacity: 1, scale: 1 }}
                  aria-label={label}
                  className="text-muted hover:text-primary transition-colors duration-200"
                  href={href}
                  initial={{ opacity: 0, scale: 0 }}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  transition={{
                    delay: ANIMATION_DELAY_BASE + index * ANIMATION_DELAY_INCREMENT,
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
