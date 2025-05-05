import type React from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  name: string;
  slug: string;
  description: string;
  tech: string[];
  image: string;
  projectLink: string;
  caseStudyLink: string;
}

const projects: Project[] = [
  {
    name: "Kyrus Recycling",
    slug: "kyrus-recycling",
    description:
      "A web application incentivizing users to recycle waste by offering monetary rewards, promoting environmental awareness and sustainable practices.",
    tech: [
      "React",
      "Node.js",
      "MongoDB",
      "CSS",
      "HTML",
      "JavaScript",
      "GitHub",
    ],
    image: "/kyrus-recycling.webp",
    projectLink: "http://trashpoint.africa/",
    caseStudyLink: "/case-study/kyrus-recycling",
  },
  {
    name: "Welup Digital",
    slug: "welup-digital",
    description:
      "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
    tech: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"],
    image: "/welup-digital.webp",
    projectLink: "https://welupdigital.com",
    caseStudyLink: "/case-study/welup-digital",
  },
  {
    name: "Prompt Earn",
    slug: "prompt-earn",
    description:
      "Comprehensive SEO campaigns achieving a 40% increase in traffic and affiliate earnings.",
    tech: ["Google Analytics", "SEMRush", "MailChimp", "Social Media Tools"],
    image: "/promptearn.webp",
    projectLink: "https://promptearn.com/",
    caseStudyLink: "/case-study/prompt-earn",
  },
];

const ProjectSection: React.FC = () => {
  return (
    <section
      className="w-full bg-black text-white relative overflow-hidden py-16"
      aria-labelledby="featured-projects-heading"
    >
      {/* Background grid and blobs */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2
          id="featured-projects-heading"
          className="text-6xl font-bold mb-12 text-center text-gray-200"
        >
          Featured Projects
        </h2>

        <div className="flex flex-col items-center gap-8">
          {projects.map((project, idx) => (
            <article
              key={project.slug}
              className="bg-zinc-900/50 rounded-3xl p-8 max-w-6xl w-full mx-auto backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Project Image */}
                <div className="w-full md:w-1/3 relative h-48 md:h-[220px]">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx === 0}
                    className="object-cover rounded-xl bg-[#2A2A2A]"
                  />
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-200">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-zinc-800/50 text-xs rounded-full text-gray-300 hover:bg-zinc-700/50 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6 pt-4">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      View Project <span className="text-lg">→</span>
                    </a>
                    <Link
                      href={project.caseStudyLink}
                      className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      Case Study <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
