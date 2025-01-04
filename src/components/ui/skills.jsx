import React from 'react';
import SkillCard from '@/components/ui/skillcard';
import { FaReact, FaHtml5, FaCss3Alt, FaBootstrap, FaNodeJs, FaWordpress, FaWix, FaCloudflare } from 'react-icons/fa';
import { SiTailwindcss, SiJavascript, SiExpress, SiMongodb, SiPostman, SiRedis, SiGooglecloud, SiFirebase, SiSemrush, SiWebflow, SiBubble, SiFramer } from 'react-icons/si';
import { TbSeo } from 'react-icons/tb';
import SvgIcon from '@components/ui/svg-icon';

const skillsData = [
  {
    title: 'Frontend Development',
    description: "I'm passionate about creating visually appealing, interactive, and responsive websites using modern frontend technologies. My focus is on delivering seamless user experiences.",
    skills: [
      { name: 'React', icon: <FaReact className="w-8 h-8" /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-8 h-8" /> },
      { name: 'JavaScript', icon: <SiJavascript className="w-8 h-8" /> },
      { name: 'HTML5', icon: <FaHtml5 className="w-8 h-8" /> },
      { name: 'CSS3', icon: <FaCss3Alt className="w-8 h-8" /> },
      { name: 'Bootstrap', icon: <FaBootstrap className="w-8 h-8" /> },
    ],
  },
  {
    title: 'Backend Development',
    description: 'I enjoy problem-solving and building reliable, secure, and scalable backend systems, using modern frameworks and languages to power applications efficiently.',
    skills: [
      { name: 'Node.js', icon: <FaNodeJs className="w-8 h-8" /> },
      { name: 'Express', icon: <SiExpress className="w-8 h-8" /> },
      { name: 'MongoDB', icon: <SiMongodb className="w-8 h-8" /> },
      { name: 'Postman', icon: <SiPostman className="w-8 h-8" /> },
      { name: 'Redis', icon: <SiRedis className="w-8 h-8" /> },
      { name: 'Cloudflare', icon: <FaCloudflare className="w-8 h-8" /> },
      { name: 'Google Cloud', icon: <SiGooglecloud className="w-8 h-8" /> },
      { name: 'Firebase', icon: <SiFirebase className="w-8 h-8" /> },
    ],
  },
  {
    title: 'SEO & Digital Marketing',
    description: 'I specialize in optimizing websites for search engines and driving organic traffic growth through modern SEO strategies and techniques.',
    skills: [
      { name: 'Technical SEO', icon: <TbSeo className="w-8 h-8" /> },
      { name: 'Custom SVG', icon: <SvgIcon className="w-8 h-8" /> },
      { name: 'SEMrush', icon: <SiSemrush className="w-8 h-8" /> },
    ],
  },
  {
    title: 'No-code Development',
    description: 'I leverage no-code tools to build functional websites and prototypes quickly, making it accessible to businesses and startups.',
    skills: [
      { name: 'WordPress', icon: <FaWordpress className="w-8 h-8" /> },
      { name: 'Wix', icon: <FaWix className="w-8 h-8" /> },
      { name: 'Webflow', icon: <SiWebflow className="w-8 h-8" /> },
      { name: 'Bubble', icon: <SiBubble className="w-8 h-8" /> },
      { name: 'Framer', icon: <SiFramer className="w-8 h-8" /> },
    ],
  },
];

const Skills = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-[#ededed] font-display mb-12">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsData.map((skill) => (
            <div className="transform skew-x-[-12deg]" key={skill.title}>
              <SkillCard
                title={skill.title}
                description={skill.description}
                skills={skill.skills}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;