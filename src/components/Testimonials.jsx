import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO at TechStart',
    rating: 5,
    text: 'Vistone has transformed our business operations. Their SaaS solutions are incredibly intuitive and powerful.',
    avatar: '👩',
  },
  {
    name: 'Michael Chen',
    role: 'Founder of ShopEasy',
    rating: 5,
    text: 'Outstanding support and amazing products. The team truly understands what businesses need.',
    avatar: '👨',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    rating: 5,
    text: 'Best investment we made this year. The platform is robust, scalable, and excellent support.',
    avatar: '👩',
  },
];

export default function Testimonials({ darkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Happy Client Feedbacks
          </h2>
          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
              ⭐ Envato Verified
            </div>
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
              ⭐ 800+ Reviews
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-xl ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>

              <p className={`leading-relaxed text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {testimonial.text}
              </p>

              <div className="mt-6 text-green-500 font-bold flex items-center gap-2">
                <span>✓</span> Verified Purchase
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
