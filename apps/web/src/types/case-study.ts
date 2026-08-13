export interface CaseStudy {
  approach: {
    methodology: string;
    phases: Array<{
      name: string;
      duration: string;
      activities: string[];
    }>;
    keyDecisions: Array<{
      decision: string;
      rationale: string;
    }>;
    research: string[];
    wireframes?: string[];
    collaboration: string;
    iterations: string[];
    userFeedback: string;
  };
  challenge: {
    problem: string;
    constraints: string[];
    context: string;
    metrics: string[];
  };
  gallery: {
    images: Array<{
      src: string;
      alt: string;
      title: string;
    }>;
  };
  goals: {
    primary: string[];
    stakeholder: string[];
    success: string[];
  };
  hero: {
    title: string;
    client: string;
    duration: string;
    overview: string;
    heroImage: string;
    technologies: string[];
    liveUrl?: string;
  };
  id: string;
  results: {
    beforeAfter: Array<{
      metric: string;
      before: string;
      after: string;
      improvement: string;
    }>;
    metrics: string[];
    testimonials?: Array<{
      name: string;
      role: string;
      quote: string;
    }>;
    deliverables: string[];
    achievements: string[];
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

export interface CaseStudiesData {
  caseStudies: Record<string, CaseStudy>;
}
