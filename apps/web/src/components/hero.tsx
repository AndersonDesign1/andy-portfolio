"use client";

import {
  GithubIcon,
  Linkedin02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// X (Twitter) logo as inline SVG since hugeicons doesn't include it
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>X (Twitter)</title>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    icon: GithubIcon,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: null,
    customIcon: XIcon,
    href: "https://x.com/_Andersonjosh",
    label: "X (Twitter)",
  },
  {
    icon: Linkedin02Icon,
    href: "https://linkedin.com/in/anderson-josh",
    label: "LinkedIn",
  },
  {
    icon: Mail01Icon,
    href: "mailto:hello@andersonjoseph.com",
    label: "Email",
  },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-end bg-primary pt-40 pb-20 md:pt-48 md:pb-32">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <div className="flex flex-col gap-8">
          {/* Role */}
          <a
            className="flex items-center gap-2.5 self-start font-mono text-secondary text-xs uppercase tracking-widest transition-colors duration-200 ease-out hover:text-primary"
            href="https://welupdigital.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Founding Engineer at{" "}
            <span className="font-semibold">Welup Digital</span>
          </a>

          {/* Name - Extreme Scale */}
          <h1 className="hero-title -ml-[0.05em] font-bold text-[5rem] text-primary leading-[0.9] tracking-tighter md:text-[8rem] lg:text-[10rem]">
            Anderson
            <br />
            Joseph
          </h1>

          <div className="flex flex-col justify-between gap-12 pt-8 md:flex-row md:items-end md:pt-16">
            {/* Bio - Short and impactful */}
            <p className="hero-subtitle max-w-md text-lg text-secondary leading-relaxed md:text-xl">
              Building digital products with a focus on growth, interaction, and
              precise engineering.
            </p>

            {/* Social Links - Minimal Row */}
            <div className="flex gap-6">
              {socialLinks.map(
                ({ icon, customIcon: CustomIcon, href, label }) => (
                  <a
                    aria-label={label}
                    className="text-muted transition-all duration-200 ease-out hover:-translate-y-[3px] hover:text-accent"
                    href={href}
                    key={label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {(() => {
                      if (icon) {
                        return (
                          <HugeiconsIcon
                            color="currentColor"
                            icon={icon}
                            size={24}
                            strokeWidth={1.5}
                          />
                        );
                      }
                      if (CustomIcon) {
                        return <CustomIcon className="size-6" />;
                      }
                      return null;
                    })()}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
