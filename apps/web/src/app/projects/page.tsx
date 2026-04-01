import type { Metadata } from "next";
import ProjectsShowcase from "@/components/projects-showcase";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Projects",
  description: "Stuff I've built.",
});

export default function Projects() {
  return <ProjectsShowcase />;
}
