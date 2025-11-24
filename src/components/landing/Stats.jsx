import { Container } from '../layout/Container';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const stats = [
  { number: '10+', label: 'Years of Experience' },
  { number: '500+', label: 'Projects Done' },
  { number: '9,000+', label: 'Worldwide Clients' },
  { number: '800+', label: 'Positive Reviews' },
];

const floatingIcons = ['💻', '🎨', '⚡', '📱', '🛠️', '🚀', '💡', '🔧'];

export default function Stats({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full ${
          darkMode ? 'bg-primary-500/10' : 'bg-primary-500/5'
        } blur-3xl`} />
      </div>

      <Container>
        <div className="relative z-10">
          {/* Title */}
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 
              className={`font-black leading-tight mb-4 px-4 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 2.5rem)', // 24px - 40px
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Run Your Online Business Smartly with Our Pre-Built Product.
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
              Discover how our pre-built solutions can transform your business operations and accelerate growth.
            </p>
          </div>

          {/* Circular Graphic with Icons */}
          <div 
            ref={ref}
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto mb-12 sm:mb-16"
          >
            {/* Central Circle */}
            <div className={`absolute inset-0 rounded-full flex items-center justify-center futuristic-card ${
              darkMode 
                ? 'bg-slate-800/70 border border-slate-700/50 shadow-2xl' 
                : 'bg-white shadow-2xl border border-gray-200/50'
            }`}>
              <div className="text-center px-4">
                <p className={`text-xs sm:text-sm md:text-base font-black mb-1 ${
                  darkMode ? 'text-primary-400' : 'text-primary-600'
                }`}>
                  Browse
                </p>
                <p className={`text-xs sm:text-sm md:text-base font-black ${
                  darkMode ? 'text-primary-400' : 'text-primary-600'
                }`}>
                  Product
                </p>
              </div>
            </div>

            {/* Floating Icons */}
            {floatingIcons.map((icon, index) => {
              const angle = (index * 360) / floatingIcons.length;
              const radius = 90; // Adjusted for responsive
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
                    animation: `float ${5 + (index % 3)}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  {icon}
                </div>
              );
            })}
          </div>

          {/* Stats Grid - Premium mobile optimized */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="font-black mb-2 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw + 0.5rem, 3rem)', // 28px - 48px
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  className={`font-medium ${
                    darkMode ? 'text-slate-400' : 'text-slate-700'
                  }`}
                  style={{
                    fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 1rem)', // 12px - 16px
                    lineHeight: '1.4',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
