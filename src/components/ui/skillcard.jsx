import React from 'react';

const SkillCard = ({ title, description, skills }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="mb-4">{description}</p>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center mr-4 mb-4">
            {skill.icon && (typeof skill.icon === 'string' ? (
              skill.icon ? <img src={skill.icon} alt={skill.name} className="w-6 h-6" /> : null
            ) : (
              skill.icon
            ))}
            <span className="ml-2">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;