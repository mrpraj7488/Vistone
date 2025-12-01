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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
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

              {/* Desktop theme toggle */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`hidden md:inline-flex items-center justify-center rounded-lg transition-all ${darkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={{
                  padding: '0.4rem 0.55rem',
                }}
                aria-label="Toggle dark mode"
              >
                <span
                  style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', // 15px - 18px on desktop
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
                    className={`flex items-center gap-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group ${darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                      }`}
                    style={{
                      padding: 'clamp(0.5rem, 1.2vw + 0.3rem, 0.75rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)', // 8px-12px vertical, 16px-20px horizontal
                      fontSize: 'clamp(0.8rem, 1.5vw + 0.25rem, 0.95rem)', // 13px - 15px
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Login</span>
                    </span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className={`${darkMode ? 'bg-black/60' : 'bg-black/40'} absolute inset-0`}
          />

          {/* Sliding panel */}
          <div
            className={`absolute inset-y-0 left-0 w-[80%] max-w-sm ${darkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl rounded-r-2xl overflow-y-auto flex flex-col px-4 pt-4 pb-6 animate-mobile-menu-slide-in`}
          >
            {/* Top row: logo + close */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div
                  className={`rounded-lg flex items-center justify-center font-bold ${darkMode ? 'bg-cyan-500 text-white' : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                    }`}
                  style={{
                    width: 'clamp(1.75rem, 4vw, 2.3rem)',
                    height: 'clamp(1.75rem, 4vw, 2.3rem)',
                    fontSize: 'clamp(1rem, 2.4vw, 1.2rem)',
                  }}
                >
                  V
                </div>
                <span
                  className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{
                    fontSize: 'clamp(0.9rem, 2.4vw, 1.05rem)',
                    letterSpacing: '0.05em',
                  }}
                >
                  VISTONE
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } p-1 rounded-lg transition-colors`}
              >
                <span
                  style={{
                    fontSize: 'clamp(1.5rem, 4.5vw, 1.9rem)',
                  }}
                >
                  ✕
                </span>
              </button>
            </div>

            {/* User summary */}
            {user && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Main nav links */}
            <nav className="flex flex-col gap-3.5 mb-4 sm:mb-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-semibold rounded-lg px-3 py-2 transition-colors ${darkMode
                    ? 'text-gray-100 hover:bg-gray-800'
                    : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  style={{
                    fontSize: 'clamp(0.95rem, 2.7vw, 1.1rem)', // 15px - 17px
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors mb-4 ${darkMode
                ? 'border-gray-700 bg-gray-800 text-gray-100 hover:border-cyan-500 hover:bg-gray-700'
                : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-cyan-500 hover:bg-white'
                }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.6vw, 1.3rem)',
                  }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </span>
                <span
                  className="font-medium"
                  style={{
                    fontSize: 'clamp(0.85rem, 2.3vw, 1rem)', // 13px - 16px
                  }}
                >
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </span>
              </div>

              {/* Simple pill indicator */}
              <span
                className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${darkMode ? 'bg-cyan-500/70' : 'bg-gray-300'
                  }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
              </span>
            </button>

            {/* Bottom actions */}
            <div className="mt-auto flex flex-col gap-3 pt-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${darkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-800 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">📊</span>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${darkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-800 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">📦</span>
                    <span className="text-sm font-medium">My Orders</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${darkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-800 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${darkMode
                      ? 'text-red-400 hover:bg-gray-800'
                      : 'text-red-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl relative overflow-hidden group ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                    }`}
                  style={{
                    padding: 'clamp(0.65rem, 1.5vw + 0.4rem, 0.85rem) clamp(1.25rem, 3vw + 0.75rem, 1.5rem)', // 10px-14px vertical, 20px-24px horizontal
                    fontSize: 'clamp(0.85rem, 1.8vw + 0.3rem, 1rem)', // 14px - 16px
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Login</span>
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
