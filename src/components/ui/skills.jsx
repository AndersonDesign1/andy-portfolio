import React from 'react';
import SkillCard from '@/components/ui/skillcard';

const skillsData = [
  {
    title: 'Frontend Development',
    description: "I'm passionate about creating visually appealing, interactive, and responsive websites using modern frontend technologies. My focus is on delivering seamless user experiences.",
    skills: [
      { name: 'React', icon: '/react.svg' },
      { name: 'Tailwind CSS', icon: '/Tailwind CSS.svg' },
      { name: 'JavaScript', icon: '/javascript.svg' },
      { name: 'HTML5', icon: '/html.svg' },
      { name: 'CSS3', icon: '/css.svg' },
      { name: 'Bootstrap', icon: '/Bootstrap.svg' },
    ],
  },
  {
    title: 'Backend Development',
    description: 'I enjoy problem-solving and building reliable, secure, and scalable backend systems, using modern frameworks and languages to power applications efficiently.',
    skills: [
      { name: 'Node.js', icon: '/Node.js.svg' },
      { name: 'Express', icon: '/Express.svg' },
      { name: 'MongoDB', icon: '/mongodb.svg' },
      { name: 'Postman', icon: '/postman.svg' },
    ],
  },
  {
    title: 'SEO Tools',
    description: 'I use various SEO tools to improve website visibility and ranking.',
    skills: [
      // { name: 'Search Console', icon: '/google-search-console.svg', customClass: 'large-icon' },
      { name: 'Ahrefs', icon: '/Ahrefs.svg', customClass: 'large-icon' },
      { name: 'AiOseo', icon: '/AiOseo.svg', customClass: 'large-icon' },
      { name: 'SEMrush', icon: '/Semrush.svg' },
    ],
  },
  {
    title: 'No-code Development',
    description: 'I leverage no-code tools to build functional websites and prototypes quickly, making it accessible to businesses and startups.',
    skills: [
      { name: 'WordPress', icon: '/WordPress.svg' },
      { name: 'Wix', icon: '/Wix.com.svg' },
      { name: 'Webflow', icon: '/Webflow.svg' },
      { name: 'Bubble', icon: '/Bubble.io.svg' },
      { name: 'Framer', icon: '/Framer.svg' },
    ],
  },
];

const Skills = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        {skillsData.map((category, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-3xl font-semibold text-white mb-4">{category.title}</h2>
            <p className="text-gray-400 mb-6">{category.description}</p>
            <div className="flex flex-wrap gap-4">
              {category.skills.map((skill, idx) => (
                <div key={idx} className={`flex items-center ${skill.customClass || ''}`}>
                  <img src={skill.icon} alt={skill.name} className="w-8 h-8 mr-2" />
                  <span className="text-gray-300">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;