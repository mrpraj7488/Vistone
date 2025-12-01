import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

export default function HeaderNav({ darkMode, setDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    {
      name: 'Services',
      path: '/services',
      submenu: [
        { name: 'Installation', path: '/services#installation' },
        { name: 'Customization', path: '/services#customization' },
        { name: 'Support', path: '/services#support' }
      ]
    },
    {
      name: 'Resources',
      path: '/blog',
      submenu: [
        { name: 'Blog', path: '/blog' },
        { name: 'Documentation', path: '/docs' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Support Center', path: '/support' }
      ]
    },
    {
      name: 'Company',
      path: '/about',
      submenu: [
        { name: 'About Us', path: '/about' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'Contact', path: '/contact' }
      ]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? darkMode
            ? 'glass-dark shadow-lg py-1.5 sm:py-2.5'
            : 'glass-light shadow-lg py-1.5 sm:py-2.5'
          : 'bg-transparent py-2 sm:py-3.5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className={`rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${darkMode ? 'bg-cyan-500 text-white' : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                } group-hover:glow-cyan`}
                style={{
                  width: 'clamp(1.75rem, 4vw, 2.5rem)',   // 28px - 40px
                  height: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', // 16px - 20px
                }}
              >
                V
              </div>
              <span
                className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{
                  fontSize: 'clamp(0.9rem, 2.4vw, 1.125rem)', // 14px - 18px
                  letterSpacing: '0.05em',
                }}
              >
                VISTONE
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium transition-colors ${darkMode
                    ? 'text-gray-300 hover:text-cyan-400'
                    : 'text-gray-700 hover:text-cyan-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5">
              <form onSubmit={handleSearch} className="hidden md:block">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`px-4 py-2 rounded-lg border-2 outline-none transition-all ${darkMode
                    ? 'glass-dark border-cyan-500/30 text-white placeholder-gray-400'
                    : 'glass-light border-gray-200 text-gray-900'
                    }`}
                />
              </form>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${darkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                aria-label="Toggle dark mode"
              >
                <span
                  style={{
                    fontSize: 'clamp(0.9rem, 2.4vw, 1.15rem)', // 14px - 18px
                  }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </span>
              </button>

              <Link
                to="/wishlist"
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                aria-label="Wishlist"
              >
                <span
                  style={{
                    fontSize: 'clamp(1.1rem, 2.8vw, 1.4rem)', // 17px - 22px
                  }}
                >
                  ❤️
                </span>
              </Link>

              <Link
                to="/cart"
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                aria-label="Cart"
              >
                <span
                  style={{
                    fontSize: 'clamp(1.1rem, 2.8vw, 1.4rem)',
                  }}
                >
                  🛒
                </span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[11px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative user-dropdown-container hidden lg:block">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {userDropdownOpen && (
                      <div
                        className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-50 ${darkMode ? 'glass-dark' : 'glass-light'
                          }`}
                      >
                        <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${darkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                          <span className="text-lg">📊</span>
                          Dashboard
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${darkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                          <span className="text-lg">📦</span>
                          My Orders
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${darkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                          <span className="text-lg">⚙️</span>
                          Settings
                        </Link>

                        <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left ${darkMode
                            ? 'text-red-400 hover:bg-gray-800'
                            : 'text-red-600 hover:bg-gray-100'
                            }`}
                        >
                          <span className="text-lg">🚪</span>
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${darkMode
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                      : 'bg-cyan-500 text-white hover:bg-cyan-600'
                      }`}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(0.95rem, 2.4vw, 1.1rem)', // 15px - 17px
                      }}
                    >
                      👤
                    </span>
                    <span
                      style={{
                        fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', // 13px - 16px
                      }}
                    >
                      Login
                    </span>
                  </Link>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-1.5 sm:p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 lg:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-5 sm:gap-7 px-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute top-4 sm:top-6 right-4 sm:right-6 text-2xl sm:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              ✕
            </button>

            {user && (
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
              </div>
            )}

            <nav className="flex flex-col gap-3.5 sm:gap-5 mb-6 sm:mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-bold transition-colors ${darkMode ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'
                    }`}
                  style={{
                    fontSize: 'clamp(1.4rem, 5vw, 2rem)', // 22px - 32px
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="text-xl">📊</span>
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="text-xl">📦</span>
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="text-xl">⚙️</span>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-colors text-left ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-xl">🚪</span>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full max-w-xs text-center px-6 py-3 rounded-lg font-bold text-lg transition-all ${darkMode ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-cyan-500 text-white hover:bg-cyan-600'
                  }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
