/**
 * Type definition for case study data
 */
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
  
  /**
   * Type for the case studies JSON file
   */
  declare const caseStudies: CaseStudy[]
  export default caseStudies
  
  