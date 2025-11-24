import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const stored = localStorage.getItem('theme');
      const savedAdminTheme = localStorage.getItem('adminTheme');
      // Only apply system theme if no manual preference is set
      if (!stored && !savedAdminTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    
    const stored = localStorage.getItem('theme');
    const savedAdminTheme = localStorage.getItem('adminTheme');
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    
    const initialTheme = stored || savedAdminTheme || systemTheme;
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
    if (localStorage.getItem('adminTheme') !== newTheme) {
      localStorage.setItem('adminTheme', newTheme);
    }
    localStorage.setItem('theme', newTheme);
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

