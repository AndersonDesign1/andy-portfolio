"use client";

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils";

function usePathname() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.pathname;
}

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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = debounce(() => {
      setScrolled(window.scrollY > 20);
    }, 10);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-subtle border-b bg-primary/95 py-6 backdrop-blur-sm"
            : "py-6"
        }`}
      >
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <a className="shrink-0" href="/">
            <img
              alt="Logo"
              className="object-contain dark:hidden"
              height={40}
              src="/logo-black.png"
              width={90}
            />
            <img
              alt="Logo"
              className="hidden object-contain dark:block"
              height={40}
              src="/logo-white.png"
              width={90}
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex gap-6">
              {menuItems.map(({ label, link }) => {
                const isActive = pathname === link;
                return (
                  <li key={label}>
                    <a
                      aria-current={isActive ? "page" : undefined}
                      className={`font-medium text-sm transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-muted hover:text-accent"
                      }`}
                      href={link}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>

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
              onClick={() => setIsOpen(true)}
              size="icon"
              variant="ghost"
            >
              <HugeiconsIcon
                color="currentColor"
                icon={Menu01Icon}
                size={24}
                strokeWidth={1.5}
              />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with smooth animation */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex flex-col bg-background md:hidden"
            exit={{ opacity: 0 }}
            id="mobile-menu"
            initial={{ opacity: 0 }}
            role="menu"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Close button at top right */}
            <div className="flex items-center justify-end px-6 py-6">
              <Button
                aria-label="Close menu"
                className="text-primary"
                onClick={() => setIsOpen(false)}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon
                  color="currentColor"
                  icon={Cancel01Icon}
                  size={24}
                  strokeWidth={1.5}
                />
              </Button>
            </div>

            {/* Menu items centered with staggered animation */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {menuItems.map(({ label, link }, index) => {
                const isActive = pathname === link;
                return (
                  <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    key={label}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <a
                      aria-current={isActive ? "page" : undefined}
                      className={`font-medium text-2xl transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-muted hover:text-primary"
                      }`}
                      href={link}
                      onClick={() => setIsOpen(false)}
                    >
                      {label}
                    </a>
                  </m.div>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
