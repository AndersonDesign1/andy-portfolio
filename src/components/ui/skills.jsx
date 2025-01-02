import React from 'react';
import SkillCard from './skillcard';

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
      { name: 'Redis', icon: '/redis.svg' },
      { name: 'Cloudflare', icon: '/cloudflare.svg' },
      { name: 'Google Cloud', icon: '/Google Cloud.svg' },
      { name: 'Firebase', icon: '/firebase.svg' },
    ],
  },
  {
    title: 'SEO & Digital Marketing',
    description: 'I specialize in optimizing websites for search engines and driving organic traffic growth through modern SEO strategies and techniques.',
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