import { useState } from 'react';

export default function Newsletter({ darkMode }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Get Latest Updates
        </h2>
        <p className={`text-lg mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Subscribe to our newsletter and stay informed about new products and features
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`flex-1 px-8 py-5 rounded-full border-2 outline-none transition-all text-lg font-medium ${
              darkMode
                ? 'glass-dark border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:glow-cyan'
                : 'glass-light border-gray-200 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
            }`}
            required
          />
          <button
            type="submit"
            className="px-10 py-5 rounded-full font-bold text-lg btn-gradient animate-shine shadow-2xl"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
