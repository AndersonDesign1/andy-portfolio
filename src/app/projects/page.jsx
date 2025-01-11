import ProjectList from '@/components/ui/projectslist'
import { projects, projectCategories } from '@/data/projects'

export async function generateMetadata() {
  return {
    title: 'Projects by Anderson Joseph | Web Development & SEO',
    description: "Explore Anderson Joseph's impactful projects, showcasing expertise in building responsive websites, implementing SEO strategies, and delivering exceptional business results.",
    url: 'https://andersonjoseph.com/projects',
    content: 'Projects by Anderson Joseph | Web Development, SEO Campaigns, and Digital Transformations.',
    keywords: 'Anderson Joseph Projects, Web Development Portfolio, SEO Campaigns, Responsive Websites, Digital Solutions',    
  };
}
export default function ProjectsPage() {
  return (
    <section className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-200">Projects</h1>
        {projectCategories.map(category => (
          <ProjectList key={category} category={category} projects={projects.filter(p => p.category === category)} />
        ))}
      </div>
    </section>
  )
}
