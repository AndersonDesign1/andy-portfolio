import ProjectsShowcase from "@/components/projects-showcase";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects - Andy | Full Stack Developer & SEO Expert",
    description:
      "Explore my portfolio of web development projects, SEO campaigns, and design work. From e-commerce platforms to analytics dashboards, see how I create solutions that drive results.",
    keywords: [
      "Andy",
      "Anderson Joseph",
      "Web Development Projects",
      "SEO Campaigns",
      "Portfolio",
      "E-commerce",
      "Analytics Dashboards",
      "Design Work",
      "Full Stack Developer",
      "SEO Expert",
    ],
    openGraph: {
      title: "Projects - Andy | Full Stack Developer & SEO Expert",
      description:
        "Explore my portfolio of web development projects, SEO campaigns, and design work. From e-commerce platforms to analytics dashboards, see how I create solutions that drive results.",
      url: "https://andersonjoseph.com/projects",
      type: "website",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Projects - Andy | Full Stack Developer & SEO Expert",
      description:
        "Explore my portfolio of web development projects, SEO campaigns, and design work. From e-commerce platforms to analytics dashboards, see how I create solutions that drive results.",
      images: ["/Andy.webp"],
    },
  };
}

export default function Projects() {
  return <ProjectsShowcase />;
}
