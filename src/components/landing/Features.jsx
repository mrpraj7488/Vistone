import { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Globe,
  Lock,
  Cloud,
  Cpu
} from 'lucide-react';
import { Container } from '../layout/Container';

const features = [];

const coreFeatures = [
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Scalable cloud infrastructure that grows with your business'
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Advanced security measures to protect your sensitive data'
  },
  {
    icon: Cpu,
    title: 'AI-Powered',
    description: 'Intelligent automation and AI-driven insights'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serve customers worldwide with multi-region deployment'
  }
];

export default function Features({ darkMode }) {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`section-padding relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
          : 'bg-gradient-to-br from-white via-gray-50/50 to-white'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-10 ${
          darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-purple-400'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-10 ${
          darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-cyan-400 to-blue-400'
        }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 relative z-10 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-semibold ${
            darkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-500/10 text-blue-600'
          }`}>
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Why Choose Us</span>
          </div>
          
          <h2 
            className={`font-black mb-4 sm:mb-6 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            Powerful <span className="text-gradient-gamified">Features</span> That
            <br className="hidden sm:block" /> Drive Your Success
          </h2>
          
          <p 
            className={`max-w-3xl mx-auto px-4 ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              lineHeight: '1.6',
            }}
          >
            Everything you need to build, scale, and optimize your business 
            with cutting-edge technology and enterprise-grade features.
          </p>
        </div>

        {/* Core Features Grid - Premium 2-column mobile layout */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-300 relative z-10 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {coreFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className={`text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group futuristic-card ${
                  darkMode ? 'bg-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20' : 'bg-white/98 border-2 border-gray-200/80 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20'
                }`}
                style={{
                  borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
                }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 
                  className={`font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{
                    fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className={`leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                  style={{
                    fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                    lineHeight: '1.5',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
