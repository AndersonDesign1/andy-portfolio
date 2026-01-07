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
    <footer className="relative border-subtle border-t bg-primary py-12 md:py-24">
      <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
        {/* Copyright - Left aligned on desktop */}
        <p className="order-2 font-mono text-muted text-sm tracking-tight md:order-1">
          © {currentYear} Anderson Joseph
        </p>

        {/* Social links - Right aligned on desktop */}
        <div className="order-1 flex justify-center gap-6 md:order-2">
          {socialLinks.map((link) => (
            <a
              aria-label={link.label}
              className="text-muted transition-colors duration-200 hover:text-primary"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon className="size-4" icon={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
