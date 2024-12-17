"use client";
import { useState } from "react";

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Services", link: "/services" },
  { label: "Portfolio", link: "/portfolio" },
  { label: "Contact", link: "/contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative py-4 z-50">
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        {/* Menu Container with Rounded Edges */}
        <div className="bg-zinc-950/90 rounded-full px-8 py-2 shadow-md flex items-center mx-auto z-40">
          {/* Logo */}
          <div className="text-2xl font-bold text-white mr-24">Logo</div>

          {/* Navigation Links */}
          <ul className="hidden md:flex gap-6">
            {menuItems.map(({ label, link }) => (
              <li key={label}>
                <a
                  href={link}
                  className="text-white hover:text-yellow-400 transition duration-300"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-zinc-950/90 text-white flex flex-col gap-4 py-6 px-6 z-50 shadow-lg md:hidden rounded-3xl backdrop-blur-sm">
          {menuItems.map(({ label, link }) => (
            <a
              key={label}
              href={link}
              className="hover:text-yellow-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
