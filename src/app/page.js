import Hero from '@/components/ui/hero'
import Skills from '@/components/ui/skills';
import { Experience } from '@/components/ui/experience'
import ProjectSection from "@/components/ui/project-overview";
import CaseStudy from '@/components/ui/case-study';

async function getProjects() {
  // In a real application, you would fetch this data from an API or database
  return [
    {
      id: 1,
      title: "My Supply Co.",
      description: "D2C & B2B eCommerce site and blog with elegant solutions for a complex codebase and customer journey.",
      imageUrl: "/images/my-supply-co.jpg",
      technologies: ["PHP", "MySQL", "JavaScript", "jQuery", "WooCommerce", "WordPress", "SCSS", "GitHub"],
      projectUrl: "/projects/my-supply-co",
      slug: "my-supply-co"
    },
    {
      id: 2,
      title: "Welup Digital",
      description: "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
      imageUrl: "/images/welup-digital.jpg",
      technologies: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"],
      projectUrl: "/projects/welup-digital",
      slug: "welup-digital"
    },
    // Add more projects as needed
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
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-[#ededed]">Case Studies</h2>
        {projects.map((project) => (
          <CaseStudy key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}