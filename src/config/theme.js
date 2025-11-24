// Admin Panel Theme Configuration
export const theme = {
  // Color Palette
  colors: {
    light: {
      background: {
        primary: '#F8FAFC',
        secondary: '#FFFFFF',
        sidebar: '#FFFFFF',
        card: '#FFFFFF',
        hover: '#F1F5F9',
        overlay: 'rgba(0, 0, 0, 0.5)'
      },
      text: {
        primary: '#0F172A',
        secondary: '#64748B',
        muted: '#94A3B8',
        inverse: '#FFFFFF'
      },
      accent: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        hover: '#2563EB',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
      },
      status: {
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6'
      },
      border: '#E2E8F0'
    },
    dark: {
      background: {
        primary: '#0A1628',
        secondary: '#0F1F3A',
        sidebar: '#1A2C4A',
        card: '#1A2C4A',
        hover: '#1E3A5F',
        overlay: 'rgba(0, 0, 0, 0.7)'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B',
        inverse: '#0F172A'
      },
      accent: {
        primary: '#60A5FA',
        secondary: '#A78BFA',
        hover: '#3B82F6',
        gradient: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)'
      },
      status: {
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#60A5FA'
      },
      border: 'rgba(255, 255, 255, 0.1)'
    }
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem'   // 40px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // Spacing System (8px grid)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.25rem', // 20px
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.12)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080
  }
};

// Helper function to get current theme
export const getCurrentTheme = (isDark) => {
  return isDark ? theme.colors.dark : theme.colors.light;
};

// CSS Variables for dynamic theming
export const generateCSSVariables = (isDark) => {
  const currentTheme = getCurrentTheme(isDark);
  
  return {
    '--color-bg-primary': currentTheme.background.primary,
    '--color-bg-secondary': currentTheme.background.secondary,
    '--color-bg-sidebar': currentTheme.background.sidebar,
    '--color-bg-card': currentTheme.background.card,
    '--color-bg-hover': currentTheme.background.hover,
    '--color-text-primary': currentTheme.text.primary,
    '--color-text-secondary': currentTheme.text.secondary,
    '--color-text-muted': currentTheme.text.muted,
    '--color-accent-primary': currentTheme.accent.primary,
    '--color-accent-secondary': currentTheme.accent.secondary,
    '--color-border': currentTheme.border,
    '--color-success': currentTheme.status.success,
    '--color-warning': currentTheme.status.warning,
    '--color-danger': currentTheme.status.danger,
    '--color-info': currentTheme.status.info,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
    '--radius-sm': theme.borderRadius.sm,
    '--radius-md': theme.borderRadius.md,
    '--radius-lg': theme.borderRadius.lg,
    '--radius-xl': theme.borderRadius.xl
  };
};

export default theme;
