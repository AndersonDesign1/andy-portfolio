import Image from 'next/image';
import Skills from '@/components/ui/skills';

export async function generateMetadata() {
  return {
    title: "About Anderson Joseph | Web Development & SEO Expertise",
    description: "Learn about Anderson Joseph, a skilled web developer and SEO specialist with a proven track record of boosting website performance, traffic, and revenue for businesses.",
    url: "https://andersonjoseph.com/about",
    content: "About Anderson Joseph | Full Stack Web Developer, SEO Specialist, and Digital Strategist.",
    keywords: "About Anderson Joseph, Full Stack Developer, SEO Expert, Digital Marketing Strategist, Web Performance",
    
  };
}

export default function About() {
  const researchSkills = [
    'SEO Strategy',
    'Content Optimization',
    'Performance Analysis',
    'Digital Marketing',
  ];

  return (
    <section className="w-full min-h-screen bg-black text-white relative overflow-hidden pt-24">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-6xl font-bold text-gray-200 mb-12">About Me</h1>
          <p className="max-w-4xl mx-auto text-gray-400 font-mono leading-relaxed text-lg">
            I am a results-driven professional with expertise in SEO, web development, and digital marketing. Over the years, I have helped businesses achieve up to 300% increases in website traffic, top Google rankings, and higher engagement metrics by crafting strategies that work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Image Section */}
          <div className="relative rounded-3xl overflow-hidden group h-[700px]">
            <div className="absolute inset-0 bg-linear-to-r from-teal-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/Anderson Joseph.jpg"
              alt="Profile"
              width={1200}          // Increased from 800
              height={1400}         // Increased from 750
              quality={100}         // Added quality parameter
              priority              // Added priority loading
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"  // Added responsive sizes
            />
          </div>

          {/* Cards Section */}
          <div className="space-y-8">
            {/* Softskills Card */}
            <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20.4 3.6a3.5 3.5 0 00-5 0l-2 2a1 1 0 000 1.4l3.6 3.6a1 1 0 001.4 0l2-2a3.5 3.5 0 000-5zm-9.2 9.2l-5.5 5.5a1 1 0 001.4 1.4l5.5-5.5a1 1 0 00-1.4-1.4z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-200">Softskills that drive success</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Beyond technical expertise, I excel in leadership, time management, and collaboration—skills honed through leading projects and training over 1000 aspiring tech enthusiasts in various tech skills. My passion for empowering others fuels my dedication to creating impactful solutions.
                </p>
              </div>
            </div>

            {/* Research Card */}
            <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-200">Research and strategy</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  From in-depth keyword research to crafting targeted SEO strategies, I thrive in planning and executing projects that elevate brands. My expertise spans performance optimization, content strategy, and user engagement techniques.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {researchSkills.map((skill) => (
                    <div
                      key={skill}
                      className="relative bg-zinc-900/50 rounded-3xl p-6 border border-gray-800/50 hover:bg-zinc-800/50 hover:border-white/50 hover:text-teal-400 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 transform -skew-x-12 bg-zinc-800/20 z-0 pointer-events-none" />
                      <div className="relative z-10 flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-teal-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                        </svg>
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Component */}
        <div className="mt-16 bg-transparent **:bg-transparent">
          <Skills />
        </div>
      </div>
    </section>
  );
}