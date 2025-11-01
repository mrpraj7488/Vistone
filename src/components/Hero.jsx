import { useState, useEffect } from 'react';

const floatingIcons = [
  { name: 'Figma', icon: '🎨', position: { top: '15%', left: '10%' }, delay: 0 },
  { name: 'VSCode', icon: '💻', position: { top: '30%', left: '5%' }, delay: 0.2 },
  { name: 'React', icon: '⚛️', position: { top: '50%', left: '8%' }, delay: 0.4 },
  { name: 'Node.js', icon: '🟢', position: { top: '70%', left: '12%' }, delay: 0.6 },
  { name: 'Supabase', icon: '⚡', position: { top: '20%', right: '10%' }, delay: 0.8 },
  { name: 'Stripe', icon: '💳', position: { top: '40%', right: '8%' }, delay: 1 },
  { name: 'Tailwind', icon: '🎨', position: { top: '60%', right: '12%' }, delay: 1.2 },
  { name: 'Next.js', icon: '▲', position: { top: '75%', right: '15%' }, delay: 1.4 }
];

export default function Hero({ darkMode }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, idx) => (
          <div
            key={idx}
            className={`hidden lg:flex absolute w-20 h-20 rounded-2xl items-center justify-center text-4xl shadow-xl transition-all duration-1000 ${
              animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            } ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-110 hover:rotate-12`}
            style={{
              ...item.position,
              animation: `float ${4 + idx * 0.3}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              transitionDelay: `${item.delay}s`
            }}
          >
            <span className="text-3xl">{item.icon}</span>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className={`inline-block mb-8 px-8 py-4 rounded-full shadow-xl ${
          darkMode ? 'glass-dark' : 'glass-light'
        } ${animate ? 'animate-pulse-glow' : ''}`}>
          <p className={`font-semibold text-lg ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Welcome to Vistone
          </p>
        </div>

        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } transition-all duration-1000`}>
          <div className={darkMode ? 'text-white' : 'text-gray-900'}>
            We Are Here To Help Your
          </div>
          <div className={darkMode ? 'text-white' : 'text-gray-900'}>
            Business To Innovate And
          </div>
        </h1>

        <p className={`text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          The infinite innovation accelerator. We are the makers of premium SaaS tools,
          empowering 20,000+ businesses with Vistone Innovation.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="w-full sm:w-auto px-10 py-5 rounded-xl font-bold text-lg btn-gradient animate-shine shadow-2xl">
            Browse Products
          </button>
          <button className={`w-full sm:w-auto px-10 py-5 rounded-xl font-bold text-lg border-2 transition-all duration-300 ${
            darkMode
              ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
              : 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
          } hover:scale-105 hover:shadow-2xl`}>
            About Us
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(8deg);
          }
        }
      `}</style>
    </section>
  );
}
