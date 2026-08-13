"use client";

import { GithubIcon, Linkedin02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";

const CURRENT_YEAR = new Date().getFullYear();

// X (Twitter) logo as inline SVG since hugeicons doesn't include it
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>X (Twitter)</title>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    href: "https://github.com/AndersonDesign1",
    icon: GithubIcon,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/anderson-josh/",
    icon: Linkedin02Icon,
    label: "LinkedIn",
  },
  {
    customIcon: XIcon,
    href: "https://x.com/_Andersonjosh",
    icon: null,
    label: "X",
  },
];

const Footer: React.FC = () => (
  <footer className="border-subtle bg-primary relative border-t py-12 md:py-24">
    <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-12">
      {/* Copyright - Left aligned on desktop */}
      <p
        className="text-muted order-2 font-mono text-sm tracking-tight md:order-1"
        suppressHydrationWarning
      >
        © {CURRENT_YEAR} Anderson Joseph
      </p>

      {/* Social links - Right aligned on desktop */}
      <div className="order-1 flex justify-center gap-6 md:order-2">
        {socialLinks.map((link) => (
          <a
            aria-label={link.label}
            className="text-muted hover:text-accent focus-visible:ring-foreground focus-visible:ring-offset-background flex size-11 touch-manipulation items-center justify-center rounded-sm transition-transform duration-200 ease-out hover:-translate-y-[3px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:hover:translate-y-0 md:size-6"
            href={link.href}
            key={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {(() => {
              const CustomIcon = link.customIcon;
              if (link.icon) {
                return (
                  <HugeiconsIcon
                    color="currentColor"
                    icon={link.icon}
                    size={16}
                    strokeWidth={1.5}
                  />
                );
              }
              if (CustomIcon) {
                return <CustomIcon className="size-4" />;
              }
              return null;
            })()}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
