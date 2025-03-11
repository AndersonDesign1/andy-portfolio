'use client';
  import React from 'react';
  import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

  const Footer = () => {
      const scrollToTop = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      return (
          <footer className="bg-linear-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-[#ededed] py-6 text-center relative font-cal">
              {/* Subtle Pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

              {/* Footer Content */}
              <div className="relative z-10 container mx-auto">
                  <p className="text-sm mb-2">
                      © {new Date().getFullYear()} Anderson Joseph. All rights reserved.
                  </p>

                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-6 mb-6">
                      <a href="https://github.com/AndersonDesign1" target="_blank" rel="noopener noreferrer" aria-label="Visit Anderson's GitHub profile">
                          <FaGithub className="w-6 h-6 hover:opacity-80 transition-opacity text-white" />
                      </a>
                      <a href="https://www.linkedin.com/in/anderson-josh/" target="_blank" rel="noopener noreferrer" aria-label="Visit Anderson's LinkedIn profile">
                          <FaLinkedin className="w-6 h-6 hover:opacity-80 transition-opacity text-white" />
                      </a>
                      <a href="https://x.com/WebDev_Anderson" target="_blank" rel="noopener noreferrer" aria-label="Visit Anderson's Twitter profile">
                          <FaTwitter className="w-6 h-6 hover:opacity-80 transition-opacity text-white" />
                      </a>
                      <a href="https://www.instagram.com/josephandy_official/" target="_blank" rel="noopener noreferrer" aria-label="Visit Anderson's Instagram profile">
                          <FaInstagram className="w-6 h-6 hover:opacity-80 transition-opacity text-white" />
                      </a>
                  </div>              </div>
              {/* Back-to-Top Button */}
              <button
                  onClick={scrollToTop}
                  className="fixed bottom-8 right-8 z-50 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-sm text-[#ededed] px-4 py-2 rounded-full shadow-xs transition-all"
              >
                  Back to Top
              </button>
          </footer>
      );
  };

export default Footer;