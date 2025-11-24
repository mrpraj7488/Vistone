import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Star } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const testimonial = {
  name: 'Pramod Kumar Sahu',
  role: 'Software Developer',
  avatar: '👤',
  rating: 5,
  quote: 'Excellent service and support! The products are high quality and the team is very responsive. Highly recommended!',
  company: 'Tech Solutions Inc.',
};

const avatars = ['👨', '👩', '🧑'];

export default function Testimonials({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-white via-gray-50/50 to-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-5 ${
          darkMode ? 'bg-accent-500/20' : 'bg-accent-500/10'
        }`} />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center relative z-10">
          {/* Left Content */}
          <div 
            ref={ref}
            className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Rating Badges - Premium mobile optimized */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div 
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg futuristic-card ${
                  darkMode ? 'bg-slate-800/95 border border-slate-700/60 hover:shadow-lg hover:shadow-primary-500/10' : 'bg-white/98 border-2 border-gray-200/80 hover:shadow-lg hover:shadow-primary-500/10'
                }`}
                style={{
                  borderRadius: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)', // 8px - 12px
                }}
              >
                <span 
                  className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}
                  style={{
                    fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                  }}
                >
                  envato
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div 
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg futuristic-card ${
                  darkMode ? 'bg-slate-800/95 border border-slate-700/60 hover:shadow-lg hover:shadow-primary-500/10' : 'bg-white/98 border-2 border-gray-200/80 hover:shadow-lg hover:shadow-primary-500/10'
                }`}
                style={{
                  borderRadius: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)', // 8px - 12px
                }}
              >
                <span 
                  className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}
                  style={{
                    fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                  }}
                >
                  Google
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

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
              Happy Client <span className="text-gradient-gamified">Feedbacks</span>
            </h2>
            <p 
              className={`leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                lineHeight: '1.6',
              }}
            >
              See what other people have said about our work! We value our clients and their feedback drives us to deliver excellence.
            </p>

            <Button
              variant="primary"
              size="lg"
              className={`px-6 sm:px-8 font-semibold ${
                darkMode 
                  ? '' 
                  : '!bg-primary-600 !hover:bg-primary-700 !text-white !shadow-lg hover:!shadow-xl focus:!ring-primary-500'
              }`}
              style={!darkMode ? {
                background: '#2563eb',
                color: '#ffffff',
                fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              } : {
                fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)',
              }}
              aria-label="See More Feedback"
              asChild
            >
              <Link to="/testimonials">
                See More Feedback
              </Link>
            </Button>
          </div>

          {/* Right Content - Testimonial Card */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            {/* Testimonial Card - Premium mobile optimized */}
            <Card 
              className={`p-4 sm:p-6 md:p-8 futuristic-card ${
                darkMode 
                  ? 'bg-slate-800/95 border border-slate-700/60 hover:shadow-2xl hover:shadow-primary-500/20' 
                  : 'bg-white/98 border-2 border-gray-200/80 hover:shadow-2xl hover:shadow-primary-500/20'
              }`}
              style={{
                borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
              }}
            >
              {/* Avatar Stack - Premium mobile sizing */}
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div 
                  className={`rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg`}
                  style={{
                    width: 'clamp(2.5rem, 4vw + 0.5rem, 4rem)', // 40px - 64px
                    height: 'clamp(2.5rem, 4vw + 0.5rem, 4rem)',
                    fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2rem)', // 20px - 32px
                  }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 
                    className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    style={{
                      fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.25rem)', // 16px - 20px
                    }}
                  >
                    {testimonial.name}
                  </h3>
                  <p 
                    className={`${darkMode ? 'text-slate-400' : 'text-slate-700'}`}
                    style={{
                      fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                    }}
                  >
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Rating - Premium mobile sizing */}
              <div className="flex items-center gap-0.5 sm:gap-1 mb-2.5 sm:mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote - Premium mobile typography */}
              <p 
                className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                  lineHeight: '1.6',
                }}
              >
                "{testimonial.quote}"
              </p>
            </Card>

            {/* Floating Avatars - Premium mobile optimized */}
            <div className="absolute -right-1.5 sm:-right-2 md:-right-4 top-4 sm:top-6 md:top-8 flex flex-col gap-1.5 sm:gap-2 md:gap-3">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center border-2 shadow-lg ${
                    darkMode ? 'border-slate-700' : 'border-white'
                  }`}
                  style={{
                    width: 'clamp(2rem, 3vw + 0.5rem, 3rem)', // 32px - 48px
                    height: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
                    fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.25rem)', // 16px - 20px
                    animation: `float ${5 + index}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: `${index * 0.4}s`,
                  }}
                >
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
