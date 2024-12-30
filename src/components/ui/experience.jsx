import React from 'react';
import Image from 'next/image'; // Import Image from Next.js

const ExperienceCard = React.memo(({
  logo,
  title,
  role,
  description,
  period,
  technologies = [], // Default value ensures technologies is an array
  website,
}) => (
  <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 mb-6">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {logo ? ( // Only render Image if logo is provided
          <Image
            src={logo}
            alt={`${title} Logo`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-contain"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-gray-200">{title}</h2>
          {role && <p className="text-gray-400">{role}</p>}
          <p className="text-sm text-gray-500">{period}</p>
        </div>
      </div>
      <p className="text-gray-400 leading-relaxed whitespace-pre-line">{description}</p>
      {Array.isArray(technologies) && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mt-4">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
            >
              {tech}
            </div>
          ))}
        </div>
      )}
      {website && (
        <div className="mt-4">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
          >
            View Certificate
          </a>
        </div>
      )}
    </div>
  </div>
));

export default ExperienceCard; // Ensure the component is exported
