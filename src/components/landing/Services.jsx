import { FileCode, Smartphone, Settings, Zap } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const services = [
  {
    icon: FileCode,
    title: 'Web Development',
    description: 'Crafting stunning and functional websites tailored to your business needs.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description: 'Building innovative and user-friendly mobile applications for various platforms.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Settings,
    title: 'Installation',
    description: 'Seamless setup and integration of our products and services into your existing infrastructure.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Zap,
    title: 'Customization',
    description: 'Tailoring our solutions to perfectly match your unique business requirements.',
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
  },
];

export default function Services({ darkMode }) {
  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-5 ${
          darkMode ? 'bg-primary-500' : 'bg-primary-500/30'
        }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 space-y-3 sm:space-y-4 relative z-10">
          <h2 
            className={`font-black ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw + 0.5rem, 2.6rem)', // slightly smaller on mobile
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            Quality <span className="text-gradient-gamified">Services</span> We Provide
          </h2>
          <p 
            className={`max-w-3xl mx-auto px-3 sm:px-4 ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              lineHeight: '1.6',
            }}
          >
            We offer a wide range of digital services to help your business thrive in the modern digital landscape.
          </p>
        </div>

        {/* Services Grid - Premium 2-column mobile layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-6 relative z-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} darkMode={darkMode} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({ service, index, darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const Icon = service.icon;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        hover 
        interactive
        className={`h-full group cursor-pointer futuristic-card ${
          darkMode 
            ? 'bg-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20' 
            : 'bg-white/98 border-2 border-gray-200/80 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20'
        } ${service.bgColor}`}
        style={{
          borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
        }}
      >
        <CardHeader className="pb-3 sm:pb-4">
          {/* Icon with gradient background - Premium mobile sizing */}
          <div className="relative mb-2.5 sm:mb-3.5 md:mb-5">
            <div className={`absolute top-0 right-0 w-10 h-10 sm:w-14 sm:h-14 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:5px_5px] sm:bg-[length:7px_7px] dark:opacity-10`} />
            <div className={`
              relative w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.color}
              flex items-center justify-center
              transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg
            `}>
              <Icon size={22} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 
            className={`font-black group-hover:text-primary-600 transition-colors ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(0.95rem, 2vw + 0.5rem, 1.2rem)', // slightly tighter
            }}
          >
            {service.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          <p 
            className={`${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
              lineHeight: '1.6',
            }}
          >
            {service.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
