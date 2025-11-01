import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function NotFound({ darkMode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularPages = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Products', path: '/products', icon: '🛍️' },
    { name: 'Blog', path: '/blog', icon: '📝' },
    { name: 'Contact', path: '/contact', icon: '📧' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-9xl font-black mb-8 text-gradient animate-float">
          404
        </div>

        <div className="text-8xl mb-8 animate-float" style={{ animationDelay: '0.2s' }}>
          🔍
        </div>

        <h1 className={`text-4xl md:text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Oops! Page Not Found
        </h1>

        <p className={`text-xl mb-12 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          The page you're looking for doesn't exist or has been moved.
          Don't worry, we'll help you find what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="px-8 py-4 rounded-xl font-bold text-lg btn-gradient animate-shine shadow-2xl hover:scale-105 transition-all"
          >
            🏠 Back to Home
          </Link>
          <Link
            to="/products"
            className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              darkMode
                ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
                : 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
            }`}
          >
            🛍️ Browse Products
          </Link>
        </div>

        <div className="mb-12">
          <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Or search for what you need:
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full px-6 py-4 pr-24 rounded-full border-2 outline-none transition-all text-lg ${
                  darkMode
                    ? 'glass-dark border-cyan-500/30 text-white'
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-bold"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`p-6 rounded-xl transition-all hover:-translate-y-2 hover:shadow-xl ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-3">{page.icon}</div>
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {page.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-cyan-500 hover:underline font-bold">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
