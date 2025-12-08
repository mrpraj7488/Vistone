import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Home, ShoppingBag, FileText, Mail, Search, ArrowRight, MoveLeft, AlertCircle } from 'lucide-react';
import { Container } from '../components/layout/Container';

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
    { name: 'Home', path: '/', icon: Home, desc: 'Return to the homepage' },
    { name: 'Products', path: '/products', icon: ShoppingBag, desc: 'Browse our catalog' },
    { name: 'Blog', path: '/blog', icon: FileText, desc: 'Read latest updates' },
    { name: 'Contact', path: '/contact', icon: Mail, desc: 'Get in touch with us' },
  ];

  return (
    <div className={`min-h-screen flex items-center relative overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-grid ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-indigo-500/30' : 'bg-blue-500/20'}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-purple-500/30' : 'bg-indigo-500/20'}`} />
      </div>

      <Container className="relative z-10 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* 404 Text */}
            <div className="relative inline-block">
              <h1 className="text-[150px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-float select-none">
                404
              </h1>
              <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${darkMode
                  ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                  : 'bg-white/50 border-slate-200 text-slate-600'
                }`}>
                Page Not Found
              </div>
            </div>

            {/* Message */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Lost in the digital universe?
              </h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className={`absolute inset-0 rounded-full blur opacity-25 transition-opacity group-hover:opacity-50 ${darkMode ? 'bg-indigo-500' : 'bg-blue-500'
                  }`} />
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, pages..."
                    className={`w-full pl-12 pr-4 py-3.5 rounded-full border outline-none transition-all ${darkMode
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                        : 'bg-white/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                  />
                  <Search className={`absolute left-4 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${darkMode
                    ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                    : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
              >
                <MoveLeft size={18} />
                Back to Home
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <ShoppingBag size={18} />
                Browse Products
              </Link>
            </div>

            {/* Popular Pages Grid */}
            <div className={`mt-16 pt-12 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-sm font-medium uppercase tracking-wider mb-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Popular Destinations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {popularPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className={`group p-4 rounded-xl text-left transition-all hover:-translate-y-1 ${darkMode
                        ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${darkMode ? 'bg-slate-700 group-hover:bg-indigo-500/20 text-indigo-400' : 'bg-blue-50 group-hover:bg-blue-100 text-blue-600'
                      }`}>
                      <page.icon size={20} />
                    </div>
                    <div className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {page.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {page.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
