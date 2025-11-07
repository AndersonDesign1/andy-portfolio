"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

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
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-light-mini/10 border-b bg-light-bg/80 py-2 backdrop-blur-md dark:border-dark-mini/10 dark:bg-dark-bg/80"
          : "bg-light-bg/40 py-4 backdrop-blur-xs dark:bg-dark-bg/40"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="z-40 mx-auto flex items-center rounded-full border border-light-mini/20 bg-light-bg/90 px-8 py-2 shadow-md dark:border-mini/20 dark:bg-dark-bg/90">
          <Link className="mr-12" href="/" prefetch>
            {mounted && (
              <Image
                alt="Logo"
                className="object-contain"
                height={20}
                key={logoSrc}
                priority
                src={logoSrc}
                width={50}
              />
            )}
          </Link>
          <ul className="hidden gap-4 md:flex">
            {menuItems.map(({ label, link }) => {
              const isActive = pathname === link;
              return (
                <li key={label}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`after:-bottom-1 relative px-3 py-1 font-medium text-light-heading transition-colors duration-200 after:absolute after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-blue-500 after:transition-transform after:duration-300 after:content-[''] dark:text-dark-heading ${
                      isActive
                        ? "after:scale-x-100"
                        : "after:scale-x-0 hover:after:scale-x-100"
                    }after:origin-left`}
                    href={link}
                    prefetch
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
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="ml-auto text-2xl text-light-heading focus:outline-none md:hidden dark:text-dark-heading"
            onClick={() => setIsOpen((v) => !v)}
            type="button"
          >
            ☰
          </button>
        </div>
      </div>
      <div
        aria-labelledby="menu-button"
        className={`absolute top-full right-0 left-0 z-50 mx-4 mt-2 flex flex-col gap-2 rounded-3xl border border-light-mini/10 bg-light-bg px-6 py-6 text-light-heading shadow-lg backdrop-blur-xs transition-all duration-300 md:hidden dark:border-dark-mini/10 dark:bg-dark-bg dark:text-dark-heading ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        }`}
        id="mobile-menu"
        role="menu"
      >
        {menuItems.map(({ label, link }) => {
          const isActive = pathname === link;
          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`block w-full rounded-xl px-3 py-2 font-medium text-light-heading transition-colors duration-200 dark:text-dark-heading ${isActive ? "bg-blue-900/30" : "hover:bg-blue-900/10"}
              `}
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
    </nav>
  );
}
