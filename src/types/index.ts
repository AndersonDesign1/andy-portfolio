// Project types
export type ProjectCategory = "Current Focus" | "Websites" | "SEO"

export interface Project {
  id: number
  name: string
  description: string
  category: ProjectCategory
  technologies: string[]
  website: string
  github?: string
}

// Case Study types
export interface CaseStudy {
  slug: string
  title: string
  description: string
  imageUrl: string
  challenges: string[]
  solutions: string[]
  outcomes: string
  technologies: string[]
  website: string
}

