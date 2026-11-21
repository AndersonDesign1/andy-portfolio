export interface CaseStoryMedia {
  frame: "browser" | "phone";
  label: string;
  poster?: string;
  slot: "hero" | "steps";
  src?: string;
  webm?: string;
}

/** The case study as told on the page, in Anderson's own voice. */
export interface CaseStory {
  compare: string;
  extra?: string;
  media?: CaseStoryMedia[];
  overview: string;
  stats: { after: string; before: string; label: string; note: string }[];
  steps: {
    body: string;
    heading: string;
    name: string;
    weeks?: number;
    /** How long the step took. Left out when it simply kept going. */
    when?: string;
  }[];
  title: string;
  tools: string;
  when: string;
  why: string;
}

export interface CaseStudy {
  approach: {
    collaboration: string;
    iterations: string[];
    keyDecisions: {
      decision: string;
      rationale: string;
    }[];
    methodology: string;
    phases: {
      activities: string[];
      duration: string;
      name: string;
    }[];
    research: string[];
    userFeedback: string;
    wireframes?: string[];
  };
  challenge: {
    constraints: string[];
    context: string;
    metrics: string[];
    problem: string;
  };
  gallery: {
    images: {
      alt: string;
      src: string;
      title: string;
    }[];
  };
  goals: {
    primary: string[];
    stakeholder: string[];
    success: string[];
  };
  hero: {
    client: string;
    duration: string;
    heroImage: string;
    liveUrl?: string;
    overview: string;
    technologies: string[];
    title: string;
  };
  story?: CaseStory;
  results: {
    achievements: string[];
    beforeAfter: {
      after: string;
      before: string;
      improvement: string;
      metric: string;
    }[];
    deliverables: string[];
    metrics: string[];
    testimonials?: {
      name: string;
      quote: string;
      role: string;
    }[];
  };
}

export interface CaseStudyNavigation {
  next?: {
    slug: string;
    title: string;
  };
  prev?: {
    slug: string;
    title: string;
  };
}
