export interface ProjectLinks {
  caseStudy?: string;
  github?: string;
  live?: string;
}

export interface Project {
  description: string;
  featured?: boolean;
  links: ProjectLinks;
  order: number;
  slug: string;
  techStack: string[];
  thumbnail: string;
  title: string;
  type: "case-study" | "standard";
}
