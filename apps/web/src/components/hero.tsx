"use client";

import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";

// X (Twitter) logo as inline SVG since lucide doesn't include it
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
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
    icon: Github,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: XIcon,
    href: "https://twitter.com/HeyItsAndersonJ",
    label: "X (Twitter)",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/anderson-josh",
    label: "LinkedIn",
  },
  {
    icon: Mail,
    href: "mailto:hello@andersonjoseph.com",
    label: "Email",
  },
];

export default function Hero() {
  const { ref: heroRef } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      className="relative flex min-h-[70vh] items-end bg-primary pt-40 pb-20 md:pt-48 md:pb-32"
      ref={heroRef}
    >
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <motion.div
          animate="visible"
          className="flex flex-col gap-8"
          initial="hidden"
          variants={heroStagger}
        >
          {/* Status Badge */}
          <motion.a
            className="flex items-center gap-2 self-start rounded-full border border-subtle bg-secondary/5 px-4 py-2 font-mono text-secondary text-xs uppercase tracking-widest backdrop-blur-sm transition-colors hover:border-primary hover:bg-secondary/10"
            href="https://welupdigital.com"
            rel="noopener noreferrer"
            target="_blank"
            variants={heroTextVariants}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Founding Engineer at{" "}
            <span className="font-bold text-primary">Welup Digital</span>
          </motion.a>

          {/* Name - Extreme Scale */}
          <motion.h1
            className="-ml-[0.05em] font-bold text-[5rem] text-primary leading-[0.9] tracking-tighter md:text-[8rem] lg:text-[10rem]"
            initial="visible"
            variants={heroTextVariants}
          >
            Andy
            <br />
            Joseph
          </motion.h1>

          <div className="flex flex-col justify-between gap-12 pt-8 md:flex-row md:items-end md:pt-16">
            {/* Bio - Short and impactful */}
            <motion.p
              className="max-w-md text-lg text-secondary leading-relaxed md:text-xl"
              variants={heroTextVariants}
            >
              Building digital products with a focus on growth, interaction, and
              precise engineering.
            </motion.p>

            {/* Social Links - Minimal Row */}
            <motion.div className="flex gap-6" variants={heroTextVariants}>
              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <motion.a
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay:
                        ANIMATION_DELAY_BASE +
                        index * ANIMATION_DELAY_INCREMENT,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  aria-label={label}
                  className="text-muted transition-colors duration-200 hover:text-accent"
                  href={href}
                  initial={{ opacity: 0, scale: 0 }}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  whileHover={{
                    y: -3,
                    transition: { delay: 0, duration: 0.2 },
                  }}
                >
                  <Icon className="size-6" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
