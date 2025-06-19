import Hero from '@/components/hero';
import ProjectsGrid from '@/components/projects-grid';
import WorkHistory from '@/components/work-history';
import SkillsSection from '@/components/skills-section';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsGrid />
       <WorkHistory />
      <SkillsSection />
    </main>
  );
}