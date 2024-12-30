import Hero from '@/components/ui/hero';
import Skills from '@/components/ui/skills';
import Experience from '@/components/ui/experience';
import ProjectCard from '@/components/ui/project-card'
// Mock data function
function getProjects() {
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

// Updated ProjectSection Component
function ProjectSection() {
  const projects = getProjects();

  return (
    <section className="projects-section">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  return (
    <main>
      <Hero />
      <Experience />
      <Skills />
      <ProjectSection /> {/* Updated and included ProjectSection */}
    </main>
  );
}
