import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' 
import { ExternalLink, Github } from 'lucide-react'

export default function ProjectCard({ id, title, description, imageUrl, technologies, projectUrl, slug }) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-black/20 backdrop-blur-xs transition-all hover:bg-black/40 hover:scale-105 duration-300 ease-in-out">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 group-hover:text-zinc-300">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge 
              key={tech} 
              variant="outline"
              className="bg-zinc-800/50 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-300"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4">
          <Link
            href={projectUrl}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View Project
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}