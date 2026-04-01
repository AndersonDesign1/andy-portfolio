import type { Metadata } from "next";
import ProjectsShowcase from "@/components/projects-showcase";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Projects",
  description:
    "Projects I've built — web apps, e-commerce platforms, and custom dashboards.",
});

export default function Projects() {
  return <ProjectsShowcase />;
}
