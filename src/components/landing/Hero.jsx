import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ArrowRight, Play, Store, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import BlurText from './BlurText';
import Aurora from './Aurora';
import GradientText from './GradientText';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const stats = [
  { number: '10+', label: 'Years Experience' },
  { number: '500+', label: 'Happy Clients' },
  { number: '9K+', label: 'Projects Done' },
];

// Floating icons configuration with improved positioning and responsive values
const getFloatingIcons = (isMobile = false) => [
  { 
    icon: Store, 
    title: 'Dashboard', 
    value: '$49', 
    position: isMobile ? { top: '5%', right: '5%' } : { top: '8%', right: '8%' }, 
    delay: '0.5s', 
    duration: 6,
    color: 'from-blue-500 to-cyan-500',
    zIndex: 20,
  },
  { 
    icon: ShoppingBag, 
    title: 'UI Kit', 
    value: '$79', 
    position: isMobile ? { bottom: '10%', left: '5%' } : { bottom: '12%', left: '8%' }, 
    delay: '1s', 
    duration: 7,
    color: 'from-purple-500 to-pink-500',
    zIndex: 19,
  },
  { 
    icon: Zap, 
    title: 'Plugin', 
    value: '$29', 
    position: isMobile ? { top: '35%', left: '0%' } : { top: '38%', left: '2%' }, 
    delay: '1.5s', 
    duration: 8,
    color: 'from-orange-500 to-red-500',
    zIndex: 18,
  },
];

// Blur Word Component for individual words with blur effect
const BlurWord = ({ word, delay, index, darkMode, isGradient = false, gradientColors }) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInView(true);
    }, 100 + (index * delay));
    return () => clearTimeout(timer);
  }, [index, delay]);

  const defaultFrom = { filter: 'blur(10px)', opacity: 0, y: -50 };
  const defaultTo = [
    { filter: 'blur(5px)', opacity: 0.5, y: 5 },
    { filter: 'blur(0px)', opacity: 1, y: 0 }
  ];

  const animateKeyframes = {
    filter: [defaultFrom.filter, defaultTo[0].filter, defaultTo[1].filter],
    opacity: [defaultFrom.opacity, defaultTo[0].opacity, defaultTo[1].opacity],
    y: [defaultFrom.y, defaultTo[0].y, defaultTo[1].y]
  };

  const content = isGradient ? (
    <GradientText
      colors={gradientColors}
      animationSpeed={3}
      showBorder={false}
      className="inline-block align-baseline font-black"
    >
      {word}
    </GradientText>
  ) : (
    <span 
      className={`font-black inline-block ${
        darkMode 
          ? 'text-white' 
          : 'text-slate-900'
      }`}
      style={{
        color: darkMode ? '#ffffff' : '#0f172a',
      }}
    >
      {word}
    </span>
  );

  return (
    <motion.span
      className="inline-block will-change-[transform,filter,opacity]"
      initial={defaultFrom}
      animate={inView ? animateKeyframes : defaultFrom}
      transition={{
        duration: 0.7,
        times: [0, 0.5, 1],
        delay: (index * delay) / 1000,
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{ 
        fontSize: 'inherit', 
        lineHeight: 'inherit', 
        fontWeight: 'inherit'
      }}
    >
      {content}
    </motion.span>
  );
};

// Stats Card Component with optimized typography
const StatCard = ({ stat, index, darkMode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
    className={`text-left px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-xl transition-all duration-300 backdrop-blur-sm ${
      darkMode 
        ? 'bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800/80 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10' 
        : 'bg-white/70 border border-gray-200/60 hover:bg-white/90 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10'
    }`}
  >
    <div 
      className={`font-black mb-0.5 sm:mb-1 leading-none ${
        darkMode 
          ? 'text-blue-400' 
          : 'bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent'
      }`}
      style={{
        fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)', // 24px - 40px
      }}
    >
      {stat.number}
    </div>
    <div 
      className={`font-semibold tracking-wide ${
        darkMode 
          ? 'text-slate-300' 
          : 'text-slate-600'
      }`}
      style={{
        fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 0.875rem)', // 12px - 14px
        lineHeight: '1.4',
      }}
    >
      {stat.label}
    </div>
  </motion.div>
);

// Trust Badge Component with optimized typography
const TrustBadge = ({ darkMode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="flex flex-wrap items-center gap-2.5 sm:gap-3 md:gap-4"
  >
    <div className="flex -space-x-2 sm:-space-x-2.5 md:-space-x-3">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + (i * 0.1), duration: 0.3 }}
          className={`rounded-full border-2 ${
            darkMode ? 'border-slate-700' : 'border-white'
          } bg-gradient-to-br from-primary-400 to-purple-500 shadow-lg`}
          style={{
            width: 'clamp(2rem, 2.5vw + 0.5rem, 2.5rem)', // 32px - 40px
            height: 'clamp(2rem, 2.5vw + 0.5rem, 2.5rem)',
          }}
        />
      ))}
    </div>
    <div className="text-left">
      <p 
        className={`font-bold ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}
        style={{
          fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1rem)', // 14px - 16px
          lineHeight: '1.4',
        }}
      >
        2000+ Developers
      </p>
      <p 
        className={`font-medium ${
          darkMode ? 'text-slate-300' : 'text-slate-600'
        }`}
        style={{
          fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
          lineHeight: '1.5',
        }}
      >
        Trust Vistone
      </p>
    </div>
  </motion.div>
);

// Main Floating Card Component with beautiful enhanced design
const MainFloatingCard = ({ darkMode, isVisible, isMobile }) => {
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      y.set(Math.sin(time * 0.5) * 15);
      rotate.set(Math.sin(time * 0.3) * 2);
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [isVisible, y, rotate]);

  const springY = useSpring(y, { stiffness: 50, damping: 20 });
  const springRotate = useSpring(rotate, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={isVisible ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        y: isVisible ? springY : 0,
        rotate: isVisible ? springRotate : 0,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-3/4 aspect-[4/3] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 z-30 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 border border-slate-700/60 shadow-2xl shadow-blue-500/20'
          : 'bg-gradient-to-br from-white/98 via-blue-50/30 to-white/98 border-2 border-blue-200/60 shadow-2xl shadow-blue-500/30'
      } backdrop-blur-xl`}
    >
      {/* Glowing border effect */}
      <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-50 blur-xl'
          : 'bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 opacity-40 blur-xl'
      }`} />
      
      <div className="w-full h-full bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
        
        {/* Radial gradient glow */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle at center, rgba(96, 165, 250, 0.3), transparent 70%)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4), transparent 70%)'
          }}
        />
        
        <motion.div 
          className="text-white text-4xl sm:text-5xl md:text-6xl font-black drop-shadow-2xl relative z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
          }}
        >
          V
        </motion.div>
        
        {/* Subtle shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        />
        
        {/* Corner accent lights */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full blur-sm animate-pulse" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-300/60 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </motion.div>
  );
};

// Floating Product Card Component with beautiful enhanced design
const FloatingProductCard = ({ item, index, darkMode, isVisible, isMobile, mousePosition }) => {
  const Icon = item.icon;
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const offset = index * 0.3;
      y.set(Math.sin(time * (0.4 + offset)) * 12);
      x.set(Math.cos(time * (0.3 + offset)) * 5);
    }, 16);
    
    return () => clearInterval(interval);
  }, [isVisible, index, y, x]);

  // Parallax effect based on mouse position
  useEffect(() => {
    if (!mousePosition || !isVisible) return;
    
    const parallaxX = (mousePosition.x - 0.5) * 10;
    const parallaxY = (mousePosition.y - 0.5) * 10;
    
    x.set(parallaxX * (0.3 + index * 0.1));
    y.set(parallaxY * (0.3 + index * 0.1));
  }, [mousePosition, index, isVisible, x, y]);

  const springY = useSpring(y, { stiffness: 100, damping: 25 });
  const springX = useSpring(x, { stiffness: 100, damping: 25 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: -20 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0 }}
      transition={{ 
        delay: 0.5 + (index * 0.15), 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{
        ...item.position,
        x: isVisible ? springX : 0,
        y: isVisible ? springY : 0,
        zIndex: item.zIndex || 20 - index,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        width: 'auto',
        minWidth: isMobile ? '100px' : '110px',
        maxWidth: isMobile ? '130px' : '140px',
      }}
      className={`absolute rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:scale-110 hover:z-50 group ${
        darkMode
          ? 'bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 border border-slate-700/60 shadow-xl shadow-slate-900/50 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/30'
          : 'bg-gradient-to-br from-white/98 via-blue-50/40 to-white/98 border-2 border-blue-200/60 shadow-xl shadow-blue-500/20 hover:border-primary-500/80 hover:shadow-2xl hover:shadow-primary-500/40'
      } backdrop-blur-xl`}
    >
      {/* Glowing border effect on hover */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 blur-lg'
          : 'bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-cyan-400/40 blur-lg'
      }`} />
      
      {/* Icon container with enhanced styling */}
      <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl ${
        darkMode ? 'shadow-blue-500/30' : 'shadow-blue-500/40'
      }`}>
        {/* Icon glow effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-50 blur-md group-hover:opacity-75 transition-opacity`} />
        <Icon size={20} className="sm:w-6 sm:h-6 text-white drop-shadow-lg relative z-10" />
      </div>
      
      {/* Title with better contrast */}
      <div className={`text-xs sm:text-sm font-bold mb-1 relative z-10 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {item.title}
      </div>
      
      {/* Price with enhanced gradient */}
      <div className={`text-base sm:text-lg font-black relative z-10 ${
        darkMode
          ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent'
      }`}>
        {item.value}
      </div>
      
      {/* Subtle shine effect */}
      <motion.div 
        className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default function Hero({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef(null);
  
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: visualRef, isVisible: isVisualVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Mouse parallax effect
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || reduceMotion) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, [reduceMotion]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  // Memoize gradient colors
  const gradientColors = useMemo(() => 
    darkMode 
      ? ["#60a5fa", "#34d399", "#60a5fa", "#34d399", "#60a5fa"]
      : ["#2563eb", "#7c3aed", "#2563eb", "#7c3aed", "#2563eb"],
    [darkMode]
  );

  // Layered radial accents for light theme
  const lightBackgroundLayers = useMemo(() => [
    'radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.25), transparent 40%)',
    'radial-gradient(circle at 85% 0%, rgba(129, 140, 248, 0.22), transparent 46%)',
    'radial-gradient(circle at 20% 85%, rgba(196, 181, 253, 0.18), transparent 50%)'
  ].join(','), []);

  // All words in sequence
  const allWords = useMemo(() => [
    { text: 'We', gradient: false },
    { text: 'Are', gradient: false },
    { text: 'Here', gradient: false },
    { text: 'To', gradient: false },
    { text: 'Help', gradient: false },
    { text: 'Your', gradient: false },
    { text: 'Business', gradient: true },
    { text: 'To', gradient: false },
    { text: 'Innovate', gradient: true },
    { text: 'And', gradient: false },
    { text: 'Grow', gradient: false },
  ], []);

  const floatingIcons = useMemo(() => getFloatingIcons(isMobile), [isMobile]);
  
  // Optimize particle count based on screen size and motion preference
  const particleCount = useMemo(() => {
    if (reduceMotion) return 0;
    if (isMobile) return 6;
    return 12;
  }, [isMobile, reduceMotion]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-24 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50'
      }`}
      aria-label="Hero section"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Light theme radial gradients */}
        {!darkMode && (
          <div
            className="absolute inset-0 pointer-events-none opacity-80"
            aria-hidden="true"
            style={{
              backgroundImage: lightBackgroundLayers,
              backgroundSize: '140% 140%',
              backgroundPosition: 'center'
            }}
          />
        )}

        {/* Aurora Background */}
        <Aurora
          colorStops={darkMode ? ["#3A29FF", "#FF94B4", "#FF3232"] : ["#c7d2fe", "#e0f2fe", "#f5f3ff"]}
          blend={darkMode ? 0.5 : 0.32}
          amplitude={darkMode ? 1.0 : 0.35}
          speed={darkMode ? 0.5 : 0.25}
        />

        {/* Animated Gradient Orbs */}
        <div
          className={`absolute top-[18%] left-[12%] hidden sm:block rounded-full blur-3xl ${
            darkMode
              ? 'bg-indigo-600/25 shadow-[0_0_80px_rgba(58,41,255,0.3)]'
              : 'bg-sky-400/20 shadow-[0_0_50px_rgba(100,200,255,0.25)]'
          }`}
          style={{
            animation: 'float 8s cubic-bezier(0.37, 0, 0.63, 1) infinite',
            width: 'clamp(10rem, 28vw, 22rem)',
            height: 'clamp(10rem, 28vw, 22rem)'
          }}
          aria-hidden="true"
        />
        <div
          className={`absolute bottom-[18%] right-[12%] hidden md:block rounded-full blur-3xl ${
            darkMode
              ? 'bg-pink-500/20 shadow-[0_0_80px_rgba(255,148,180,0.25)]'
              : 'bg-cyan-300/18 shadow-[0_0_50px_rgba(34,211,238,0.2)]'
          }`}
          style={{
            animation: 'float 10s cubic-bezier(0.37, 0, 0.63, 1) infinite',
            animationDelay: '1s',
            width: 'clamp(11rem, 30vw, 24rem)',
            height: 'clamp(11rem, 30vw, 24rem)'
          }}
          aria-hidden="true"
        />

        {/* Grid Pattern */}
        <div 
          className={`absolute inset-0 bg-grid ${
            darkMode ? 'opacity-[0.08]' : 'opacity-[0.04]'
          }`}
          aria-hidden="true"
        />

        {/* Optimized Particle Effects */}
        {particleCount > 0 && (
          <div className="absolute inset-0" aria-hidden="true">
            {[...Array(particleCount)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  darkMode ? 'bg-primary-400/40' : 'bg-primary-400/40'
                }`}
                style={{
                  left: `${10 + (i * (90 / particleCount))}%`,
                  top: `${20 + (i % 5) * 15}%`,
                  animation: reduceMotion ? 'none' : `float ${4 + (i % 3)}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
                  animationDelay: `${i * 0.3}s`,
                  willChange: reduceMotion ? 'auto' : 'transform',
                  transform: 'translateZ(0)', // GPU acceleration
                }}
              />
            ))}
          </div>
        )}

        {/* Adaptive overlay for better text contrast */}
        <div 
          className={`absolute inset-0 ${
            darkMode
              ? 'bg-slate-950/40 backdrop-blur-[0.5px]'
              : 'bg-gradient-to-b from-white/65 via-white/35 to-white/10 backdrop-blur-[1px]'
          }`}
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center py-8 sm:py-12 md:py-16 lg:py-20">
          {/* Left Content - Main Text and CTAs */}
          <div 
            ref={contentRef}
            className={`space-y-6 sm:space-y-8 md:space-y-10 transition-all duration-1000 ${
              isVisible && mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Main Headline - Optimized responsive typography */}
            <header className="space-y-3 sm:space-y-4 md:space-y-5">
              <h1 
                className={`font-black leading-[1.15] tracking-tight ${
                  darkMode 
                    ? 'text-white' 
                    : 'text-slate-900'
                }`}
                style={{
                  fontSize: 'clamp(2rem, 5vw + 0.5rem, 3.5rem)', // 32px - 56px (was 64px-128px)
                  lineHeight: '1.15',
                  letterSpacing: '-0.02em',
                }}
              >
                {/* First line: We Are Here To Help Your */}
                <div className="block mb-1.5 sm:mb-2 md:mb-2.5">
                  {allWords.slice(0, 6).map((word, idx) => (
                    <span key={`word-${idx}`} className="mr-1.5 sm:mr-2">
                      <BlurWord
                        word={word.text}
                        delay={120}
                        index={idx}
                        darkMode={darkMode}
                        isGradient={word.gradient}
                        gradientColors={gradientColors}
                      />
                    </span>
                  ))}
                </div>
                
                {/* Second line: Business To */}
                <div className="block mb-1.5 sm:mb-2 md:mb-2.5">
                  {allWords.slice(6, 8).map((word, idx) => (
                    <span key={`word-${idx + 6}`} className={idx === 0 ? 'mr-2 sm:mr-3' : 'mr-1.5 sm:mr-2'}>
                      <BlurWord
                        word={word.text}
                        delay={120}
                        index={idx + 6}
                        darkMode={darkMode}
                        isGradient={word.gradient}
                        gradientColors={gradientColors}
                      />
                    </span>
                  ))}
                </div>
                
                {/* Third line: Innovate And Grow */}
                <div className="block">
                  {allWords.slice(8).map((word, idx) => (
                    <span key={`word-${idx + 8}`} className={idx < allWords.slice(8).length - 1 ? 'mr-1.5 sm:mr-2' : ''}>
                      <BlurWord
                        word={word.text}
                        delay={120}
                        index={idx + 8}
                        darkMode={darkMode}
                        isGradient={word.gradient}
                        gradientColors={gradientColors}
                      />
                    </span>
                  ))}
                </div>
              </h1>
            </header>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 pt-2">
              {stats.map((stat, idx) => (
                <StatCard 
                  key={idx}
                  stat={stat} 
                  index={idx}
                  darkMode={darkMode}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className={`shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl px-6 sm:px-8 md:px-10 font-bold ${
                  darkMode
                    ? 'shadow-primary-500/30 hover:shadow-primary-500/40'
                    : 'shadow-blue-500/25 hover:shadow-blue-500/35 bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 hover:from-primary-700 hover:via-primary-700 hover:to-primary-800'
                }`}
                style={!darkMode ? {
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  fontWeight: '700',
                } : {}}
                aria-label="Browse our products"
              >
                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Play size={20} />}
                className={`backdrop-blur-sm transition-all duration-300 px-6 sm:px-8 md:px-10 font-bold ${
                  darkMode
                    ? 'bg-white/10 border-white/30 text-white hover:bg-white/15 hover:border-white/50'
                    : 'bg-slate-700/10 border-slate-700/40 text-slate-900 hover:bg-slate-700/20 hover:border-slate-700/60'
                }`}
                aria-label="Learn more about us"
              >
                About Us
              </Button>
            </div>

            {/* Trust Badge */}
            <TrustBadge darkMode={darkMode} />
          </div>

          {/* Right Content - Floating Visual Elements */}
          <div 
            ref={visualRef}
            className={`relative mt-12 lg:mt-0 transition-all duration-1000 delay-300 ${
              isVisualVisible && mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Floating Product Cards Container - Optimized for performance */}
            <div 
              className="relative w-full aspect-square max-w-md mx-auto min-h-[350px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]"
              style={{
                transform: 'translateZ(0)', // GPU acceleration
                willChange: 'contents',
              }}
            >
              {/* Main Floating Card */}
              <MainFloatingCard 
                darkMode={darkMode} 
                isVisible={isVisualVisible && mounted && !reduceMotion}
                isMobile={isMobile}
              />

              {/* Floating Product Cards */}
              {floatingIcons.map((item, index) => (
                <FloatingProductCard
                  key={index}
                  item={item}
                  index={index}
                  darkMode={darkMode}
                  isVisible={isVisualVisible && mounted && !reduceMotion}
                  isMobile={isMobile}
                  mousePosition={reduceMotion ? null : mousePosition}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className={`w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex items-start justify-center p-1.5 sm:p-2 ${
          darkMode ? 'border-primary-400' : 'border-primary-500'
        }`}>
          <div className={`w-1 h-2 sm:h-3 rounded-full animate-pulse ${
            darkMode ? 'bg-primary-400' : 'bg-primary-500'
          }`} />
        </div>
      </motion.div>
    </section>
  );
}
