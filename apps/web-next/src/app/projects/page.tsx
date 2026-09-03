import type { Metadata } from "next";
import ProjectsShowcase from "@/components/projects-showcase";
import { getGraft } from "@/lib/graft";
import { constructMetadata } from "@/lib/metadata";
import { compareOrder, toProject } from "@/lib/portfolio";

export const metadata: Metadata = constructMetadata({
  description:
    "Projects I've built — web apps, e-commerce platforms, and custom dashboards.",
  title: "Projects",
});

export default async function Projects() {
  const documents = await getGraft().listContent("projects");
  const projects = documents.map(toProject).toSorted(compareOrder);
  return <ProjectsShowcase projects={projects} />;
}
