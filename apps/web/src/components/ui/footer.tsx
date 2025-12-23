"use client";

import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { useMemo } from "react";

const socialLinks = [
  {
    href: "https://github.com/AndersonDesign1",
    icon: faGithub,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/anderson-josh/",
    icon: faLinkedin,
    label: "LinkedIn",
  },
  {
    href: "https://x.com/HeyItsAndersonJ",
    icon: faXTwitter,
    label: "X",
  },
];

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative border-t border-subtle py-12 md:py-24 bg-primary">
      <div className="mx-auto max-w-screen-lg px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright - Left aligned on desktop */}
        <p className="text-muted text-sm font-mono tracking-tight order-2 md:order-1">
          © {currentYear} Anderson Joseph
        </p>

        {/* Social links - Right aligned on desktop */}
        <div className="flex justify-center gap-6 order-1 md:order-2">
          {socialLinks.map((link) => (
            <a
              aria-label={link.label}
              className="text-muted hover:text-primary transition-colors duration-200"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon className="h-4 w-4" icon={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
