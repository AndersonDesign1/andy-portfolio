"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuItem {
  label: string
  link: string
}

const menuItems: MenuItem[] = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Portfolio", link: "/projects" },
  { label: "Blog", link: "/blog" },
  { label: "Contact", link: "/contact" },
]

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Memoized toggle function
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Memoized menu items to prevent unnecessary re-renders
  const renderedMenuItems = useMemo(
    () =>
      menuItems.map(({ label, link }) => {
        const isActive = pathname === link

        return (
          <li key={label}>
            <Link
              href={link}
              prefetch={true}
              className={`text-white hover:text-white relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:left-0 after:-bottom-1 after:rounded-full ${
                isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              } after:transition-transform after:duration-300 ease-out`}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        )
      }),
    [pathname],
  )

  // Memoized mobile menu items
  const renderedMobileMenuItems = useMemo(
    () =>
      menuItems.map(({ label, link }) => {
        const isActive = pathname === link

        return (
          <Link
            key={label}
            href={link}
            prefetch={true}
            className={`text-white hover:text-white relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:left-0 after:-bottom-1 after:rounded-full ${
              isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
            } after:transition-transform after:duration-300 ease-out`}
            onClick={() => setIsOpen(false)}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        )
      }),
    [pathname],
  )

  return (
    <nav
      className={`fixed top-0 left-0 right-0 py-4 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-black/10 backdrop-blur-xs py-4"
      }`}
    >
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        {/* Menu Container with Rounded Edges */}
        <div className="bg-zinc-950 rounded-full px-8 py-2 shadow-md flex items-center mx-auto z-40 border border-white/20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white mr-12" prefetch={true}>
            <Image src="/logo.png" alt="Logo" width={50} height={20} className="object-contain" priority />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex gap-4">{renderedMenuItems}</ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white text-2xl focus:outline-hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 mx-4 mt-2 bg-zinc-950 text-white flex flex-col gap-4 py-6 px-6 z-50 shadow-lg md:hidden rounded-3xl border border-white/10 backdrop-blur-xs transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        role="menu"
        aria-labelledby="menu-button"
      >
        {renderedMobileMenuItems}
      </div>
    </nav>
  )
}

export default Navbar

