import CtaSection from "@/components/cta-section";
import Hero from "@/components/hero";
import ProjectsGrid from "@/components/projects-grid";
import SkillsSection from "@/components/skills-section";
import WorkHistory from "@/components/work-history";
import { getGraft } from "@/lib/graft";
import { compareOrder, toProject } from "@/lib/portfolio";
import type { Project } from "@/types/project";

export default async function Home() {
  const documents = await getGraft().listContent("projects");
  const featured: Project[] = [];
  for (const document of documents) {
    const project = toProject(document);
    if (project.featured) {
      featured.push(project);
    }
  }
  const featuredProjects = featured.toSorted(compareOrder);

  return (
    <>
      <Hero />
      <ProjectsGrid projects={featuredProjects} />
      <WorkHistory />
      <SkillsSection />
      <CtaSection />
    </>
  );
}
