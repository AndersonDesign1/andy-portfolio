import type React from "react";
import SkillCard from "./skillcard";
import {
  FaReact,
  FaCss3Alt,
  FaHtml5,
  FaJs,
  FaBootstrap,
  FaNodeJs,
  FaGoogle,
  FaWordpress,
  FaWix,
  FaCloudflare,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostman,
  SiRedis,
  SiFirebase,
  SiWebflow,
  SiFramer,
  SiSemrush,
} from "react-icons/si";

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    description:
      "I'm passionate about creating visually appealing, interactive, and responsive websites using modern frontend technologies. My focus is on delivering seamless user experiences.",
    skills: [
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "JavaScript", icon: <FaJs /> },
      { name: "HTML5", icon: <FaHtml5 /> },
      { name: "CSS3", icon: <FaCss3Alt /> },
      { name: "Bootstrap", icon: <FaBootstrap /> },
    ],
  },
  {
    title: "Backend Development",
    description:
      "I enjoy problem-solving and building reliable, secure, and scalable backend systems, using modern frameworks and languages to power applications efficiently.",
    skills: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express", icon: <SiExpress /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Redis", icon: <SiRedis /> },
      { name: "Cloudflare", icon: <FaCloudflare /> },
      { name: "Google Cloud", icon: <FaGoogle /> },
      { name: "Firebase", icon: <SiFirebase /> },
    ],
  },
  {
    title: "SEO & Digital Marketing",
    description:
      "I specialize in optimizing websites for search engines and driving organic traffic growth through modern SEO strategies and techniques.",
    skills: [
      { name: "Ahrefs", icon: "/Ahrefs.svg" },
      { name: "AiOseo", icon: "/AiOseo.svg" },
      { name: "SEMrush", icon: <SiSemrush /> },
    ],
  },
  {
    title: "No-code Development",
    description:
      "I leverage no-code tools to build functional websites and prototypes quickly, making it accessible to businesses and startups.",
    skills: [
      { name: "WordPress", icon: <FaWordpress /> },
      { name: "Wix", icon: <FaWix /> },
      { name: "Webflow", icon: <SiWebflow /> },
      { name: "Bubble", icon: "/Bubble.io.svg" },
      { name: "Framer", icon: <SiFramer /> },
    ],
  },
];

const Skills: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-[#ededed] font-display mb-12">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsData.map((skill) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              description={skill.description}
              skills={skill.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
