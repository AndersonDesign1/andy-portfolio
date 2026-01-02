import type { Metadata } from "next";
import ProjectsShowcase from "@/components/projects-showcase";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects",
    description:
      "A curated selection of web development projects, from e-commerce platforms to custom dashboards. See the work behind the code.",
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
      title: "Projects | Andy Joseph",
      description:
        "A curated selection of web development projects, from e-commerce platforms to custom dashboards. See the work behind the code.",
      url: "https://andersonjoseph.com/projects",
      type: "website",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Projects | Andy Joseph",
      description:
        "A curated selection of web development projects, from e-commerce platforms to custom dashboards. See the work behind the code.",
      images: ["/Andy.webp"],
    },
  };
}

export default function Projects() {
  return <ProjectsShowcase />;
}
