'use client';

import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';

export default function ProjectList({ category, projects }) {
  return (
    <section className="text-[#ededed] font-cal py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">{category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl p-8 backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                {project.name}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <FaGithub className="text-xl" />
                    GitHub
                  </Link>
                )}
                {project.website && (
                  <Link
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <BiLinkExternal className="text-xl" />
                    Website
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}