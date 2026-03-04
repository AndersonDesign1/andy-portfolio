"use client";

import { Github, Linkedin, Mail } from "lucide-react";

// X (Twitter) logo as inline SVG since lucide doesn't include it
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
    icon: Github,
    href: "https://github.com/AndersonDesign1",
    label: "GitHub",
  },
  {
    icon: XIcon,
    href: "https://x.com/_Andersonjosh",
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
  return (
    <section className="relative flex min-h-[70vh] items-end bg-primary pt-40 pb-20 md:pt-48 md:pb-32">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <div className="flex flex-col gap-8">
          {/* Status Badge */}
          <a
            className="flex items-center gap-2 self-start rounded-full border border-subtle bg-secondary/5 px-4 py-2 font-mono text-secondary text-xs uppercase tracking-widest backdrop-blur-sm transition-colors duration-200 ease-out hover:border-primary hover:bg-secondary/10"
            href="https://welupdigital.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Founding Engineer at{" "}
            <span className="font-bold text-primary">Welup Digital</span>
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
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  aria-label={label}
                  className="text-muted transition-all duration-200 ease-out hover:-translate-y-[3px] hover:text-accent"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
