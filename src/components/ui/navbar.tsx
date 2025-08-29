"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Portfolio", link: "/projects" },
  { label: "Blog", link: "/blog" },
  { label: "Contact", link: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const logoSrc = resolvedTheme === "dark" ? "/logo-white.png" : "/logo-black.png";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md py-2 border-b border-light-mini/10 dark:border-dark-mini/10"
          : "bg-light-bg/40 dark:bg-dark-bg/40 backdrop-blur-xs py-4"
      }`}
    >
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        <div className="bg-light-bg/90 dark:bg-dark-bg/90 rounded-full px-8 py-2 shadow-md flex items-center mx-auto z-40 border border-light-mini/20 dark:border-mini/20">
          <Link href="/" className="mr-12" prefetch>
            {mounted && (
              <Image
                key={logoSrc}
                src={logoSrc}
                alt="Logo"
                width={50}
                height={20}
                className="object-contain"
                priority
              />
            )}
          </Link>
          <ul className="hidden md:flex gap-4">
            {menuItems.map(({ label, link }) => {
              const isActive = pathname === link;
              return (
                <li key={label}>
                  <Link
                    href={link}
                    prefetch
                    className={`relative px-3 py-1 font-medium text-light-heading dark:text-dark-heading transition-colors duration-200
                      after:content-[''] after:absolute after:w-full after:h-[2px] after:left-0 after:-bottom-1 after:rounded-full
                      after:transition-transform after:duration-300 after:bg-blue-500
                      ${
                        isActive
                          ? "after:scale-x-100"
                          : "after:scale-x-0 hover:after:scale-x-100"
                      }
                      after:origin-left`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-6">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden text-light-heading dark:text-dark-heading text-2xl focus:outline-none ml-auto"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            type="button"
          >
            ☰
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 mx-4 mt-2 bg-light-bg dark:bg-dark-bg text-light-heading dark:text-dark-heading flex flex-col gap-2 py-6 px-6 z-50 shadow-lg md:hidden rounded-3xl border border-light-mini/10 dark:border-dark-mini/10 backdrop-blur-xs transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        role="menu"
        aria-labelledby="menu-button"
      >
        {menuItems.map(({ label, link }) => {
          const isActive = pathname === link;
          return (
            <Link
              key={label}
              href={link}
              prefetch
              className={`block w-full px-3 py-2 rounded-xl font-medium text-light-heading dark:text-dark-heading transition-colors duration-200
                ${isActive ? "bg-blue-900/30" : "hover:bg-blue-900/10"}
              `}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
