"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Portfolio", link: "/projects" },
  { label: "Blog", link: "/blog" },
  { label: "Contact", link: "/contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 py-4 z-50 bg-black/10 backdrop-blur-xs">
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        {/* Menu Container with Rounded Edges */}
        <div className="bg-zinc-950 rounded-full px-8 py-2 shadow-md flex items-center mx-auto z-40 border border-white/20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white mr-12">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={20}
              className="object-contain"
              priority
            />
          </Link>
          {/* Navigation Links */}
          <ul className="hidden md:flex gap-4">
            {menuItems.map(({ label, link }) => (
              <li key={label}>
                <a
                  href={link}
                  className="text-white hover:text-white relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ease-out"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl focus:outline-hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-zinc-950 text-white flex flex-col gap-4 py-6 px-6 z-50 shadow-lg md:hidden rounded-3xl border border-white/10 backdrop-blur-xs">
          {menuItems.map(({ label, link }) => (
            <a
              key={label}
              href={link}
              className="text-white hover:text-white relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:left-0 after:-bottom-1 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 ease-out"
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