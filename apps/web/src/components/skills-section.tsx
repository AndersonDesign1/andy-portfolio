"use client";

interface SkillCategory {
  skills: string[];
  title: string;
}

const skillsData: SkillCategory[] = [
  {
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Astro",
      "Tailwind CSS",
    ],
    title: "Development",
  },
  {
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma", "REST API", "GraphQL"],
    title: "Backend & Database",
  },
  {
    skills: [
      "Git",
      "Docker",
      "AWS",
      "Vercel",
      "Cloudflare",
      "Postman",
      "Figma",
    ],
    title: "Tools & DevOps",
  },
  {
    skills: [
      "Technical SEO",
      "Google Analytics",
      "Search Console",
      "Core Web Vitals",
      "Ahrefs",
    ],
    title: "SEO & Performance",
  },
];

const SkillsSection = () => (
  <section className="bg-primary py-24 md:py-32">
    <div className="mx-auto max-w-screen-lg px-6 md:px-12">
      <div className="border-subtle flex items-end justify-between border-b pb-8">
        <h2 className="text-secondary font-mono text-sm tracking-widest uppercase">
          Expertise
        </h2>
      </div>

      <div className="pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-y-24">
          {skillsData.map((category) => (
            <div className="group" key={category.title}>
              <h3 className="text-primary pb-6 text-xl font-medium">
                {category.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {category.skills.map((skill) => (
                  <li
                    className="text-secondary hover:text-primary text-base transition-colors duration-200 ease-out"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SkillsSection;
