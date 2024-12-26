import Image from 'next/image';

export async function generateMetadata() {
  return {
    title: 'About Me',
    description: 'Learn more about my skills in UX design, UI design, full stack development, and more.',
    keywords: ['UX Design', 'UI Design', 'Full Stack Development', 'Systems Design', 'Brand Strategy'],
  };
}

export default function About() {
  const skills = [
    'User Research',
    'Digital Strategy',
    'Design Systems',
    'Product Strategy',
    'Brand Strategy',
    'Operations',
  ];

  return (
    <section className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center space-y-8 mb-16">
          <span className="text-gray-500 uppercase tracking-wider text-sm">
            SYNOPSIS
          </span>

          <h1 className="text-6xl font-bold text-gray-200 mb-12">
            About Me
          </h1>

          <p className="max-w-4xl mx-auto text-gray-400 font-mono leading-relaxed text-lg">
            With a diverse skill set that includes UX design, UI design, full stack development, operational
            architecture, systems design, photography, and branding, I am a well-rounded digital professional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Image Section */}
          <div className="relative rounded-3xl overflow-hidden group">

            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/placeholder.svg"
              alt="Profile"
              width={800}
              height={600}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Cards Section */}
          <div className="space-y-8">
            {/* Softskills Card */}

            <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300">
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
                  <h2 className="text-2xl font-semibold text-gray-200">Softskills that pay the bills</h2>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  In addition to my design and technical expertise—I also have strong leadership,
                  time management, and multitasking skills—honed through my experience as a business
                  owner / managing partner, husband, and father of two. Outside of work, I enjoy
                  staying active through sports such as hockey and snowboarding. I am confident in
                  my ability to bring passion and value to any project.
                </p>
              </div>
            </div>

            {/* Research Card */}

            <div className="bg-zinc-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300">
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
                  <h2 className="text-2xl font-semibold text-gray-200">Research and planning</h2>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  One of my favorite aspects of creating is planning the architecture of a project.
                  From Design Systems to Brand Strategy—I enjoy working with the many touch points of user experience.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <div
                        key={skill}

                        className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3 hover:bg-zinc-700 hover:text-teal-400 transition-all duration-300"
                      >
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
                    ))
                  ) : (
                    <p className="text-gray-400">No skills listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}