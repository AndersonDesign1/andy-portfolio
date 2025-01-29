import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import "@/animations.css";

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["Courier New", "monospace"],
});

export const metadata = {
  title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
  description: "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
  url: "https://andersonjoseph.com",
  content: "Anderson Joseph | Web Developer, Web Performance, SEO Specialist and No-code Developer.",
  keywords: "Anderson Joseph, Web Developer, SEO Specialist, Web Performance, No-code Developer,",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}