import CtaSection from "@/components/cta-section";
import Hero from "@/components/hero";
import ProjectsGrid from "@/components/projects-grid";
import SkillsSection from "@/components/skills-section";
import WorkHistory from "@/components/work-history";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsGrid />
      <WorkHistory />
      <SkillsSection />
      <CtaSection />
    </main>
  );
}
