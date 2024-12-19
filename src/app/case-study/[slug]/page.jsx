import Image from 'next/image';
import Link from 'next/link';

async function getProject(slug) {
  // In a real application, you would fetch this data from an API or database
  const projects = {
    "my-supply-co": {
      title: "My Supply Co.",
      description: "D2C & B2B eCommerce site and blog with elegant solutions for a complex codebase and customer journey.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      challenges: [
        "Complex integration of D2C and B2B systems",
        "Large, legacy codebase requiring modernization",
        "Need for improved customer journey and user experience"
      ],
      solutions: [
        "Implemented a microservices architecture to separate D2C and B2B concerns",
        "Gradually refactored the codebase, introducing modern PHP practices and design patterns",
        "Developed a custom WordPress theme and WooCommerce extensions for a tailored user experience"
      ],
      outcomes: "The project resulted in a 30% increase in customer satisfaction scores, a 25% reduction in cart abandonment rates, and a 40% improvement in site performance metrics.",
      technologies: ["PHP", "MySQL", "JavaScript", "jQuery", "WooCommerce", "WordPress", "SCSS", "GitHub"]
    },
    "welup-digital": {
      title: "Welup Digital",
      description: "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      challenges: [
        "Ensuring consistent design across various devices and screen sizes",
        "Implementing modern SEO techniques without compromising user experience",
        "Balancing performance with rich, interactive features"
      ],
      solutions: [
        "Developed a responsive design system using modern CSS techniques and media queries",
        "Implemented server-side rendering and dynamic meta tags for improved SEO",
        "Utilized code splitting and lazy loading to optimize performance without sacrificing functionality"
      ],
      outcomes: "The project led to a 50% increase in mobile traffic, a 40% improvement in search engine rankings, and a 35% increase in user engagement metrics.",
      technologies: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"]
    }
  };

  return projects[slug] || null;
}

export default async function CaseStudyDetail({ params }) {
  const project = await getProject(params.slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Case Study Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the case study you're looking for.</p>
          <Link href="/" className="text-blue-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{project.title}</h1>
        <div className="mb-8 relative h-64 md:h-96">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p>{project.description}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
            <ul className="list-disc pl-5 space-y-2">
              {project.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Solutions</h2>
            <ul className="list-disc pl-5 space-y-2">
              {project.solutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Outcomes</h2>
            <p>{project.outcomes}</p>
          </section>
        </div>
        <div className="mt-12">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Case Studies
          </Link>
        </div>
      </div>
    </div>
  );
}