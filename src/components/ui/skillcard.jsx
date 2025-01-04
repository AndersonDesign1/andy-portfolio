import React from 'react';

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

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg hover:bg-zinc-700/50 transition-colors duration-300"
            >
              {skill.icon}
              <span className="text-gray-300 text-sm">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;