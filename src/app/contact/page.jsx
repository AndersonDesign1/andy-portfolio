import Link from 'next/link';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-poppins">Let's Connect</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 font-poppins">Send a Message</h2>
            <form action="https://formspree.io/f/your-form-id" method="POST">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1 font-outfit">Name</label>
                <input type="text" id="name" name="name" required className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-outfit" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1 font-outfit">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-outfit" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-1 font-outfit">Message</label>
                <textarea id="message" name="message" rows="4" required className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-outfit"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-black text-white font-bold py-2 px-4 rounded-md transition duration-300 font-outfit">Send Message</button>
            </form>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-poppins">Connect with Me</h2>
            <div className="space-y-4">
              <SocialLink href="https://linkedin.com/in/yourusername" icon={<FaLinkedin className="w-6 h-6" />} platform="LinkedIn" username="yourusername" />
              <SocialLink href="https://github.com/yourusername" icon={<FaGithub className="w-6 h-6" />} platform="GitHub" username="yourusername" />
              <SocialLink href="https://twitter.com/yourusername" icon={<FaTwitter className="w-6 h-6" />} platform="Twitter" username="yourusername" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, platform, username }) {
  return (
    <Link href={href} className="flex items-center space-x-3 text-gray-300 hover:text-white transition duration-300 font-outfit">
      {icon}
      <span>{platform}: @{username}</span>
    </Link>
  );
}