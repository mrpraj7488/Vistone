import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const achievementIcons = ['🏆', '⭐', '💎', '🎖️', '🌟', '👑', '🏅', '🎗️', '💫', '✨', '🔮', '⚡'];

export default function Achievements({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section data-theme-transition className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900' 
        : 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circular Graphic with Icons */}
        <div className="absolute top-1/2 right-4 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 opacity-20">
          {achievementIcons.map((icon, index) => {
            const angle = (index * 360) / achievementIcons.length;
            const radius = 110; // Adjusted for responsive
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={index}
                className="absolute text-2xl sm:text-3xl md:text-4xl"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animation: `float ${6 + (index % 4)}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                {icon}
              </div>
            );
          })}
        </div>
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Content */}
          <div
            ref={ref}
            className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            } ${darkMode ? '' : 'bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6'}`}
            style={{
              borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
            }}
          >
            <h2 
              className={`font-black leading-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Our Remarkable{' '}
              <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
            <p 
              className={`leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-800'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                lineHeight: '1.6',
              }}
            >
              We have successfully delivered projects to clients worldwide, establishing ourselves as a trusted partner in the digital marketplace industry. Our dedication to excellence has earned us recognition and praise from industry leaders.
            </p>

            {/* CTA Buttons - Premium mobile optimized */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 md:gap-4 pt-3 sm:pt-4">
              <Button 
                variant={darkMode ? 'primary' : 'outline'} 
                size="lg"
                className={`px-6 sm:px-8 font-semibold ${
                  darkMode 
                    ? '!bg-primary-600 !hover:bg-primary-700 !text-white' 
                    : '!bg-white !text-primary-700 border-2 !border-white hover:!bg-white/95 hover:!border-white shadow-lg focus:!ring-white'
                }`}
                style={!darkMode ? {
                  background: '#ffffff',
                  color: '#1e40af',
                  borderColor: '#ffffff',
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                } : {
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)',
                }}
                asChild
              >
                <Link to="/portfolio">
                  View Stats
                </Link>
              </Button>
              <Button 
                variant={darkMode ? 'outline' : 'outline'} 
                size="lg"
                className={`px-6 sm:px-8 font-semibold ${
                  darkMode 
                    ? '!border-white !text-white hover:!bg-white/10' 
                    : 'border-2 !border-white !text-white hover:!bg-white/20 hover:!border-white shadow-lg focus:!ring-white'
                }`}
                style={!darkMode ? {
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                } : {
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)',
                }}
                asChild
              >
                <Link to="/envatomarket">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Visual Placeholder - Premium mobile optimized */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div 
              className={`w-full aspect-square futuristic-card ${
                darkMode 
                  ? 'bg-slate-800/95 border border-slate-700/60 hover:shadow-2xl hover:shadow-primary-500/20' 
                  : 'bg-white/20 backdrop-blur-lg border-2 border-white/30 hover:shadow-2xl hover:shadow-primary-500/20'
              }`}
              style={{
                borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
              }}
            >
              {/* Achievement visualization */}
              <div className="h-full flex items-center justify-center">
                <div 
                  className="opacity-50"
                  style={{
                    fontSize: 'clamp(3rem, 8vw + 1rem, 5rem)', // 48px - 80px
                  }}
                >
                  🏆
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
