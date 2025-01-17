"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { label: 'Home', link: '/' },
  { label: 'About', link: '/about' },
  { label: 'Projects', link: '/projects' },
  { label: 'Blog', link: '/blog' },
  { label: 'Contact', link: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 py-4 z-50 bg-black/10 backdrop-blur-sm">
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        <div className="bg-zinc-950 rounded-full px-8 py-2 shadow-md flex items-center justify-between mx-auto z-40 border border-white/20 w-[90%] relative">
          <Link href="/" className="text-2xl font-bold text-white">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={20}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6">
            {menuItems.map(({ label, link }) => (
              <li key={label}>
                <Link
                  href={link}
                  className="text-white hover:text-yellow-400 transition duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[90%] mt-2 md:hidden">
            <ul className="bg-zinc-950 rounded-2xl shadow-lg border border-white/20 py-4 px-6">
              {menuItems.map(({ label, link }) => (
                <li key={label} className="py-2">
                  <Link
                    href={link}
                    className="text-white hover:text-yellow-400 transition duration-300 block"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}