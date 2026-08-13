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
    customIcon: XIcon,
    href: "https://x.com/_Andersonjosh",
    icon: null,
    label: "X (Twitter)",
  },
  {
    href: "https://linkedin.com/in/anderson-josh",
    icon: Linkedin02Icon,
    label: "LinkedIn",
  },
  {
    href: "mailto:contact@andersonjoseph.com",
    icon: Mail01Icon,
    label: "Email",
  },
];

const Hero = () => (
  <section className="bg-primary relative flex min-h-[70vh] items-end pt-40 pb-20 md:pt-48 md:pb-32">
    <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
      <div className="flex flex-col gap-8">
        {/* Role */}
        <a
          className="text-secondary hover:text-primary flex items-center gap-2.5 self-start font-mono text-xs tracking-widest uppercase transition-colors duration-200 ease-out"
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
        <h1 className="hero-title text-primary -ml-[0.05em] text-[5rem] leading-[0.9] font-bold tracking-tighter md:text-[8rem] lg:text-[10rem]">
          Anderson
          <br />
          Joseph
        </h1>

        <div className="flex flex-col justify-between gap-12 pt-8 md:flex-row md:items-end md:pt-16">
          {/* Bio - Short and impactful */}
          <p className="hero-subtitle text-secondary max-w-md text-lg leading-relaxed md:text-xl">
            Building digital products with a focus on growth, interaction, and
            precise engineering.
          </p>

          {/* Social Links - Minimal Row */}
          <div className="flex gap-6">
            {socialLinks.map(
              ({ icon, customIcon: CustomIcon, href, label }) => (
                <a
                  aria-label={label}
                  className="text-muted hover:text-accent transition-[color,transform] duration-200 ease-out hover:-translate-y-[3px] motion-reduce:hover:translate-y-0"
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

export default Hero;
