import { Container } from '../layout/Container';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const technologies = [
  { name: 'Laravel', logo: '⚡' },
  { name: 'React', logo: '⚛️' },
  { name: 'Vue', logo: '💚' },
  { name: 'Angular', logo: '🅰️' },
  { name: 'Node.js', logo: '🟢' },
  { name: 'PHP', logo: '🐘' },
  { name: 'MySQL', logo: '🗄️' },
  { name: 'AWS', logo: '☁️' },
  { name: 'Google Cloud', logo: '☁️' },
  { name: 'Figma', logo: '🎨' },
  { name: 'HTML5', logo: '🌐' },
  { name: 'CSS3', logo: '💅' },
  { name: 'JavaScript', logo: '📜' },
  { name: 'Flutter', logo: '💙' },
  { name: 'Dart', logo: '🎯' },
  { name: 'Android', logo: '🤖' },
  { name: 'iOS', logo: '🍎' },
  { name: 'Git', logo: '📦' },
  { name: 'Adobe XD', logo: '🎨' },
  { name: 'Sketch', logo: '✏️' },
];

export default function TechStack({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-white via-gray-50/50 to-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-5 ${
          darkMode ? 'bg-primary-500/20' : 'bg-primary-500/10'
        }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 relative z-10 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 
            className={`font-black mb-4 leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="text-gradient-gamified">Technology</span> We Use
          </h2>
          <p 
            className={`max-w-3xl mx-auto px-4 leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              lineHeight: '1.6',
            }}
          >
            Our Developers have a Strong Grip on Advanced Technologies to Enhance Your Website & App.
          </p>
        </div>

        {/* Technology Grid - Premium mobile optimized */}
        <div 
          ref={ref}
          className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2.5 sm:gap-3 md:gap-4 transition-all duration-1000 delay-300 relative z-10 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {technologies.map((tech, index) => (
            <TechCard key={index} tech={tech} index={index} darkMode={darkMode} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function TechCard({ tech, index, darkMode }) {
  return (
    <div
      className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl text-center transition-all duration-300 hover:-translate-y-2 cursor-pointer futuristic-card group ${
        darkMode 
          ? 'bg-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-xl hover:shadow-primary-500/20' 
          : 'bg-white/98 border-2 border-gray-200/80 hover:border-primary-500/60 hover:shadow-xl hover:shadow-primary-500/20'
      }`}
      style={{ 
        transitionDelay: `${index * 30}ms`,
        borderRadius: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)', // 8px - 12px
      }}
    >
      <div 
        className="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform duration-300"
        style={{
          fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 1.875rem)', // 20px - 30px
        }}
      >
        {tech.logo}
      </div>
      <div 
        className={`font-semibold leading-tight ${
          darkMode ? 'text-slate-300' : 'text-slate-700'
        }`}
        style={{
          fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
        }}
      >
        {tech.name}
      </div>
    </div>
  );
}
