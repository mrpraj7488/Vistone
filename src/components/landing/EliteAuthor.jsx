import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Award } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

export default function EliteAuthor({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900' 
        : 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-white/20' : 'bg-white/30'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-accent-500/20' : 'bg-accent-500/30'
        }`} />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center relative z-10">
          {/* Left Content - Badge - Premium mobile optimized */}
          <div 
            ref={ref}
            className={`flex justify-center lg:justify-start transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative">
              <div 
                className="rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-2xl"
                style={{
                  width: 'clamp(10rem, 25vw + 2rem, 16rem)', // 160px - 256px
                  height: 'clamp(10rem, 25vw + 2rem, 16rem)',
                  animation: 'float 7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                <Award 
                  className="text-white" 
                  style={{
                    width: 'clamp(4rem, 10vw + 1rem, 8rem)', // 64px - 128px
                    height: 'clamp(4rem, 10vw + 1rem, 8rem)',
                  }}
                />
              </div>
              <div 
                className={`absolute rounded-full opacity-80 animate-pulse ${
                  darkMode ? 'bg-accent-500' : 'bg-accent-400'
                }`}
                style={{
                  width: 'clamp(3rem, 8vw + 1rem, 6rem)', // 48px - 96px
                  height: 'clamp(3rem, 8vw + 1rem, 6rem)',
                  bottom: 'clamp(-0.5rem, -1vw, -1rem)',
                  right: 'clamp(-0.5rem, -1vw, -1rem)',
                  animation: 'float 5s cubic-bezier(0.4, 0, 0.6, 1) infinite, pulse 2s ease-in-out infinite',
                  animationDelay: '0.5s',
                }}
              />
            </div>
          </div>

          {/* Right Content - Premium mobile spacing */}
          <div className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h2 
              className={`font-black leading-tight text-white`}
              style={{
                fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              We are a proud <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">Elite Author</span> in Codecanyon
            </h2>
            <p 
              className={`leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-white/90'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                lineHeight: '1.6',
              }}
            >
              With over 10+ years of experience in the digital marketplace, we have served more than 100,000+ customers worldwide. Our commitment to excellence has earned us the Elite Author status on Codecanyon.
            </p>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4">
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
                aria-label="View Portfolio"
                asChild
              >
                <Link to="/portfolio">
                  View Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
