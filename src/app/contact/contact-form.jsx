'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FaLinkedin, FaEnvelope, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    
    try {
      const response = await sendEmail(formData);
      setFormStatus(response);
      
      if (response.success) {
        event.target.reset();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({ 
        success: false, 
        message: 'Failed to send email. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full min-h-screen bg-black text-white relative overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold mb-8 font-poppins">Let's Connect</h1>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="backdrop-blur-md bg-black/30 p-8 rounded-xl border border-white/10 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 font-poppins">Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium mb-2 font-outfit">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent font-outfit"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2 font-outfit">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent font-outfit"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2 font-outfit">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent font-outfit"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition duration-300 font-outfit border border-white/10"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {formStatus && (
              <div className={`mt-4 p-2 rounded ${formStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
                {formStatus.message}
              </div>
            )}
          </div>
          <div className="backdrop-blur-md bg-black/30 p-8 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-6 font-poppins">Connect with Me</h2>
            <div className="space-y-6">
              <SocialLink
                href="mailto:hello@andersonjoseph.com"
                icon={<FaEnvelope className="w-6 h-6" />}
                platform="Email"
                username="hello@andersonjoseph.com"
              />
              <SocialLink
                href="https://www.linkedin.com/in/anderson-josh/"
                icon={<FaLinkedin className="w-6 h-6" />}
                platform="LinkedIn"
                username="Anderson Joseph"
              />
              <SocialLink
                href="https://github.com/AndersonDesign1"
                icon={<FaGithub className="w-6 h-6" />}
                platform="GitHub"
                username="AndersonDesign1"
              />
              <SocialLink
                href="https://x.com/WebDev_Anderson"
                icon={<FaTwitter className="w-6 h-6" />}
                platform="Twitter"
                username="WebDev_Anderson"
              />
              <SocialLink
                href="https://www.instagram.com/josephandy_official/"
                icon={<FaInstagram className="w-6 h-6" />}
                platform="Instagram"
                username="josephandy_official"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, platform, username }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white transition duration-300 font-outfit border border-white/5 hover:border-white/20"
    >
      {icon}
      <span>{platform}: @{username}</span>
    </Link>
  );
}