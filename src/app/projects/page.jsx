const projects = {
  personal: [
    {
      title: "AI Code Assistant",
      description: "A real-time code completion and suggestion tool powered by machine learning, helping developers write better code faster.",
      type: "Personal",
      technologies: ["Next.js", "OpenAI", "Python", "TensorFlow"],
      links: {
        github: "https://github.com/yourusername/ai-code-assistant",
        demo: "https://ai-code.demo.com",
      },
    },
    {
      title: "Smart Home Dashboard",
      description: "A centralized dashboard for monitoring and controlling IoT devices, with real-time updates and automation capabilities.",
      type: "Personal",
      technologies: ["React", "Node.js", "MQTT", "WebSockets"],
      links: {
        github: "https://github.com/yourusername/smart-home",
        demo: "https://smart-home.demo.com",
      },
    },
    {
      title: "Crypto Portfolio Tracker",
      description: "Track and analyze cryptocurrency investments with real-time price updates, portfolio analytics, and trading history.",
      type: "Personal",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "CoinGecko API"],
      links: {
        github: "https://github.com/yourusername/crypto-tracker",
        demo: null, // Missing demo handled gracefully
      },
    },
  ],
  freelance: [
    {
      title: "Restaurant Management System",
      description: "Full-stack solution for restaurant operations including order management, inventory tracking, and staff scheduling.",
      type: "Freelance",
      technologies: ["Next.js", "PostgreSQL", "Prisma", "Redis"],
      links: {
        demo: "https://restaurant-sys.demo.com",
        github: null, // Missing GitHub handled gracefully
      },
    },
  ],
};

export default function getProjects() {
  // Simply return the `projects` object for use elsewhere
  return projects;
}
