"use client";
import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpotifyNowPlaying from "@/components/spotify-now-playing";
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
      <SpotifyNowPlaying />
    </footer>
  );
};

export default Footer;
