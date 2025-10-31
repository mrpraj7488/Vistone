import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 10, suffix: '+', label: 'Years in Business', icon: '🕐' },
  { value: 500, suffix: '+', label: 'Finished Projects', icon: '✓' },
  { value: 9000, suffix: '+', label: 'Worldwide Clients', icon: '🌍' },
  { value: 800, suffix: '+', label: 'Positive Reviews', icon: '⭐' },
];

function CountUp({ end, suffix, darkMode }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, hasStarted]);

  return (
    <span ref={ref} className={`text-3xl font-black ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats({ darkMode }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Run Your Business Smartly
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            With Our Pre-Built Products
          </p>
        </div>

        <div className="relative">
          <div className={`hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2 ${
            darkMode ? 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
          }`}></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-40 h-40 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-12 ${
                  darkMode ? 'glass-dark glow-cyan' : 'glass-light'
                }`}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">{stat.icon}</div>
                    <CountUp end={stat.value} suffix={stat.suffix} darkMode={darkMode} />
                  </div>
                </div>
                <p className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
