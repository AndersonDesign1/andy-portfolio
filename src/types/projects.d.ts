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

export const projectCategories: ProjectCategory[]
export const projects: Project[]

