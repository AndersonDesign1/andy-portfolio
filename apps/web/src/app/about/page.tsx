import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description:
      "Full stack developer with a passion for growth-focused digital products. Experienced in Next.js, React, and SEO optimization.",
    keywords: [
      "Andy",
      "Full Stack Developer",
      "SEO Expert",
      "Software Infrastructure",
      "Web Applications",
      "High Performance",
    ],
    openGraph: {
      title: "About | Andy Joseph",
      description:
        "Full stack developer with a passion for growth-focused digital products. Experienced in Next.js, React, and SEO optimization.",
      url: "https://andersonjoseph.com/about",
      type: "profile",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "About | Andy Joseph",
      description:
        "Full stack developer with a passion for growth-focused digital products. Experienced in Next.js, React, and SEO optimization.",
      images: ["/Andy.webp"],
    },
  };
}

export default function About() {
  return <AboutPage />;
}
