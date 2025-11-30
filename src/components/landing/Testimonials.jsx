import { Container } from '../layout/Container';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechFlow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "Vistone transformed our workflow completely. The intuitive interface and powerful features have saved us countless hours.",
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    company: 'InnovateLabs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: "The scalability is impressive. We've grown 10x since using Vistone and haven't faced a single performance issue.",
    rating: 5
  },
  {
    name: 'Emily Davis',
    role: 'Marketing Director',
    company: 'GrowthCo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    content: "The analytics dashboard is a game-changer. I can finally see where our traffic is coming from and optimize accordingly.",
    rating: 5
  },
  {
    name: 'David Wilson',
    role: 'Founder',
    company: 'StartUp Inc',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content: "Customer support is phenomenal. They resolved my issue within minutes. Truly a partner in our success.",
    rating: 5
  },
  {
    name: 'Lisa Anderson',
    role: 'Operations Head',
    company: 'LogisticsPro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    content: "We've tried many tools, but Vistone is by far the best. It's robust, reliable, and beautifully designed.",
    rating: 5
  },
  {
    name: 'James Thompson',
    role: 'Lead Developer',
    company: 'CodeCrafters',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    content: "The API documentation is top-notch. Integrating Vistone into our existing stack was a breeze.",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, darkMode }) => (
  <div className={`flex-shrink-0 w-[350px] p-6 rounded-2xl mx-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode
    ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-md'
    : 'bg-white/60 border border-white/50 backdrop-blur-md shadow-lg shadow-slate-200/50'
    }`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full bg-slate-200"
        />
        <div>
          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {testimonial.name}
          </h4>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
      <Quote className={`w-8 h-8 opacity-20 ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`} />
    </div>

    <div className="flex gap-1 mb-3">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
      "{testimonial.content}"
    </p>
  </div>
);

export default function Testimonials({ darkMode }) {
  return (
    <section className={`py-24 relative overflow-hidden ${darkMode
      ? 'bg-slate-900'
      : 'bg-slate-50'
      }`}>
      {/* Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Background */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[#0B1120]' : 'bg-slate-50'
          }`} />

        {/* Dot Pattern */}
        <div className={`absolute inset-0 opacity-[0.5] ${darkMode ? 'opacity-[0.3]' : 'opacity-[0.5]'
          }`}
          style={{
            backgroundImage: `radial-gradient(${darkMode ? '#475569' : '#94a3b8'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)',
          }} />

        {/* Ambient Lighting - Top Spotlight */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-20 pointer-events-none ${darkMode
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/50 via-slate-900/50 to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-slate-50/50 to-transparent'
          }`} />

        {/* Subtle Side Glows */}
        <div className={`absolute top-1/4 -left-64 w-96 h-96 rounded-full blur-[128px] opacity-20 ${darkMode ? 'bg-indigo-600' : 'bg-blue-400'
          }`} />
        <div className={`absolute bottom-1/4 -right-64 w-96 h-96 rounded-full blur-[128px] opacity-20 ${darkMode ? 'bg-purple-600' : 'bg-purple-400'
          }`} />
      </div>

      <Container>
        <div className="text-center mb-16 relative z-10">
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'
            }`}>
            Happy Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Feedbacks</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
            Don't just take our word for it. Here's what industry leaders have to say about their experience with Vistone.
          </p>
        </div>
      </Container>

      {/* Marquee Container */}
      <div className="relative z-10 pause-on-hover">
        {/* Gradient Masks for smooth fade */}
        <div className={`absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r ${darkMode ? 'from-slate-900 to-transparent' : 'from-slate-50 to-transparent'
          }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l ${darkMode ? 'from-slate-900 to-transparent' : 'from-slate-50 to-transparent'
          }`} />

        {/* Marquee Track - Row 1 */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          <div className="flex py-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`t1-${index}`} testimonial={testimonial} darkMode={darkMode} />
            ))}
          </div>
          <div className="flex py-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`t1-dup-${index}`} testimonial={testimonial} darkMode={darkMode} />
            ))}
          </div>
        </div>

        {/* Marquee Track - Row 2 (Reverse direction? Maybe later, let's stick to one clean row first or two rows moving same way but offset. Actually, let's do just one row for now to keep it clean, or duplicate the content to fill width) */}
      </div>
    </section>
  );
}
