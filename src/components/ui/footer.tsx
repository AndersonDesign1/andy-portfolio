"use client";
import {
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import SpotifyNowPlaying from "@/components/spotify-now-playing";

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
  const [_showButton, setShowButton] = useState(false);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const _scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="relative border-light-mini/20 border-t bg-light-bg py-6 text-center text-light-mini dark:border-dark-mini/20 dark:bg-dark-bg dark:text-dark-mini">
      <div className="container mx-auto">
        <p className="mb-2 text-xs">
          © {currentYear} Anderson Joseph. All rights reserved.
        </p>
        <div className="mb-2 flex justify-center gap-5">
          {socialLinks.map((link) => (
            <a
              aria-label={link.label}
              className="transition-colors hover:text-blue-500"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon className="h-5 w-5" icon={link.icon} />
            </a>
          ))}
        </div>
      </div>
      <SpotifyNowPlaying />
    </footer>
  );
};

export default Footer;
