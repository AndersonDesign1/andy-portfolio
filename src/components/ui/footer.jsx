'use client';

import React from 'react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#ededed] py-6 text-center relative font-cal">
            {/* Subtle Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            {/* Footer Content */}
            <div className="relative z-10 container mx-auto">
                <p className="text-sm mb-2">
                    © {new Date().getFullYear()} Anderson Joseph. All rights reserved.
                </p>

                {/* Social Media Links */}
                <div className="flex justify-center space-x-6 mb-6">
                    <a href="https://github.com/AndersonDesign1" target="_blank" rel="noopener noreferrer">
                        <img src="/github.svg" alt="GitHub" className="w-6 h-6 hover:opacity-80 transition-opacity invert" />
                    </a>
                    <a href="https://www.linkedin.com/in/anderson-josh/" target="_blank" rel="noopener noreferrer">
                        <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6 hover:opacity-80 transition-opacity" />
                    </a>
                    <a href="https://x.com/WebDev_Anderson" target="_blank" rel="noopener noreferrer">
                        <img src="/x.svg" alt="Twitter" className="w-6 h-6 hover:opacity-80 transition-opacity" />
                    </a>
                    <a href="https://www.instagram.com/josephandy_official/" target="_blank" rel="noopener noreferrer">
                        <img src="/instagram.svg" alt="Instagram" className="w-6 h-6 hover:opacity-80 transition-opacity" />
                    </a>

                </div>                {/* Back-to-Top Button */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-sm text-[#ededed] px-4 py-2 rounded-full shadow-sm transition-all"
                >
                    Back to Top
                </button>
            </div>
        </footer>
    );
};

export default Footer;