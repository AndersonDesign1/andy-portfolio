import React from 'react';
import SkillCard from './skillcard';

const skillsData = [
  {
    title: 'Frontend Development',
    description: "I'm passionate about creating visually appealing, interactive, and responsive websites using modern frontend technologies. My focus is on delivering seamless user experiences.",
    skills: [
      { name: 'React', icon: '/icons/react.png' },
      { name: 'Tailwind CSS', icon: '/icons/tailwind.png' },
      { name: 'JavaScript', icon: '/icons/javascript.png' },
      { name: 'HTML5', icon: '/icons/html.png' },
      { name: 'CSS3', icon: '/icons/css.png' },
      { name: 'Bootstrap', icon: '/icons/bootstrap.png' },
    ],
  },
  {
    title: 'Backend Development',
    description: 'I enjoy problem-solving and building reliable, secure, and scalable backend systems, using modern frameworks and languages to power applications efficiently.',
    skills: [
      { name: 'Node.js', icon: '/icons/nodejs.png' },
      { name: 'Python', icon: '/icons/python.png' },
      { name: 'TypeScript', icon: '/icons/typescript.png' },
      { name: 'Express.js', icon: '/icons/express.png' },
      { name: 'Database Management', icon: '/icons/database.png' },
    ],
  },
  {
    title: 'SEO & Digital Marketing',
    description: 'I specialize in optimizing websites for search engines and driving organic traffic growth through modern SEO strategies and techniques.',
    skills: [
      { name: 'On-Page SEO', icon: '/icons/seo.png' },
      { name: 'Off-Page SEO', icon: '/icons/linkbuilding.png' },
      { name: 'Technical SEO', icon: '/icons/technicalseo.png' },
      { name: 'Google Analytics', icon: '/icons/googleanalytics.png' },
      { name: 'SEMrush', icon: '/icons/semrush.png' },
      { name: 'Search Console', icon: '/icons/searchconsole.png' },
    ],
  },
  {
    title: 'No-code Development',
    description: 'I leverage no-code tools to build functional websites and prototypes quickly, making it accessible to businesses and startups.',
    skills: [
      { name: 'WordPress', icon: '/icons/wordpress.png' },
      { name: 'Wix', icon: '/icons/wix.png' },
      { name: 'Webflow', icon: '/icons/webflow.png' },
      { name: 'Bubble', icon: '/icons/bubble.png' },
      { name: 'Framer', icon: '/icons/framer.png' },
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