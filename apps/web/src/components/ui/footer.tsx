"use client";

import { motion } from "motion/react";
import { Github, Linkedin } from "lucide-react";
import type React from "react";
import { useMemo } from "react";

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

const socialLinks = [
  {
    href: "https://github.com/AndersonDesign1",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/anderson-josh/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://x.com/HeyItsAndersonJ",
    icon: XIcon,
    label: "X",
  },
];

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative border-subtle border-t bg-primary py-12 md:py-24">
      <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        {/* Copyright - Left aligned on desktop */}
        <p className="order-2 font-mono text-muted text-sm tracking-tight md:order-1">
          © {currentYear} Anderson Joseph
        </p>

        {/* Social links - Right aligned on desktop */}
        <div className="order-1 flex justify-center gap-6 md:order-2">
          {socialLinks.map((link) => (
            <motion.a
              aria-label={link.label}
              className="text-muted transition-colors duration-200 hover:text-accent"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{
                y: -3,
                transition: { duration: 0.2 },
              }}
            >
              <link.icon className="size-4" />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
