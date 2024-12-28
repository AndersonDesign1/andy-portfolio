import ProjectCard from "@/components/project-card"

export function ProjectSection({ title, projects }) {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-300">
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  )
}

