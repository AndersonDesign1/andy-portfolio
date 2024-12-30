import React from 'react';
import SkillCard from '@/components/ui/skillcard';

const skillsData = [
  {
    title: 'Frontend Development',
    description: "I'm passionate about creating visually appealing, interactive, and responsive websites using modern frontend technologies.",
    skills: [
      { name: 'React', icon: '/react.svg' },
      { name: 'Tailwind CSS', icon: '/Tailwind CSS.svg' },
      { name: 'JavaScript', icon: '/javascript.svg' },
    ],
  },
  // Other categories...
];

const Skills = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        {skillsData.map((category, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-3xl font-semibold text-white mb-4">{category.title}</h2>
            <p className="text-gray-400 mb-6">{category.description}</p>
            <div className="flex flex-wrap gap-4">
              {category.skills.map((skill, idx) => (
                <SkillCard key={idx} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
