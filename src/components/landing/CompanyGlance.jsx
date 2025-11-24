import { Container } from '../layout/Container';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Trophy, Users, Briefcase, Globe } from 'lucide-react';

const stats = [
  { number: '20+', label: 'Team Members', icon: Users },
  { number: '30+', label: 'Amazing Products', icon: Briefcase },
  { number: '9K+', label: 'Happy Clients', icon: Users },
  { number: '80+', label: 'Countries Served', icon: Globe },
];

export default function CompanyGlance({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50'
    }`}>
      {/* Background Wave Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <svg className="absolute bottom-0 w-full h-32 sm:h-48 md:h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            className="sine-wave"
            fill={darkMode ? '#60a5fa' : '#3b82f6'} 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <Container>
        <div className="relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
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
              Vistone at <span className="text-gradient-gamified">A Glance</span>
            </h2>
          </div>

          {/* Stats Grid - Premium mobile optimized */}
          <div 
            ref={ref}
            className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-2 futuristic-card group ${
                    darkMode 
                      ? 'bg-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20' 
                      : 'bg-white/98 border-2 border-gray-200/80 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
                  }}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-white`} />
                  </div>
                  <div 
                    className="font-black mb-2 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)', // 24px - 40px
                    }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className={`font-medium leading-tight ${
                      darkMode ? 'text-slate-400' : 'text-slate-700'
                    }`}
                    style={{
                      fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                      lineHeight: '1.4',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
