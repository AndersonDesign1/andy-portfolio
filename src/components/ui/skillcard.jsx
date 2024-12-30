import React from 'react';
import Image from 'next/image';

const SkillCard = ({ title, description, skills = [] }) => {  // Set default value for skills
  return (
    <div className="bg-zinc-900/50 rounded-3xl p-6 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-teal-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20.4 3.6a3.5 3.5 0 00-5 0l-2 2a1 1 0 000 1.4l3.6 3.6a1 1 0 001.4 0l2-2a3.5 3.5 0 000-5z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        </div>
        
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.name} 
              className="bg-zinc-800/50 rounded-xl p-2 hover:bg-zinc-700 transition-all duration-300 border border-gray-700/30 hover:border-gray-600"
              title={skill.name}
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                width={25}
                height={25}
                className="rounded-lg hover:scale-110 transition-transform duration-300"
                priority={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
