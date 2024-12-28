'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Experience = () => {
  const [activeTab, setActiveTab] = useState("work");

  const workExperiences = [
    {
      company: "Welup Digital",
      role: "SEO Specialist",
      period: "Sep 2021 - Present",
      description: `
        - Increased organic website traffic by 500% through SEO optimisation and targeted campaigns.
        - Improved keyword rankings for 5 critical keywords via audits and data-driven strategies.
        - Created SEO-friendly content resulting in a 55% increase in click-through rates.
      `,
      technologies: ["Google Analytics", "SEMrush", "Ahrefs", "Google Search Console"],
      logo: "/welup-logo.png",
      website: "https://welupdigital.com"
    },
    {
      company: "Welup Digital",
      role: "Frontend Web Developer",
      period: "Sep 2021 - Present",
      description: `
        - Developed and maintained responsive websites, ensuring speed, usability, and design consistency.
        - Created over 10 websites for various companies and helped them rank online by applying modern SEO techniques.
        - Redesigned platforms for enhanced usability, aesthetics, and SEO.
      `,
      technologies: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"],
      logo: "/welup-logo.png",
      website: "https://welupdigital.com"
    },
    {
      company: "Prompt Earn",
      role: "SEO Specialist",
      period: "May 2024 - Oct 2024",
      description: `
        - Spearheaded a comprehensive marketing campaign utilising email, social media, and affiliate marketing strategies, resulting in a 40% increase in affiliates over 8 weeks.
        - Quadrupled monthly website traffic from 10,000 to 40,000 visitors within three months through affiliate SEO techniques.
        - Trained interns on Affiliate SEO best practices and strategies.
      `,
      technologies: ["Google Analytics", "SEMrush", "MailChimp", "Social Media Tools"],
      logo: "/promptearn-logo.png",
      website: "https://promptearn.com"
    },
    {
      company: "The Wealthy Post",
      role: "WordPress Developer",
      period: "Dec 2023 - Mar 2024",
      description: `
        - Redesigned the website using Elementor, delivering a modern and unique look tailored to the client vision.
        - Optimized the website and blogs for SEO, achieving a 40% increase in monthly traffic within two months.
        - Enhanced website performance by reducing loading time from 12 to 2.4 seconds, ensuring a seamless user experience.
      `,
      technologies: ["WordPress", "Elementor", "PHP", "CSS", "JavaScript"],
      logo: "/thewealthypost-logo.png",
      website: "https://thewealthypost.com"
    },
    {
      company: "Eng4Careers",
      role: "Wix Developer",
      period: "May 2024 - Jul 2024",
      description: `
        - Developed and customised Wix websites to enhance user experience and functionality, achieving high client satisfaction.
        - Collaborated with design and marketing teams to implement SEO strategies, boosting site traffic and visibility.
      `,
      technologies: ["Wix", "Velo", "JavaScript", "HTML", "CSS"],
      logo: "/eng4careers-logo.avif",
      website: "https://eng4careers.org"
    },
  ];

  const studyExperiences = [
    {
      institution: "Edobits ICT Academy",
      degree: "Diploma in Web Development",
      period: "Sep 2020 - Sep 2021",
      description: "Comprehensive web development training focusing on modern frameworks and technologies.",
      logo: "/edobits-logo.webp",
      technologies: [],
      certificate: ""
    },
    {
      institution: "Coursera",
      degree: "Introduction to Google SEO",
      period: "2023",
      description: "Developed expertise in search engine optimization fundamentals and best practices.",
      logo: "/coursera-logo.png",
      technologies: [],
      certificate: "https://www.coursera.org/account/accomplishments/certificate/XYZ123"
    },
    {
      institution: "Coursera",
      degree: "Google SEO Fundamentals",
      period: "2023",
      description: "Focused on advanced SEO techniques to boost website visibility and rankings.",
      logo: "/coursera-logo.png",
      technologies: [],
      certificate: "https://www.coursera.org/account/accomplishments/certificate/ABC456"
    },
    {
      institution: "NABTEB",
      degree: "Diploma in Computer Science",
      period: "2021",
      description: "Gained foundational knowledge in computer science, algorithms, and system design.",
      logo: "/nabteb-logo.png",
      technologies: [],
      certificate: ""
    },
  ];
  return (
    <section className="bg-[#0a0a0a] text-[#ededed] font-cal py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-center">Experience</h2>
        <Tabs defaultValue="work" className="w-full max-w-3xl flex flex-col items-center" onValueChange={setActiveTab}>
          <TabsList className="bg-[#1a1a1a] p-1 rounded-full inline-flex w-96 h-16 mb-6">
            <TabsTrigger
              value="work"
              className={`px-8 py-4 rounded-full text-lg transition-all flex-1 h-14 ${activeTab === 'work' ? 'bg-[#ededed] text-[#0a0a0a]' : 'text-[#ededed]'}`}
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="studies"
              className={`px-8 py-4 rounded-full text-lg transition-all flex-1 h-14 ${activeTab === 'studies' ? 'bg-[#ededed] text-[#0a0a0a]' : 'text-[#ededed]'}`}
            >
              Studies
            </TabsTrigger>
          </TabsList>
          <TabsContent value="work">
            {workExperiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                logo={exp.logo}
                title={exp.company}
                role={exp.role}
                description={exp.description}
                period={exp.period}
                technologies={exp.technologies}
              />
            ))}
          </TabsContent>
          <TabsContent value="studies">
            {studyExperiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                logo={exp.logo}
                title={exp.institution}
                role={exp.degree}
                description={exp.description}
                period={exp.period}
                technologies={exp.technologies}
                website={exp.certificate}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

const ExperienceCard = ({ logo, title, role, description, period, technologies, website }) => {
  return (
    <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 mb-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt={title}
            className="w-12 h-12 rounded-xl object-contain"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-200">
              {title}
            </h2>
            {role && <p className="text-gray-400">{role}</p>}
            <p className="text-sm text-gray-500">{period}</p>
          </div>
        </div>

        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
          {description}
        </p>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        )}
        {website && (
          <div className="mt-4">
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
            >
              View Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export { Experience, ExperienceCard };
