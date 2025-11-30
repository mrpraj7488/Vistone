import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Award, ShoppingCart, Star, Calendar, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

export default function EliteAuthor({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const stats = [
    { label: 'Total Sales', value: '9,000+', icon: ShoppingCart },
    { label: 'Rating', value: '4.8/5', icon: Star },
    { label: 'Experience', value: '7+ Years', icon: Calendar },
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${darkMode
      ? 'bg-slate-900'
      : 'bg-slate-50'
      }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Luxury Gradient Mesh */}
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full mix-blend-screen filter blur-[100px] opacity-10 ${darkMode ? 'bg-amber-500' : 'bg-orange-300'
          }`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-10 ${darkMode ? 'bg-yellow-600' : 'bg-amber-200'
          }`} />

        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-[0.05] ${darkMode ? 'bg-grid-white/[0.1]' : 'bg-grid-black/[0.1]'
          }`} />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Content - Animated Badge */}
          <div
            ref={ref}
            className={`flex justify-center lg:justify-end transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            <div className="relative group">
              {/* Glowing Background */}
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 ${darkMode ? 'bg-amber-500' : 'bg-orange-400'
                }`} />

              {/* Badge Container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Rotating Outer Ring */}
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="curve"
                      d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
                      fill="transparent"
                    />
                    <text className="text-[11px] font-bold uppercase tracking-[0.2em]" fill={darkMode ? '#fbbf24' : '#d97706'}>
                      <textPath href="#curve">
                        • Elite Author • Envato Market • Trusted Quality
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* Inner Circle */}
                <div className={`absolute inset-4 rounded-full flex items-center justify-center border-4 shadow-2xl ${darkMode
                  ? 'bg-slate-900 border-amber-500/30 shadow-amber-900/20'
                  : 'bg-white border-orange-200 shadow-orange-100'
                  }`}>
                  <div className={`text-center ${darkMode ? 'text-amber-400' : 'text-orange-600'}`}>
                    <Award size={64} className="mx-auto mb-2 drop-shadow-lg" />
                    <div className="text-3xl font-black tracking-tighter">ELITE</div>
                    <div className="text-sm font-bold opacity-80 uppercase tracking-widest">Author</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Text & Stats */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 text-center lg:text-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 mx-auto lg:mx-0 ${darkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                <Star size={12} className="fill-current" />
                Envato Elite Author
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 ${darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                Proven Quality, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Trusted by Thousands
                </span>
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                We don't just build software; we craft digital experiences. Being an Elite Author on Codecanyon means we consistently deliver high-quality, secure, and well-supported products.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-y py-8 border-slate-200 dark:border-slate-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex p-3 rounded-2xl mb-3 ${darkMode ? 'bg-slate-800 text-amber-400' : 'bg-orange-50 text-orange-600'
                    }`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              className={`group px-8 h-14 text-base mx-auto lg:mx-0 ${darkMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-900/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200'
                }`}
              asChild
            >
              <Link to="/portfolio">
                Explore Our Portfolio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
