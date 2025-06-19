"use client";
import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

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
  {
    href: "https://www.instagram.com/josephandy_official/",
    icon: faInstagram,
    label: "Instagram",
  },
];

const Footer: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-light-bg dark:bg-dark-bg text-light-mini dark:text-dark-mini py-6 text-center relative border-t border-light-mini/20 dark:border-dark-mini/20">
      <div className="container mx-auto">
        <p className="text-xs mb-2">
          © {currentYear} Anderson Joseph. All rights reserved.
        </p>
        <div className="flex justify-center gap-5 mb-2">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50
          bg-light-bg text-dark-bg border border-light-mini/30
          dark:bg-dark-bg dark:text-light-bg dark:border-dark-mini/30
          px-4 py-2 rounded-full shadow transition-all duration-300
          hover:bg-light-mini hover:text-dark-bg hover:border-light-mini/60
          dark:hover:bg-dark-mini dark:hover:text-light-bg dark:hover:border-dark-mini/60
          ${
            showButton
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        aria-label="Back to top"
        title="Back to top"
      >
        Back to Top
      </button>
    </footer>
  );
};

export default Footer;
