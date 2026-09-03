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
