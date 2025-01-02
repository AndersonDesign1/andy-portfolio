"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { label: 'Home', link: '/' },
  { label: 'About', link: '/about' },
  { label: 'Projects', link: '/projects' },
  { label: 'Contact', link: '/contact' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 py-4 z-50 bg-black/10 backdrop-blur-sm">
      <div className="flex justify-center items-center max-w-6xl mx-auto">
        <div className="bg-zinc-950 rounded-full px-8 py-2 shadow-md flex items-center mx-auto z-40 border border-white/20">
          <Link href="/" className="text-2xl font-bold text-white mr-24">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={30}
              className="object-contain"
              priority
            />
          </Link>

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
        </div>
      </div>
    </nav>
  );
}