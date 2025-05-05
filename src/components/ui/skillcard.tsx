import React from "react";
import Image from "next/image";

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillCardProps {
  title: string;
  description: string;
  skills: Skill[];
}

const SkillCard: React.FC<SkillCardProps> = React.memo(
  ({ title, description, skills }) => (
    <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 mb-6 transform skew-x-[12deg]">
      <h3 className="text-2xl font-semibold text-gray-200 mb-4">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center mr-4 mb-4">
            {typeof skill.icon === "string" ? (
              <Image
                src={skill.icon || "/placeholder.svg"}
                alt={skill.name}
                width={24}
                height={24}
                className="w-6 h-6"
                aria-hidden="true"
              />
            ) : (
              skill.icon
            )}
            <span className="ml-2 text-gray-300">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
);
SkillCard.displayName = "SkillCard";

export default SkillCard;
