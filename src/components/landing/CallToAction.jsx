import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Play, 
  Star, 
  Users, 
  CheckCircle, 
  Sparkles,
  Rocket,
  Shield
} from 'lucide-react';

const benefits = [
  { icon: CheckCircle, text: 'Free 14-day trial' },
  { icon: Shield, text: 'No credit card required' },
  { icon: Users, text: 'Cancel anytime' },
  { icon: Star, text: '24/7 support included' }
];

const socialProof = [
  { number: '50K+', label: 'Happy Customers' },
  { number: '4.9/5', label: 'Customer Rating' },
  { number: '99.9%', label: 'Uptime SLA' }
];

export default function CallToAction({ darkMode }) {
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
          ? 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
          darkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-blue-400 to-cyan-400'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-128 h-128 rounded-full blur-3xl opacity-20 animate-float animation-delay-2000 ${
          darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-400 to-pink-400'
        }`} />
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 bg-grid opacity-20 ${darkMode ? 'opacity-10' : 'opacity-20'}`} />
      </div>

      <div className="container-custom relative z-10">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Badge - Premium mobile optimized */}
          <div 
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full mb-6 sm:mb-7 md:mb-8 shadow-xl ${
              darkMode ? 'glass-dark glow-primary' : 'glass-light'
            }`}
            style={{
              borderRadius: 'clamp(1.5rem, 3vw + 0.5rem, 2rem)', // 24px - 32px
            }}
          >
            <Sparkles 
              className={`${darkMode ? 'text-cyan-400' : 'text-primary-600'} animate-spin-slow`}
              style={{
                width: 'clamp(1rem, 1.5vw + 0.5rem, 1.25rem)', // 16px - 20px
                height: 'clamp(1rem, 1.5vw + 0.5rem, 1.25rem)',
              }}
            />
            <span 
              className={`font-semibold ${darkMode ? 'text-cyan-400' : 'text-primary-600'}`}
              style={{
                fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
              }}
            >
              Limited Time Offer
            </span>
            <span 
              className="inline-block rounded-full bg-green-500 animate-pulse"
              style={{
                width: 'clamp(0.5rem, 1vw + 0.25rem, 0.5rem)', // 8px
                height: 'clamp(0.5rem, 1vw + 0.25rem, 0.5rem)',
              }}
            />
          </div>

          {/* Main Headline - Premium mobile optimized */}
          <h2 
            className={`mb-6 sm:mb-7 md:mb-8 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            Ready to Transform Your
            <br />
            <span className="text-gradient animate-gradient-x">Business Today?</span>
          </h2>

          {/* Description - Premium mobile typography */}
          <p 
            className={`mb-10 sm:mb-11 md:mb-12 max-w-3xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              lineHeight: '1.6',
            }}
          >
            Join thousands of successful businesses already using our platform to 
            streamline operations, boost productivity, and accelerate growth.
          </p>

          {/* CTA Buttons - Premium mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-10 sm:mb-12">
            <button 
              className="group w-full sm:w-auto bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-4xl relative overflow-hidden"
              style={{
                padding: 'clamp(0.75rem, 2vw + 0.5rem, 1.25rem) clamp(2rem, 4vw + 1rem, 2.5rem)', // 12px-20px vertical, 32px-40px horizontal
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              }}
            >
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <Rocket 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                  style={{
                    width: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)', // 20px - 24px
                    height: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
                  }}
                />
                <span>Start Free Trial</span>
                <ArrowRight 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                  style={{
                    width: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)', // 20px - 24px
                    height: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button 
              className={`group w-full sm:w-auto border-2 font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                darkMode
                  ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 shadow-lg hover:shadow-cyan-400/25'
                  : 'border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white shadow-lg hover:shadow-primary-500/25'
              }`}
              style={{
                padding: 'clamp(0.75rem, 2vw + 0.5rem, 1.25rem) clamp(2rem, 4vw + 1rem, 2.5rem)', // 12px-20px vertical, 32px-40px horizontal
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              }}
            >
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <Play 
                  style={{
                    width: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)', // 20px - 24px
                    height: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
                  }}
                />
                <span>Watch Demo</span>
              </div>
            </button>
          </div>

          {/* Benefits - Premium mobile optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-14 md:mb-16">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                    darkMode ? 'glass-dark' : 'glass-light'
                  }`}
                  style={{
                    borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
                  }}
                >
                  <Icon 
                    className={`flex-shrink-0 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}
                    style={{
                      width: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)', // 20px - 24px
                      height: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
                    }}
                  />
                  <span 
                    className={`font-medium ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                    style={{
                      fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                    }}
                  >
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Social Proof - Premium mobile optimized */}
          <div 
            className={`inline-block p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl ${
              darkMode ? 'glass-dark' : 'glass-light'
            }`}
            style={{
              borderRadius: 'clamp(0.75rem, 2vw + 0.5rem, 1.5rem)', // 12px - 24px
            }}
          >
            <p 
              className={`font-semibold mb-4 sm:mb-5 md:mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
              style={{
                fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
              }}
            >
              Trusted by Industry Leaders Worldwide
            </p>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {socialProof.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className={`font-black mb-1.5 sm:mb-2 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent`}
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)', // 24px - 40px
                    }}
                  >
                    {item.number}
                  </div>
                  <div 
                    className={`font-medium ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                    style={{
                      fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice - Premium mobile optimized */}
          <div 
            className={`mt-8 sm:mt-10 md:mt-12 text-center ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
            style={{
              fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
            }}
          >
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <Shield 
                style={{
                  width: 'clamp(1rem, 1.5vw + 0.5rem, 1rem)', // 16px
                  height: 'clamp(1rem, 1.5vw + 0.5rem, 1rem)',
                }}
              />
              <span>Enterprise-grade security • GDPR compliant • SOC 2 certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
