import type { Metadata } from "next";
import ProjectsShowcase from "@/components/projects-showcase";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Projects",
  description:
    "A curated selection of web development projects, from e-commerce platforms to custom dashboards. See the work behind the code.",
});

export default function Projects() {
  return <ProjectsShowcase />;
}
