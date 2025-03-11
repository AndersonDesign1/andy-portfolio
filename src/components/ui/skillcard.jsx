import React from 'react';

const SkillCard = ({ title, description, skills }) => {
  return (
    <div className="transform skew-x-[-12deg]">
      <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 mb-6 transform skew-x-[12deg]">
        <h3 className="text-2xl font-semibold text-gray-200 mb-4">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex flex-wrap">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center mr-4 mb-4">
              {skill.icon && (typeof skill.icon === 'string' ? (
                skill.icon ? <img src={skill.icon} alt={skill.name} className="w-6 h-6" /> : null
              ) : (
                skill.icon
              ))}
              <span className="ml-2 text-gray-300">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;