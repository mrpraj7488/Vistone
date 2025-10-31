const technologies = [
  { name: 'PHP', icon: '🐘', category: 'Backend' },
  { name: 'Laravel', icon: '🔶', category: 'Backend' },
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Supabase', icon: '⚡', category: 'Database' },
  { name: 'Stripe', icon: '💳', category: 'Payment' },
  { name: 'Tailwind', icon: '🎨', category: 'CSS' },
  { name: 'Next.js', icon: '▲', category: 'Framework' },
  { name: 'Figma', icon: '🎨', category: 'Design' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'GitHub', icon: '🐙', category: 'Version Control' },
  { name: 'MySQL', icon: '🐬', category: 'Database' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'Redis', icon: '🔴', category: 'Cache' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'Vue.js', icon: '💚', category: 'Frontend' },
  { name: 'TypeScript', icon: '📘', category: 'Language' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
];

export default function TechStack({ darkMode }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Technology We Use
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Cutting-edge tools and frameworks for robust solutions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 group cursor-pointer ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className={`text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                {tech.icon}
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tech.name}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tech.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
