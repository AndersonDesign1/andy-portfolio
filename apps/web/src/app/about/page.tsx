import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About - Andy | Full Stack Developer & SEO Expert",
    description:
      "Learn about my journey as a full-stack developer with expertise in SEO optimization, software infrastructure, and creating high-performance web applications.",
    keywords: [
      "Andy",
      "Full Stack Developer",
      "SEO Expert",
      "Software Infrastructure",
      "Web Applications",
      "High Performance",
    ],
    openGraph: {
      title: "About - Andy | Full Stack Developer & SEO Expert",
      description:
        "Learn about my journey as a full-stack developer with expertise in SEO optimization, software infrastructure, and creating high-performance web applications.",
      url: "https://andersonjoseph.com/about",
      type: "profile",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "About - Andy | Full Stack Developer & SEO Expert",
      description:
        "Learn about my journey as a full-stack developer with expertise in SEO optimization, software infrastructure, and creating high-performance web applications.",
      images: ["/Andy.webp"],
    },
  };
}

export default function About() {
  return <AboutPage />;
}
