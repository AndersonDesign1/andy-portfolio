import type { Project, ProjectCategory } from "@/types/index"

export const projectCategories: ProjectCategory[] = ["Current Focus", "Websites", "SEO"]

export const projects: Project[] = [
  {
    id: 1,
    name: "Kyrus Recycling",
    description:
      "Led the development of a recycling web application that incentivizes users to recycle waste by offering monetary rewards. Delivered a fully functional application within three months, resulting in over 500 user sign-ups in the first month and contributing to increased environmental awareness and waste recycling efforts.",
    category: "Current Focus",
    technologies: ["Project Management", "React", "Next.js", "Node.js", "MongoDB", "Express.js"],
    website: "https://www.trashpoint.africa/",
  },
  {
    id: 7,
    name: "Personal Portfolio",
    description:
      "Designed and developed a modern, full stack, responsive portfolio website to showcase my projects, skills and a blog section. Implemented dynamic content loading, SEO, and optimized performance achieving 95+ scores in Lighthouse metrics.",
    category: "Current Focus",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Sanity CMS"],
    website: "https://andersonjoseph.com/",
  },
  {
    id: 2,
    name: "Welup Digital",
    description:
      "Developed and optimized the website over a 3-year period, achieving a 40% increase in user engagement and a 30% growth in overall traffic through responsive design and effective SEO strategies.",
    category: "Websites",
    technologies: ["WordPress", "JavaScript", "PHP"],
    website: "https://welupdigital.com",
  },
  {
    id: 3,
    name: "PromptEarn",
    description:
      "Implemented advanced SEO strategies that increased organic search visibility, boosting monthly organic traffic by 250% within six months. Optimized Google Core Web Vitals and PageSpeed scores, reducing bounce rates by 50%.",
    category: "SEO",
    technologies: ["Google Analytics", "SEO Tools"],
    website: "https://promptearn.com",
  },
  {
    id: 4,
    name: "BookTutors",
    description:
      "Achieved top 3 Google rankings for multiple pages, resulting in a 70% increase in organic traffic and a 35% rise in course sign-ups within six months through targeted keyword research and strategic content optimization.",
    category: "SEO",
    technologies: ["SEO", "WordPress"],
    website: "https://booktutors.com.ng/",
  },
  {
    id: 5,
    name: "TheWealthyPost",
    description:
      "Revamped a WordPress website for The Wealthy Post, reducing loading time from 15 seconds to 3 seconds and boosting user engagement by 40%. Enhanced organic traffic by 200% within three months by implementing responsive design and intuitive navigation.",
    category: "Websites",
    technologies: ["WordPress", "PHP", "SEO Tools"],
    website: "https://thewealthypost.com/",
  },
  {
    id: 6,
    name: "Eng4Careers",
    description:
      "Redesigned a corporate website using Wix, achieving a 40% increase in session duration, a 30% reduction in bounce rates, and improving page load speed to 2.4 seconds through a streamlined UI/UX design.",
    category: "Websites",
    technologies: ["Wix", "SEO"],
    website: "https://eng4careers.org",
  },
]

