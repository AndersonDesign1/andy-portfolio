import Image from 'next/image';
import Link from 'next/link';

const CaseStudy = ({ project }) => {
  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row bg-[#0a0a0a] text-[#ededed] rounded-lg overflow-hidden mb-8">
      <div className="md:w-1/3 relative h-48 md:h-auto">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title || 'Project image'}
            width={300}
            height={200}
            className="object-cover"
            priority
          />
        )}
      </div>
      <div className="md:w-2/3 p-6">
        <h2 className="text-2xl font-bold mb-2">{project.title || 'Untitled Project'}</h2>
        <p className="mb-4">{project.description || 'No description available.'}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.technologies || []).map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex space-x-4">
          {project.projectUrl && (
            <Link href={project.projectUrl} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              View Project
            </Link>
          )}
          {project.slug && (
            <Link href={`/case-study/${project.slug}`} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Case Study
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;