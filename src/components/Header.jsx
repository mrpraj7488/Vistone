import { useState, useEffect } from 'react';

export default function Header({ darkMode, setDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Products', href: '#products', hasDropdown: true },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' },
    { name: 'Blog', href: '#blog' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? darkMode
              ? 'glass-dark shadow-lg py-3'
              : 'glass-light shadow-lg py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                darkMode ? 'bg-cyan-500 text-white' : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
              } group-hover:glow-cyan`}>
                V
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                VISTONE
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onMouseEnter={() => setProductsDropdown(true)}
                      onMouseLeave={() => setProductsDropdown(false)}
                      className={`font-medium transition-colors ${
                        darkMode
                          ? 'text-gray-300 hover:text-cyan-400'
                          : 'text-gray-700 hover:text-cyan-600'
                      }`}
                    >
                      {link.name} ↓
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className={`font-medium transition-colors ${
                        darkMode
                          ? 'text-gray-300 hover:text-cyan-400'
                          : 'text-gray-700 hover:text-cyan-600'
                      }`}
                    >
                      {link.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <button className={`hidden md:block px-6 py-2 rounded-lg font-semibold border-2 transition-all ${
                darkMode
                  ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
                  : 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
              }`}>
                Login
              </button>

              <button className="hidden md:block px-6 py-2 rounded-lg font-semibold btn-gradient animate-shine">
                Get Started
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 lg:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`absolute top-6 right-6 text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              ✕
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-lg text-2xl ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-semibold ${
                  darkMode ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'
                }`}
              >
                {link.name}
              </a>
            ))}

            <button className={`px-8 py-3 rounded-lg font-semibold border-2 ${
              darkMode
                ? 'border-cyan-400 text-cyan-400'
                : 'border-cyan-500 text-cyan-600'
            }`}>
              Login
            </button>

            <button className="px-8 py-3 rounded-lg font-semibold btn-gradient">
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}
