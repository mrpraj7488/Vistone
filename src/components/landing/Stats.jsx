import { useEffect, useState, useRef } from 'react';
import { Container } from '../layout/Container';
import { Users, Rocket, Heart, Globe, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const stats = [
  {
    number: 20,
    suffix: '+',
    label: 'Team Members',
    icon: Users,
    gradient: 'from-blue-600 via-indigo-400 to-blue-600',
    shadow: 'shadow-blue-500/20'
  },
  {
    number: 30,
    suffix: '+',
    label: 'Amazing Products',
    icon: Rocket,
    gradient: 'from-purple-600 via-fuchsia-400 to-purple-600',
    shadow: 'shadow-purple-500/20'
  },
  {
    number: 9,
    suffix: 'K+',
    label: 'Happy Clients',
    icon: Heart,
    gradient: 'from-rose-500 via-red-400 to-rose-500',
    shadow: 'shadow-rose-500/20'
  },
  {
    number: 80,
    suffix: '+',
    label: 'Countries Served',
    icon: Globe,
    gradient: 'from-emerald-600 via-teal-400 to-emerald-600',
    shadow: 'shadow-emerald-500/20'
  },
];

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

      setCount(Math.floor(end * easeOutQuart));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`py-12 sm:py-16 lg:py-20 relative overflow-hidden ${darkMode
      ? 'bg-slate-900'
      : 'bg-slate-50'
      }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh Base */}
        <div className={`absolute inset-0 ${darkMode
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-black'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100'
          }`} />

        {/* Moving Grid with Radial Mask */}
        <div className={`absolute inset-0 opacity-[0.15] ${darkMode ? 'bg-grid-white/[0.1]' : 'bg-grid-black/[0.1]'
          }`}
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}>
          <div className="absolute inset-0 animate-move duration-[20s]" style={{
            backgroundImage: `linear-gradient(to right, ${darkMode ? '#6366f1' : '#3b82f6'} 1px, transparent 1px),
                             linear-gradient(to bottom, ${darkMode ? '#6366f1' : '#3b82f6'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Twinkling Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute rounded-full animate-twinkle ${darkMode ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}

        {/* Shooting Star */}
        <div className={`absolute top-0 right-0 w-[300px] h-[1px] rotate-[315deg] animate-shooting-star opacity-0 ${darkMode
          ? 'bg-gradient-to-r from-transparent via-white to-transparent'
          : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
          }`} style={{
            top: '20%',
            right: '10%',
            animationDelay: '2s',
            animationDuration: '7s',
          }} />

        <div className={`absolute top-0 right-0 w-[200px] h-[1px] rotate-[315deg] animate-shooting-star opacity-0 ${darkMode
          ? 'bg-gradient-to-r from-transparent via-indigo-300 to-transparent'
          : 'bg-gradient-to-r from-transparent via-blue-400 to-transparent'
          }`} style={{
            top: '40%',
            right: '20%',
            animationDelay: '5s',
            animationDuration: '8s',
          }} />

        {/* Ambient Glow Blobs */}
        <div className={`absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full mix-blend-screen filter blur-[60px] sm:blur-[100px] opacity-20 animate-blob ${darkMode ? 'bg-indigo-600' : 'bg-blue-300'
          }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full mix-blend-screen filter blur-[60px] sm:blur-[100px] opacity-20 animate-blob animation-delay-2000 ${darkMode ? 'bg-purple-600' : 'bg-purple-300'
          }`} />
      </div>

      <Container>
        {/* Section Title */}
        <div
          ref={ref}
          className={`text-center mb-10 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 animate-pulse ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`} />
            <span className={`text-xs sm:text-sm font-bold tracking-widest uppercase ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`}>
              Our Growth
            </span>
            <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 animate-pulse ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`} />
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r ${darkMode
            ? 'from-white via-indigo-200 to-slate-400'
            : 'from-slate-900 via-blue-800 to-slate-600'
            } bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]`}>
            Vistone at A Glance
          </h2>

          <div className={`h-1.5 mx-auto rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 delay-500 ${isVisible ? 'w-24 sm:w-32 opacity-100' : 'w-0 opacity-0'
            }`} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon - Subtle and clean */}
              <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${darkMode ? 'bg-slate-800/50' : 'bg-white/60'
                }`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
              </div>

              {/* Number - Big and Bold with Shine */}
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-1 sm:mb-2 tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent animate-text-shimmer`}>
                <CountUp end={stat.number} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className={`font-medium text-xs sm:text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
