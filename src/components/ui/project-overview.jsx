const ProjectSection = () => {
  const projects = [
    {
      name: "My Supply Co.",
      slug: "my-supply-co",
      description:
        "D2C & B2B eCommerce site and blog with elegant solutions for a complex codebase and customer journey.",
      tech: ["PHP", "MySQL", "JavaScript", "jQuery", "WooCommerce", "WordPress", "SCSS", "GitHub"],
      image: "/images/mysupplyco.png",
      projectLink: "https://www.mysupplyco.com",
      caseStudyLink: "/case-study/my-supply-co",
    },
    {
      name: "Welup Digital",
      slug: "welup-digital",
      description:
        "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
      tech: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"],
      image: "/images/wellupdigital.png",
      projectLink: "https://wellupdigital.com",
      caseStudyLink: "/case-study/welup-digital",
    },
    {
      name: "Prompt Earn",
      slug: "prompt-earn",
      description:
        "Comprehensive SEO campaigns achieving 40% increase in traffic and affiliate earnings.",
      tech: ["Google Analytics", "SEMRush", "MailChimp", "Social Media Tools"],
      image: "/images/promptearn.png",
      projectLink: "#",
      caseStudyLink: "/case-study/prompt-earn",
    },
  ];

  return (
    <section className="w-full bg-black text-white relative overflow-hidden py-16">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-6xl font-bold mb-12 text-center text-gray-200">
          Featured Projects
        </h2>
        
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 relative rounded-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-64 md:h-full object-cover"
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
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-zinc-800/50 text-xs rounded-full text-gray-300 hover:bg-zinc-700/50 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6 pt-4">
                    <a
                      href={project.projectLink}
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      View Project <span className="text-lg">→</span>
                    </a>
                    <a
                      href={project.caseStudyLink}
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      Case Study <span className="text-lg">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;