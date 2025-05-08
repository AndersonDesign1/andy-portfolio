"use client"
import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"

interface SocialLink {
  href: string
  icon: any
  label: string
}

const Footer: React.FC = () => {
  const [showButton, setShowButton] = useState<boolean>(false)

  // Memoize the current year to prevent unnecessary re-renders
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  // Use useCallback for the scrollToTop function
  const scrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Show/hide back-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Memoize social links to prevent unnecessary re-renders
  const socialLinks = useMemo<SocialLink[]>(
    () => [
      {
        href: "https://github.com/AndersonDesign1",
        icon: faGithub,
        label: "Visit Anderson's GitHub profile",
      },
      {
        href: "https://www.linkedin.com/in/anderson-josh/",
        icon: faLinkedin,
        label: "Visit Anderson's LinkedIn profile",
      },
      {
        href: "https://x.com/HeyItsAndersonJ",
        icon: faXTwitter,
        label: "Visit Anderson's X profile",
      },
      {
        href: "https://www.instagram.com/josephandy_official/",
        icon: faInstagram,
        label: "Visit Anderson's Instagram profile",
      },
    ],
    [],
  )

  // Memoize the rendered social links
  const renderedSocialLinks = useMemo(
    () =>
      socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="transition-transform duration-300 hover:scale-110 focus:scale-110 focus:outline-none"
        >
          <FontAwesomeIcon icon={link.icon} className="w-6 h-6 hover:opacity-80 transition-opacity text-white" />
        </a>
      )),
    [socialLinks],
  )

  return (
    <footer className="bg-linear-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#ededed] py-6 text-center relative font-cal">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" aria-hidden="true"></div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto">
        <p className="text-sm mb-2">© {currentYear} Anderson Joseph. All rights reserved.</p>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-6">{renderedSocialLinks}</div>
      </div>

      {/* Back-to-Top Button with animation */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-sm text-[#ededed] px-4 py-2 rounded-full shadow-xs transition-all duration-300 ${
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
        title="Back to top"
      >
        Back to Top
      </button>
    </footer>
  )
}

export default Footer

