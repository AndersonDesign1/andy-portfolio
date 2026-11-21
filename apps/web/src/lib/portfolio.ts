import type { CaseStory, CaseStudy } from "@/types/case-study";
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
  story: data.story,
});

export const compareOrder = (
  left: { order: number },
  right: { order: number }
) => left.order - right.order;

const listSentence = (items: string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}.`
    : `${items[0] ?? ""}.`;

/**
 * The story told on the page. Studies written before `story` existed get one
 * built from their hero, challenge and results, so the template never breaks.
 */
export const storyOf = (study: CaseStudy): CaseStory =>
  study.story ?? {
    compare: "Where things stood before, and after.",
    decisions: study.approach.keyDecisions.map((entry) => ({
      body: entry.rationale,
      heading: entry.decision,
    })),
    overview: study.hero.overview,
    stats: study.results.beforeAfter.slice(0, 4).map((entry) => ({
      after: entry.after,
      before: entry.before,
      label: entry.metric,
      note: entry.improvement,
    })),
    steps: study.approach.phases.map((phase) => ({
      body: listSentence(phase.activities),
      heading: phase.name,
      name: phase.name,
      when: phase.duration,
    })),
    title: study.hero.title,
    tools: listSentence(study.hero.technologies),
    when: study.hero.duration,
    why: study.challenge.problem,
  };
