import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      const stored = localStorage.getItem('vistone_theme_v2');
      const savedAdminTheme = localStorage.getItem('vistone_admin_theme_v2');
      // Only apply system theme if no manual preference is set
      if (!stored && !savedAdminTheme) {
        const newTheme = 'dark'; // Always default to dark on system change if not stored
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    const stored = localStorage.getItem('vistone_theme_v2');
    const savedAdminTheme = localStorage.getItem('vistone_admin_theme_v2');
    // const systemTheme = mediaQuery.matches ? 'dark' : 'light';

    const initialTheme = stored || savedAdminTheme || 'dark';
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);

    // Sync with admin theme storage
    if (localStorage.getItem('vistone_admin_theme_v2') !== newTheme) {
      localStorage.setItem('vistone_admin_theme_v2', newTheme);
    }
    localStorage.setItem('vistone_theme_v2', newTheme);
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

