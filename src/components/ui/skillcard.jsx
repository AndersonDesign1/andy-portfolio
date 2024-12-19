import React from 'react';
import Image from 'next/image';

const SkillCard = ({ title, description, skills }) => {
  return (
    <div className="bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors duration-300 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#333333] hover:border-[#4A4A4A]">
      <h3 className="text-2xl font-bold mb-2 text-[#E5E7EB] font-montserrat">{title}</h3>
      <p className="text-[#9CA3AF] mb-4 font-montserrat">{description}</p>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <Image
            key={skill.name}
            src={skill.icon}
            alt={skill.name}
            width={40}
            height={40}
            className={`rounded-lg hover:scale-110 transition-transform duration-300 ${skill.customClass || ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
