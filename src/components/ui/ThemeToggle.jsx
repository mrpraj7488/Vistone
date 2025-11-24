import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // Toggle theme with animation
    toggleTheme();
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isAnimating}
      className={`
        relative w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 active:scale-95
        ${theme === 'light' 
          ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' 
          : 'bg-primary-900/30 text-primary-400 hover:bg-primary-900/50'
        }
        ${isAnimating ? 'animate-pulse' : ''}
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <Sun
        size={24}
        className={`
          absolute transition-all duration-500
          ${theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-180 scale-0 opacity-0'
          }
        `}
      />
      
      {/* Moon Icon */}
      <Moon
        size={24}
        className={`
          absolute transition-all duration-500
          ${theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-180 scale-0 opacity-0'
          }
        `}
      />

      {/* Animated Ring */}
      {isAnimating && (
        <span className="absolute inset-0 rounded-full border-2 border-primary-500 animate-ping opacity-75"></span>
      )}
    </button>
  );
};

export default ThemeToggle;

