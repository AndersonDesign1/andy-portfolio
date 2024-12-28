import ProjectCard from '@/components/project-card'
import { Code } from 'lucide-react'

const projects = {
  personal: [
    {
      title: "AI Code Assistant",
      description: "A real-time code completion and suggestion tool powered by machine learning, helping developers write better code faster.",
      type: "Personal",
      technologies: ["Next.js", "OpenAI", "Python", "TensorFlow"],
      links: {
        github: "https://github.com/yourusername/ai-code-assistant",
        demo: "https://ai-code.demo.com"
      }
    },
    {
      title: "Smart Home Dashboard",
      description: "A centralized dashboard for monitoring and controlling IoT devices, with real-time updates and automation capabilities.",
      type: "Personal",
      technologies: ["React", "Node.js", "MQTT", "WebSockets"],
      links: {
        github: "https://github.com/yourusername/smart-home",
        demo: "https://smart-home.demo.com"
      }
    },
    {
      title: "Crypto Portfolio Tracker",
      description: "Track and analyze cryptocurrency investments with real-time price updates, portfolio analytics, and trading history.",
      type: "Personal",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "CoinGecko API"],
      links: {
        github: "https://github.com/yourusername/crypto-tracker",
      }
    }
  ],
  freelance: [
    {
      title: "Restaurant Management System",
      description: "Full-stack solution for restaurant operations including order management, inventory tracking, and staff scheduling.",
      type: "Freelance",
      technologies: ["Next.js", "PostgreSQL", "Prisma", "Redis"],
      links: {
        demo: "https://restaurant-sys.demo.com"
      }
    },
    {
      title: "Real Estate Platform",
      description: "Property listing and management platform with virtual tours, appointment scheduling, and document management.",
      type: "Freelance",
      technologies: ["React", "Node.js", "MongoDB", "AWS S3"],
      links: {
        demo: "https://realestate.demo.com"
      }
    },
    {
      title: "Event Planning Portal",
      description: "Comprehensive event management solution with vendor coordination, budget tracking, and guest list management.",
      type: "Freelance",
      technologies: ["Next.js", "Stripe", "SendGrid", "Google Calendar API"],
      links: {
        demo: "https://eventplanner.demo.com"
      }
    }
  ],
  educational: [
    {
      title: "Interactive Math Learning",
      description: "Gamified mathematics learning platform with interactive exercises, progress tracking, and adaptive difficulty.",
      type: "Educational",
      technologies: ["Next.js", "Three.js", "Firebase", "WebGL"],
      links: {
        github: "https://github.com/yourusername/math-learning",
        demo: "https://mathlearn.demo.com"
      }
    },
    {
      title: "Language Exchange Platform",
      description: "Platform connecting language learners worldwide for practice sessions, with built-in video chat and lesson planning.",
      type: "Educational",
      technologies: ["React", "WebRTC", "Socket.io", "MongoDB"],
      links: {
        github: "https://github.com/yourusername/lang-exchange",
        demo: "https://langexchange.demo.com"
      }
    },
    {
      title: "Code Challenge Platform",
      description: "Interactive coding challenges with real-time compilation, testing, and peer review capabilities.",
      type: "Educational",
      technologies: ["Next.js", "Docker", "PostgreSQL", "Judge0 API"],
      links: {
        github: "https://github.com/yourusername/code-challenges",
        demo: "https://codechallenges.demo.com"
      }
    }
  ],
  opensource: [
    {
      title: "React State Manager",
      description: "Lightweight and performant state management solution for React applications with DevTools integration.",
      type: "Open Source",
      technologies: ["React", "TypeScript", "Redux DevTools"],
      links: {
        github: "https://github.com/yourusername/react-state",
        demo: "https://react-state.demo.com"
      }
    },
    {
      title: "CSS Animation Library",
      description: "Collection of reusable CSS animations with React components and utility functions.",
      type: "Open Source",
      technologies: ["React", "CSS", "Storybook", "Jest"],
      links: {
        github: "https://github.com/yourusername/css-animations",
        demo: "https://css-anim.demo.com"
      }
    }
  ]
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-100">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="absolute right-10 top-10">
          <Code className="h-16 w-16 text-zinc-700 float" />
        </div>
        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-white">
          Projects
        </h1>
        <p className="mb-16 text-center text-zinc-400">A showcase of my personal, freelance, and open source work</p>
        
        <div className="space-y-24">
          {/* Personal Projects */}
          <section className="fade-in" style={{ '--delay': '0s' }}>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-300">
              Personal Projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.personal.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          {/* Freelance Projects */}
          <section className="fade-in" style={{ '--delay': '0.2s' }}>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-300">
              Freelance Work
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.freelance.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          {/* Educational Projects */}
          <section className="fade-in" style={{ '--delay': '0.4s' }}>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-300">
              Educational Projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.educational.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          {/* Open Source Projects */}
          <section className="fade-in" style={{ '--delay': '0.6s' }}>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-300">
              Open Source Contributions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.opensource.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}