import Hero from '@/components/ui/hero';
import Skills from '@/components/ui/skills';
import { Experience } from '@/components/ui/experience';
import ProjectSection from '@/components/ui/project-overview';

async function getProjects() {
  return [
    {
      id: 1,
      title: "My Supply Co.",
      description: "D2C & B2B eCommerce site and blog with elegant solutions for a complex codebase and customer journey.",
      imageUrl: "/images/my-supply-co.jpg",
      technologies: ["PHP", "MySQL", "JavaScript", "jQuery", "WooCommerce", "WordPress", "SCSS", "GitHub"],
      projectUrl: "/projects/my-supply-co",
      slug: "my-supply-co",
    },
    {
      id: 2,
      title: "Welup Digital",
      description: "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
      imageUrl: "/images/welup-digital.jpg",
      technologies: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"],
      projectUrl: "/projects/welup-digital",
      slug: "welup-digital",
    },
  ];
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main>
      <Hero />
      <Experience />
      <Skills />
      <ProjectSection />
    </main>
  );
}
