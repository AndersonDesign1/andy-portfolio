"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

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

  useEffect(() => setIsOpen(false), []);

  const logoSrc =
    resolvedTheme === "dark" ? "/logo-white.png" : "/logo-black.png";

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-subtle border-b bg-primary/95 py-4 backdrop-blur-sm"
          : "bg-transparent py-6 md:py-8"
      }`}
    >
      <div className="relative z-50 mx-auto flex max-w-screen-lg items-center justify-between px-6 md:px-12">
        {/* Logo - Aligned left */}
        <Link className="shrink-0" href="/" prefetch>
          {mounted && (
            <Image
              alt="Logo"
              className="object-contain"
              height={40}
              key={logoSrc}
              priority
              src={logoSrc}
              width={90}
            />
          )}
        </Link>

        {/* Desktop Menu - Centered or offset right */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex gap-6">
            {menuItems.map(({ label, link }) => {
              const isActive = pathname === link;
              return (
                <li key={label}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`relative font-medium text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted hover:text-primary"
                    }`}
                    href={link}
                    prefetch
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4 border-subtle border-l pl-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="text-primary text-xl focus:outline-none"
            onClick={() => setIsOpen((v) => !v)}
            size="icon"
            variant="ghost"
          >
            {isOpen ? "✕" : "☰"}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        aria-labelledby="menu-button"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-[10px] transition-all duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        id="mobile-menu"
        role="menu"
      >
        <div className="flex flex-col items-center gap-8">
          {menuItems.map(({ label, link }) => {
            const isActive = pathname === link;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`font-medium text-2xl transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted hover:text-primary"
                }`}
                href={link}
                key={label}
                onClick={() => setIsOpen(false)}
                prefetch
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
