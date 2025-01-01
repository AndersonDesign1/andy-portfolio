import Image from "next/image";
const ProjectSection = () => {
  const projects = [
    {
      name: "Kyrus Recycling",
      slug: "kyrus-recycling", 
      description:
        "A web application incentivizing users to recycle waste by offering monetary rewards, promoting environmental awareness and sustainable practices.",
      tech: ["React", "Node.js", "MongoDB", "CSS", "HTML", "JavaScript", "GitHub"],
      image: "/kyrus-recycling.webp",
      projectLink: "http://trashpoint.africa/", 
      caseStudyLink: "/case-study/kyrus-recycling", // Update with slug-based path
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
  


  return (
    <section className="bg-[#0A0A0A] text-[#EDEDED] py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center font-montserrat">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#4A4A4A] rounded-2xl transition-all duration-300 overflow-hidden shadow-md"
            >
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Project Image */}
                <div className="w-full md:w-1/3 relative h-48 md:h-[300px]">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover rounded-xl bg-[#2A2A2A]"
                  />
                </div>

                {/* Project Content */}
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4 text-[#EDEDED] font-montserrat">
                    {project.name}
                  </h3>
                  <p className="text-[#9CA3AF] mb-4 font-montserrat leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#2A2A2A] text-xs rounded-full text-[#EDEDED] hover:bg-[#3A3A3A] transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-6">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EDEDED] hover:text-[#BBBBBB] transition-colors duration-300 flex items-center gap-2"
                    >
                      View Project <span className="text-lg">→</span>
                    </a>
                    <a
                      href={project.caseStudyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EDEDED] hover:text-[#BBBBBB] transition-colors duration-300 flex items-center gap-2"
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