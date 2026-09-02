import type { CaseStudy } from "@/types/case-study";
import type { Project } from "@/types/project";

interface ProjectDocument {
  data: {
    description: string;
    featured?: boolean;
    links: Project["links"];
    order: number;
    techStack: string[];
    thumbnail: string;
    title: string;
    type: string;
  };
  slug: string;
}

interface CaseStudyData extends CaseStudy {
  order: number;
}

export const toProject = (document: ProjectDocument): Project => ({
  description: document.data.description,
  featured: document.data.featured,
  links: document.data.links,
  order: document.data.order,
  slug: document.slug,
  techStack: document.data.techStack,
  thumbnail: document.data.thumbnail,
  title: document.data.title,
  type: document.data.type === "case-study" ? "case-study" : "standard",
});

export const toCaseStudy = ({ data }: { data: CaseStudyData }): CaseStudy => ({
  approach: data.approach,
  challenge: data.challenge,
  gallery: data.gallery,
  goals: data.goals,
  hero: data.hero,
  results: data.results,
});

export const compareOrder = (
  left: { order: number },
  right: { order: number }
) => left.order - right.order;
