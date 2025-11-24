# 🎨 Complete Frontend SaaS Website Optimization & Design System - UGC Style Step-by-Step Guide

Build a stunning, production-ready SaaS digital marketplace website with exceptional UI/UX, seamless responsive design, dark/light themes, and complete integration with admin panel and user dashboard.

---

## 📋 TABLE OF CONTENTS

```
PART 1: DESIGN SYSTEM FOUNDATION
├─ Color Palette & Theme System
├─ Typography System
├─ Spacing & Layout Grid
├─ Component Library
└─ Animation Standards

PART 2: RESPONSIVE LAYOUT ARCHITECTURE
├─ Mobile-First Approach
├─ Breakpoint System
├─ Grid System
└─ Flexible Components

PART 3: PAGE-BY-PAGE IMPLEMENTATION
├─ Homepage
├─ Products Page
├─ Product Details
├─ Cart & Checkout
├─ Blog
├─ User Dashboard
└─ Static Pages

PART 4: THEME SYSTEM (DARK/LIGHT)
├─ Theme Toggle Implementation
├─ Color Transitions
├─ Asset Management
└─ User Preference Storage

PART 5: ANIMATIONS & INTERACTIONS
├─ Scroll Animations
├─ Micro-interactions
├─ Loading States
└─ Transitions

PART 6: SEO OPTIMIZATION
├─ Meta Tags
├─ Structured Data
├─ Performance
└─ Accessibility

PART 7: API INTEGRATION
├─ Data Fetching
├─ State Management
├─ Real-time Updates
└─ Error Handling

PART 8: ASSETS & MEDIA
├─ Image Optimization
├─ Icon System
├─ Illustrations
└─ CDN Setup
```

---

# PART 1: DESIGN SYSTEM FOUNDATION 🎨

## STEP 1: COLOR PALETTE & THEME SYSTEM

### **Light Theme Colors:**

```javascript
// tailwind.config.js
const lightTheme = {
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#EBF5FF',   // Lightest blue
      100: '#D6EBFF',
      200: '#AED6FF',
      300: '#85C1FF',
      400: '#5CACFF',
      500: '#3B82F6',  // Main brand blue
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',  // Darkest blue
    },
    
    // Secondary Accent
    secondary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',  // Purple accent
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    
    // Neutrals
    neutral: {
      50: '#F8FAFC',   // Backgrounds
      100: '#F1F5F9',
      200: '#E2E8F0',  // Borders
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',  // Secondary text
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',  // Primary text
    },
    
    // Success
    success: {
      50: '#F0FDF4',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
    },
    
    // Warning
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },
    
    // Error
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
    },
    
    // Info
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
  }
};
```

### **Dark Theme Colors:**

```javascript
const darkTheme = {
  colors: {
    // Dark Backgrounds
    background: {
      primary: '#0A1628',    // Main background
      secondary: '#0F1F3A',  // Cards, sections
      tertiary: '#1A2C4A',   // Elevated elements
      elevated: '#1E3A5F',   // Hover states
    },
    
    // Dark Primary
    primary: {
      50: '#1E3A8A',
      100: '#1E40AF',
      200: '#1D4ED8',
      300: '#2563EB',
      400: '#3B82F6',
      500: '#60A5FA',  // Main in dark mode
      600: '#93C5FD',
      700: '#BFDBFE',
      800: '#DBEAFE',
      900: '#EFF6FF',
    },
    
    // Dark Secondary
    secondary: {
      500: '#A78BFA',  // Purple in dark mode
      600: '#C4B5FD',
      700: '#DDD6FE',
    },
    
    // Dark Text
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      disabled: '#475569',
    },
    
    // Dark Borders
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      hover: 'rgba(255, 255, 255, 0.2)',
    },
  }
};
```

### **CSS Variables Implementation:**

```css
/* styles/globals.css */

:root {
  /* Light Theme (Default) */
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-secondary: #8B5CF6;
  --color-secondary-hover: #7C3AED;
  
  --color-background: #FFFFFF;
  --color-background-secondary: #F8FAFC;
  --color-background-tertiary: #F1F5F9;
  
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-tertiary: #94A3B8;
  
  --color-border: #E2E8F0;
  --color-border-hover: #CBD5E1;
  
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.12);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* Dark Theme */
[data-theme='dark'] {
  --color-primary: #60A5FA;
  --color-primary-hover: #93C5FD;
  --color-secondary: #A78BFA;
  --color-secondary-hover: #C4B5FD;
  
  --color-background: #0A1628;
  --color-background-secondary: #0F1F3A;
  --color-background-tertiary: #1A2C4A;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #94A3B8;
  --color-text-tertiary: #64748B;
  
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-hover: rgba(255, 255, 255, 0.2);
  
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-error: #F87171;
  --color-info: #60A5FA;
  
  /* Dark Shadows with glow effect */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.2);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 50px rgba(59, 130, 246, 0.25);
}

/* Smooth theme transition */
* {
  transition: background-color var(--transition-base),
              color var(--transition-base),
              border-color var(--transition-base),
              box-shadow var(--transition-base);
}
```

---

## STEP 2: TYPOGRAPHY SYSTEM

### **Font Stack:**

```javascript
// next.config.js or _app.tsx
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google';

// Primary Font - Body Text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Secondary Font - Headings
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Monospace - Code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});
```

### **Typography Scale:**

```css
/* Typography Classes */
.heading-1 {
  font-family: var(--font-poppins);
  font-size: clamp(2rem, 5vw, 4rem); /* 32px - 64px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.heading-2 {
  font-family: var(--font-poppins);
  font-size: clamp(1.75rem, 4vw, 3rem); /* 28px - 48px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

.heading-3 {
  font-family: var(--font-poppins);
  font-size: clamp(1.5rem, 3vw, 2.25rem); /* 24px - 36px */
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.heading-4 {
  font-family: var(--font-poppins);
  font-size: clamp(1.25rem, 2.5vw, 1.875rem); /* 20px - 30px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
}

.heading-5 {
  font-family: var(--font-poppins);
  font-size: clamp(1.125rem, 2vw, 1.5rem); /* 18px - 24px */
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.body-large {
  font-family: var(--font-inter);
  font-size: clamp(1.125rem, 1.5vw, 1.25rem); /* 18px - 20px */
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.body-base {
  font-family: var(--font-inter);
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.body-small {
  font-family: var(--font-inter);
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-tertiary);
}

.caption {
  font-family: var(--font-inter);
  font-size: 0.75rem; /* 12px */
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-text-tertiary);
  letter-spacing: 0.01em;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
  background: var(--color-background-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
}
```

---

## STEP 3: SPACING & LAYOUT GRID

### **8px Grid System:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      0: '0',
      1: '0.25rem',    // 4px
      2: '0.5rem',     // 8px
      3: '0.75rem',    // 12px
      4: '1rem',       // 16px
      5: '1.25rem',    // 20px
      6: '1.5rem',     // 24px
      7: '1.75rem',    // 28px
      8: '2rem',       // 32px
      10: '2.5rem',    // 40px
      12: '3rem',      // 48px
      16: '4rem',      // 64px
      20: '5rem',      // 80px
      24: '6rem',      // 96px
      32: '8rem',      // 128px
      40: '10rem',     // 160px
      48: '12rem',     // 192px
      56: '14rem',     // 224px
      64: '16rem',     // 256px
    },
    
    // Container Widths
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  }
};
```

### **Layout Components:**

```jsx
// components/layout/Container.tsx
export const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    sm: 'max-w-4xl',      // 896px
    default: 'max-w-7xl', // 1280px
    lg: 'max-w-[1440px]', // 1440px
    full: 'max-w-full',
  };
  
  return (
    <div className={`
      container mx-auto px-4 sm:px-6 lg:px-8
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// components/layout/Section.tsx
export const Section = ({ 
  children, 
  className = '', 
  background = 'default',
  spacing = 'default' 
}) => {
  const backgrounds = {
    default: 'bg-background',
    secondary: 'bg-background-secondary',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-background-secondary dark:to-background-tertiary',
  };
  
  const spacings = {
    sm: 'py-12 sm:py-16',
    default: 'py-16 sm:py-20 lg:py-24',
    lg: 'py-20 sm:py-24 lg:py-32',
  };
  
  return (
    <section className={`
      ${backgrounds[background]}
      ${spacings[spacing]}
      ${className}
    `}>
      {children}
    </section>
  );
};

// components/layout/Grid.tsx
export const Grid = ({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 }, 
  gap = 6,
  className = '' 
}) => {
  return (
    <div className={`
      grid
      grid-cols-${cols.default}
      md:grid-cols-${cols.md}
      lg:grid-cols-${cols.lg}
      gap-${gap}
      ${className}
    `}>
      {children}
    </div>
  );
};
```

---

## STEP 4: COMPONENT LIBRARY

### **Button Component:**

```jsx
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  // Base styles
  `
    inline-flex items-center justify-center
    font-medium transition-all duration-300
    disabled:opacity-50 disabled:pointer-events-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-primary-500 to-primary-600
          hover:from-primary-600 hover:to-primary-700
          text-white shadow-md hover:shadow-lg
          focus:ring-primary-500
        `,
        secondary: `
          bg-secondary-500 hover:bg-secondary-600
          text-white shadow-md hover:shadow-lg
          focus:ring-secondary-500
        `,
        outline: `
          border-2 border-primary-500
          text-primary-500 hover:bg-primary-50
          dark:hover:bg-primary-950
          focus:ring-primary-500
        `,
        ghost: `
          text-primary-600 hover:bg-primary-50
          dark:text-primary-400 dark:hover:bg-primary-950
        `,
        danger: `
          bg-error-500 hover:bg-error-600
          text-white shadow-md hover:shadow-lg
          focus:ring-error-500
        `,
        success: `
          bg-success-500 hover:bg-success-600
          text-white shadow-md hover:shadow-lg
          focus:ring-success-500
        `,
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-base rounded-xl',
        lg: 'h-14 px-8 text-lg rounded-xl',
        xl: 'h-16 px-10 text-xl rounded-2xl',
        icon: 'h-10 w-10 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    loading,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### **Card Component:**

```jsx
// components/ui/Card.tsx
import { forwardRef } from 'react';

export const Card = forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean;
    interactive?: boolean;
  }
>(({ className, hover = false, interactive = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      bg-background border border-border
      rounded-xl shadow-md
      transition-all duration-300
      ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
      ${interactive ? 'cursor-pointer hover:border-primary-500' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));

export const CardHeader = forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 ${className}`}
    {...props}
  />
));

export const CardContent = forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className}`}
    {...props}
  />
));

export const CardFooter = forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 flex items-center ${className}`}
    {...props}
  />
));
```

### **Input Component:**

```jsx
// components/ui/Input.tsx
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon,
    rightIcon,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={`
              w-full h-12 px-4
              ${leftIcon ? 'pl-10' : ''}
              ${isPassword || rightIcon ? 'pr-12' : ''}
              bg-background border-2 rounded-xl
              ${error 
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
                : 'border-border focus:border-primary-500 focus:ring-primary-500'
              }
              text-text-primary placeholder:text-text-tertiary
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-opacity-20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            ref={ref}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          
          {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={`mt-2 text-sm ${error ? 'text-error-500' : 'text-text-tertiary'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### **Badge Component:**

```jsx
// components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
        secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
        success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
        warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
        error: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
        outline: 'border-2 border-current',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        md: 'px-3 py-1 text-sm rounded-lg',
        lg: 'px-4 py-1.5 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props} />
  );
}
```

---

## STEP 5: ANIMATION STANDARDS

### **Animation Utilities:**

```css
/* styles/animations.css */

/* Fade In Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale Animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Gradient Animation */

```css
/* Gradient Animation */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Floating Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Rotate Animation */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Glow Animation */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
  }
}

/* Typing Animation */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Utility Classes */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fadeInDown {
  animation: fadeInDown 0.6s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

/* Stagger Children */
.stagger-children > * {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
.stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
```

### **Scroll Animation Hook:**

```typescript
// hooks/useScrollAnimation.ts
import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

// Usage Example
/*
const MyComponent = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      Content
    </div>
  );
};
*/
```

---

# PART 2: RESPONSIVE LAYOUT ARCHITECTURE 📱

## STEP 6: MOBILE-FIRST BREAKPOINT SYSTEM

### **Breakpoint Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',   // Extra small devices
      'sm': '640px',   // Small devices (mobile landscape)
      'md': '768px',   // Medium devices (tablets)
      'lg': '1024px',  // Large devices (laptops)
      'xl': '1280px',  // Extra large devices (desktops)
      '2xl': '1536px', // 2X Extra large (large desktops)
    },
  },
};
```

### **Responsive Hook:**

```typescript
// hooks/useResponsive.ts
import { useEffect, useState } from 'react';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
}

export const useResponsive = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1536,
        isLargeDesktop: width >= 1536,
        width,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoints;
};
```

### **Responsive Navigation:**

```jsx
// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
        }
      `}
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Vistone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search size={20} />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="relative overflow-hidden"
            >
              <Sun 
                size={20} 
                className={`absolute transition-all duration-300 ${
                  theme === 'light' 
                    ? 'rotate-0 scale-100' 
                    : 'rotate-90 scale-0'
                }`}
              />
              <Moon 
                size={20}
                className={`absolute transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'rotate-0 scale-100' 
                    : '-rotate-90 scale-0'
                }`}
              />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center animate-scaleIn">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="outline" size="md" leftIcon={<User size={18} />}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="md">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-text-primary hover:text-primary-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-300
            ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="py-4 space-y-2">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
              Blog
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </MobileNavLink>
            
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <Button variant="primary" size="md" fullWidth asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="md" fullWidth asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="primary" size="md" fullWidth asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

// Desktop Nav Link
const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-text-secondary hover:text-primary-500 font-medium transition-colors relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

// Mobile Nav Link
const MobileNavLink = ({ href, onClick, children }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-3 text-text-secondary hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg font-medium transition-colors"
  >
    {children}
  </Link>
);
```

---

# PART 3: PAGE-BY-PAGE IMPLEMENTATION 🏠

## STEP 7: HOMEPAGE DESIGN

### **Hero Section with Animated Gradient:**

```jsx
// components/home/HeroSection.tsx
'use client';

import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export const HeroSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-secondary-50 dark:from-background dark:via-background-secondary dark:to-background-tertiary"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Content */}
          <div 
            ref={ref}
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                #1 Digital Marketplace
              </span>
            </div>

            {/* Heading */}
            <h1 className="heading-1">
              We Are Here To Help Your{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Business To Innovate
              </span>{' '}
              And Grow
            </h1>

            {/* Description */}
            <p className="body-large text-text-secondary max-w-xl">
              Premium digital products, templates, and software solutions designed to accelerate your business growth. Join thousands of satisfied customers worldwide.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <StatItem number="10+" label="Years Experience" />
              <StatItem number="500+" label="Happy Clients" />
              <StatItem number="9K+" label="Projects Done" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className="animate-glow"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                leftIcon={<Play size={20} />}
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary-400 to-secondary-400"
                  ></div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">2000+ Developers</p>
                <p className="text-xs text-text-tertiary">Trust Vistone</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Illustration */}
          <div 
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Floating Product Cards */}
            <div className="relative w-full aspect-square">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 aspect-[4/3] bg-background rounded-2xl shadow-2xl p-8 animate-float">
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl"></div>
              </div>
              
              {/* Floating Elements */}
              <FloatingCard 
                className="absolute top-10 right-10 animate-float" 
                delay="0.5s"
                icon="💻"
                title="Dashboard"
                value="$49"
              />
              <FloatingCard 
                className="absolute bottom-20 left-10 animate-float" 
                delay="1s"
                icon="🎨"
                title="UI Kit"
                value="$79"
              />
              <FloatingCard 
                className="absolute top-1/3 left-0 animate-float" 
                delay="1.5s"
                icon="⚡"
                title="Plugin"
                value="$29"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

// Stat Item Component
const StatItem = ({ number, label }) => (
  <div>
    <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
      {number}
    </div>
    <div className="text-sm text-text-tertiary">{label}</div>
  </div>
);

// Floating Card Component
const FloatingCard = ({ className, delay, icon, title, value }) => (
  <div 
    className={`bg-background rounded-xl shadow-xl p-4 ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-sm font-medium text-text-primary">{title}</div>
    <div className="text-lg font-bold text-primary-600">{value}</div>
  </div>
);
```

### **Services Section:**

```jsx
// components/home/ServicesSection.tsx
'use client';

import { Code, Palette, Smartphone, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom web solutions built with modern technologies and best practices.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces that delight your customers.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Custom Software',
    description: 'Tailored software solutions to meet your unique business needs.',
    color: 'from-green-500 to-emerald-500',
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 bg-background-secondary">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="heading-2">
            Quality Services{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              We Provide
            </span>
          </h2>
          <p className="body-large text-text-secondary max-w-2xl mx-auto">
            We offer a wide range of digital services to help your business thrive in the modern digital landscape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

const ServiceCard = ({ service, index }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const Icon = service.icon;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        hover 
        interactive
        className="h-full group cursor-pointer"
      >
        <CardHeader>
          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-xl bg-gradient-to-br ${service.color}
            flex items-center justify-center mb-4
            transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
          `}>
            <Icon size={32} className="text-white" />
          </div>

          {/* Title */}
          <h3 className="heading-4 group-hover:text-primary-600 transition-colors">
            {service.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="body-base text-text-secondary">
            {service.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
```

### **Featured Products Carousel:**

```jsx
// components/home/FeaturedProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const FeaturedProducts = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 3));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.ceil(products.length / 3) - 1 : prev - 1
    );
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-2 mb-2">Featured Products</h2>
            <p className="body-large text-text-secondary">
              Handpicked premium products for your projects
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <Card hover interactive className="h-full group">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.isFeatured && (
              <Badge variant="warning" size="sm">
                Featured
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="success" size="sm">
                New
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`
              absolute top-3 right-3 w-10 h-10 rounded-full
              bg-background/90 backdrop-blur-sm
              flex items-center justify-center
              transform hover:scale-110 transition-all duration-300
              ${isLiked ? 'text-error-500' : 'text-text-tertiary'}
            `}
          >
            <Heart 
              size={20} 
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <CardHeader>
          {/* Category */}
          <div className="text-sm text-text-tertiary mb-2">
            {product.category}
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="heading-5 group-hover:text-primary-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}

```jsx
          {/* Rating */}
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'fill-warning-500 text-warning-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {/* Description */}
          <p className="body-small text-text-secondary line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          {/* Price and CTA */}
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                ${product.price}
              </div>
              <div className="text-xs text-text-tertiary">
                Starting from
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<ShoppingCart size={18} />}
              className="group-hover:scale-105 transition-transform"
            >
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
```

---

## STEP 8: PRODUCTS PAGE WITH FILTERS

```jsx
// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 500],
    rating: 0,
    techStack: [],
    sortBy: 'newest',
  });

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply Filters
  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // Price Range
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating
    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating);
    }

    // Tech Stack
    if (filters.techStack.length > 0) {
      filtered = filtered.filter((p) =>
        filters.techStack.some((tech) => p.techStack.includes(tech))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Our Products</h1>
          <p className="body-large text-text-secondary">
            Discover premium digital products for your next project
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={20} />}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal size={18} />}
              className="lg:hidden"
            >
              Filters
            </Button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="h-11 px-4 bg-background border-2 border-border rounded-xl text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.categories.length > 0 || filters.techStack.length > 0 || filters.rating > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-text-secondary">Active Filters:</span>
            
            {filters.categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setFilters({
                    ...filters,
                    categories: filters.categories.filter((c) => c !== category),
                  })
                }
              >
                {category} ×
              </Badge>
            ))}

            {filters.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="default"
                className="cursor-pointer"
                onClick={() =>
                  setFilters({
                    ...filters,
                    techStack: filters.techStack.filter((t) => t !== tech),
                  })
                }
              >
                {tech} ×
              </Badge>
            ))}

            {filters.rating > 0 && (
              <Badge
                variant="warning"
                className="cursor-pointer"
                onClick={() => setFilters({ ...filters, rating: 0 })}
              >
                {filters.rating}+ Stars ×
              </Badge>
            )}

            <button
              onClick={() =>
                setFilters({
                  categories: [],
                  priceRange: [0, 500],
                  rating: 0,
                  techStack: [],
                  sortBy: 'newest',
                })
              }
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`
              lg:w-80 lg:block
              ${showFilters ? 'block' : 'hidden'}
            `}
          >
            <div className="sticky top-28">
              <ProductFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 text-text-secondary">
              Showing <span className="font-semibold text-text-primary">{filteredProducts.length}</span> products
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Products */}
            {!loading && filteredProducts.length > 0 && (
              <div
                className={`
                  ${viewMode === 'grid'
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                  }
                `}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-primary-600" />
                </div>
                <h3 className="heading-4 mb-2">No products found</h3>
                <p className="body-base text-text-secondary mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      priceRange: [0, 500],
                      rating: 0,
                      techStack: [],
                      sortBy: 'newest',
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 12 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="md">
                    Previous
                  </Button>
                  <Button variant="primary" size="md">
                    1
                  </Button>
                  <Button variant="ghost" size="md">
                    2
                  </Button>
                  <Button variant="ghost" size="md">
                    3
                  </Button>
                  <span className="px-2 text-text-tertiary">...</span>
                  <Button variant="ghost" size="md">
                    10
                  </Button>
                  <Button variant="outline" size="md">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

// Product Card Skeleton
const ProductCardSkeleton = () => (
  <Card className="h-full">
    <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-t-xl"></div>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-1/4"></div>
      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-1/3"></div>
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-1/3"></div>
      </div>
    </div>
  </Card>
);
```

---

## STEP 9: PRODUCT DETAILS PAGE

```jsx
// app/products/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  Download, 
  Shield, 
  Clock, 
  Users, 
  Heart,
  Share2,
  ShoppingCart,
  Check,
  ChevronRight,
  Play,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState('regular');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProductDetails();
  }, [params.slug]);

  const fetchProductDetails = async () => {
    // Fetch from API
    const response = await fetch(`/api/products/${params.slug}`);
    const data = await response.json();
    setProduct(data);
  };

  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  const currentPrice = selectedLicense === 'regular' 
    ? product.regularPrice 
    : product.extendedPrice;

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Breadcrumb */}
      <Container>
        <div className="flex items-center space-x-2 text-sm text-text-secondary mb-8">
          <a href="/" className="hover:text-primary-600">Home</a>
          <ChevronRight size={16} />
          <a href="/products" className="hover:text-primary-600">Products</a>
          <ChevronRight size={16} />
          <span className="text-text-primary">{product.name}</span>
        </div>
      </Container>

      {/* Product Hero */}
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Preview Button */}
              {product.demoUrl && (
                
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity group"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </a>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isFeatured && (
                  <Badge variant="warning">Featured</Badge>
                )}
                {product.isBestSeller && (
                  <Badge variant="success">Best Seller</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    relative aspect-video rounded-lg overflow-hidden
                    border-2 transition-all
                    ${selectedImage === index
                      ? 'border-primary-500 scale-105'
                      : 'border-transparent hover:border-primary-300'
                    }
                  `}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="text-sm text-primary-600 font-medium mb-2">
                {product.category}
              </div>
              <h1 className="heading-2 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'fill-warning-500 text-warning-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{product.rating}</span>
                </div>
                <span className="text-text-secondary">
                  ({product.reviewCount} reviews)
                </span>
                <span className="text-text-secondary">
                  • {product.salesCount} sales
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="body-large text-text-secondary">
              {product.shortDescription}
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureItem icon={Download} text="Instant Download" />
              <FeatureItem icon={Clock} text="Lifetime Updates" />
              <FeatureItem icon={Shield} text="6 Months Support" />
              <FeatureItem icon={Users} text="Commercial Use" />
            </div>

            {/* License Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-text-primary">
                Choose License Type:
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <LicenseCard
                  type="regular"
                  price={product.regularPrice}
                  description="For single end product"
                  selected={selectedLicense === 'regular'}
                  onClick={() => setSelectedLicense('regular')}
                />
                <LicenseCard
                  type="extended"
                  price={product.extendedPrice}
                  description="For resale & SaaS"
                  selected={selectedLicense === 'extended'}
                  onClick={() => setSelectedLicense('extended')}
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-primary-600">
                ${currentPrice}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-2xl text-text-tertiary line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="error">
                    Save {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<ShoppingCart size={20} />}
                className="flex-1"
              >
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-error-500 border-error-500' : ''}
              >
                <Heart 
                  size={20} 
                  fill={isLiked ? 'currentColor' : 'none'}
                />
              </Button>

              <Button variant="outline" size="lg">
                <Share2 size={20} />
              </Button>
            </div>

            {/* Tech Stack */}
            <div>
              <div className="text-sm font-semibold text-text-primary mb-3">
                Built With:
              </div>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <Card className="p-4 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-success-900 dark:text-success-100 mb-1">
                    30-Day Money-Back Guarantee
                  </div>
                  <p className="text-sm text-success-700 dark:text-success-300">
                    Not satisfied? Get a full refund, no questions asked.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card className="p-8">
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.fullDescription }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary mb-1">
                        {feature.title}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <ProductReviews productId={product.id} reviews={product.reviews} />
          </TabsContent>

          <TabsContent value="faq">
            <ProductFAQ faqs={product.faqs} />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="heading-3 mb-8">You May Also Like</h2>
          {/* Related products grid */}
        </div>
      </Container>
    </main>
  );
}

// Feature Item Component
const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2">
    <Icon size={18} className="text-primary-600" />
    <span className="text-sm text-text-secondary">{text}</span>
  </div>
);

// License Card Component
const LicenseCard = ({ type, price, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      p-4 rounded-xl border-2 text-left transition-all
      ${selected
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
        : 'border-border hover:border-primary-300'
      }
    `}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-text-primary capitalize">
        {type} License
      </span>
      {selected && (
        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-primary-600 mb-1">
      ${price}
    </div>
    <p className="text-xs text-text-tertiary">
      {description}
    </p>
  </button>
);
```

---

## STEP 10: THEME TOGGLE IMPLEMENTATION

```typescript
// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    
    const initialTheme = stored || systemTheme;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;

```typescript
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
```

### **Advanced Theme Toggle with Sine Wave Effect:**

```jsx
// components/ui/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // Trigger sine wave effect
    triggerSineWaveTransition();
    
    // Toggle theme
    setTimeout(() => {
      toggleTheme();
    }, 150);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const triggerSineWaveTransition = () => {
    // Create ripple effect from toggle button
    const elements = document.querySelectorAll('[data-theme-transition]');
    
    elements.forEach((element, index) => {
      const delay = Math.sin((index / elements.length) * Math.PI) * 200;
      setTimeout(() => {
        element.classList.add('theme-transition-wave');
        setTimeout(() => {
          element.classList.remove('theme-transition-wave');
        }, 400);
      }, delay);
    });
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
        <span className="absolute inset-0 rounded-full border-2 border-primary-500 animate-ping"></span>
      )}
    </button>
  );
};
```

### **CSS for Theme Transition:**

```css
/* styles/theme-transition.css */

/* Sine Wave Transition Effect */
@keyframes themeTransitionWave {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) scale(1.02);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.theme-transition-wave {
  animation: themeTransitionWave 0.4s ease-in-out;
}

/* Mark elements for theme transition */
[data-theme-transition] {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Smooth theme switch */
html {
  transition: background-color 0.3s ease;
}

/* Prevent flash on page load */
html:not(.light):not(.dark) {
  visibility: hidden;
}
```

---

## STEP 11: CART & CHECKOUT FLOW

```jsx
// app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const discount = couponDiscount;
  const total = subtotal + tax - discount;

  const handleApplyCoupon = async () => {
    try {
      const discount = await applyCoupon(couponCode);
      setCouponDiscount(discount);
      setCouponApplied(true);
    } catch (error) {
      alert('Invalid coupon code');
    }
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="min-h-screen pt-28 pb-20">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Shopping Cart</h1>
          <p className="body-base text-text-secondary">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-28">
              <h3 className="heading-4 mb-6">Order Summary</h3>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    variant={couponApplied ? 'success' : 'outline'}
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-success-600 mt-2">
                    Coupon applied successfully!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-text-secondary">
                  <span>Tax (18%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold text-text-primary">
                    <span>Total</span>
                    <span className="text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} />}
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              {/* Trust Signals */}
              <div className="mt-6 space-y-2">
                <TrustSignal icon="🔒" text="Secure Checkout" />
                <TrustSignal icon="📦" text="Instant Delivery" />
                <TrustSignal icon="💳" text="All Major Cards Accepted" />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.slug}`}>
            <h3 className="heading-5 hover:text-primary-600 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </Link>
          
          <p className="text-sm text-text-tertiary mt-1">
            License: {item.licenseType === 'regular' ? 'Regular' : 'Extended'}
          </p>

          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 rounded-lg border border-border hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
              >
                <Minus size={16} />
              </button>
              
              <span className="w-12 text-center font-medium">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-border hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-xs text-text-tertiary">
                ${item.price} each
              </div>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-text-tertiary hover:text-error-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </Card>
  );
};

// Empty Cart Component
const EmptyCart = () => (
  <main className="min-h-screen pt-28 pb-20">
    <Container>
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={64} className="text-primary-600" />
        </div>
        
        <h2 className="heading-3 mb-4">Your cart is empty</h2>
        <p className="body-large text-text-secondary mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. 
          Start shopping to fill it up!
        </p>
        
        <Button variant="primary" size="lg" asChild>
          <Link href="/products">
            Browse Products
          </Link>
        </Button>
      </div>
    </Container>
  </main>
);

// Trust Signal Component
const TrustSignal = ({ icon, text }) => (
  <div className="flex items-center space-x-2 text-sm text-text-secondary">
    <span>{icon}</span>
    <span>{text}</span>
  </div>
);
```

---

## STEP 12: SEO OPTIMIZATION

```typescript
// lib/seo.ts
import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  author?: string;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = 'https://vistone.com',
  type = 'website',
  publishedTime,
  author,
}: SEOProps): Metadata {
  const siteName = 'Vistone';
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      publishedTime,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@vistone',
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    alternates: {
      canonical: url,
    },
  };
}

// Structured Data Helper
export function generateProductSchema(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Vistone',
    },
    offers: {
      '@type': 'Offer',
      url: `https://vistone.com/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Vistone',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
```

### **Usage in Pages:**

```typescript
// app/products/[slug]/page.tsx
import { generateSEO, generateProductSchema } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);
  
  return generateSEO({
    title: product.name,
    description: product.shortDescription,
    keywords: [product.category, ...product.techStack],
    image: product.featuredImage,
    url: `https://vistone.com/products/${product.slug}`,
    type: 'product',
  });
}

export default function ProductPage({ params }) {
  const product = // ... fetch product
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />
      
      {/* Page content */}
    </>
  );
}
```

---

## STEP 13: PERFORMANCE OPTIMIZATION

### **Image Optimization:**

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com', 's3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};
```

### **Dynamic Imports:**

```typescript
// components/home/HeavyComponent.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ProductCarousel = dynamic(
  () => import('@/components/products/ProductCarousel'),
  {
    loading: () => <CarouselSkeleton />,
    ssr: false, // Disable SSR if not needed
  }
);

const AnimatedChart = dynamic(
  () => import('@/components/analytics/AnimatedChart'),
  {
    loading: () => <div>Loading chart...</div>,
  }
);
```

### **Font Optimization:**

```typescript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
});
```

---

## STEP 14: API INTEGRATION

### **API Client Setup:**

```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const api = {
  // Products
  getProducts: (params?: any) => 
    apiClient.get('/products', { params }),
  
  getProduct: (slug: string) => 
    apiClient.get(`/products/${slug}`),
  
  // Cart
  addToCart: (data: any) => 
    apiClient.post('/cart', data),
  
  getCart: () => 
    apiClient.get('/cart'),
  
  updateCartItem: (id: string, data: any) => 
    apiClient.put(`/cart/${id}`, data),
  
  removeFromCart: (id: string) => 
    apiClient.delete(`/cart/${id}`),
  
  // Orders
  createOrder: (data: any) => 
    apiClient.post('/orders', data),
  
  getOrders: () => 
    apiClient.get('/user/orders'),
  
  getOrder: (id: string) => 
    apiClient.get(`/user/orders/${id}`),
  
  // Auth
  login: (credentials: any) => 
    apiClient.post('/auth/login', credentials),
  
  register: (data: any) => 
    apiClient.post('/auth/register', data),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  // User
  getProfile: () => 
    apiClient.get('/user/profile'),
  
  updateProfile: (data: any) => 
    apiClient.put('/user/profile', data),
  
  // Downloads
  getDownloads: () => 
    apiClient.get('/user/downloads'),
  
  generateDownloadLink: (id: string) => 
    apiClient.post(`/user/downloads/${id}/generate`),
};
```

### **React Query Setup:**

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useProducts = (filters?: any) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug),
    enabled: !!slug,
  });
};
```

---

## STEP 15: MOBILE OPTIMIZATION

### **Touch Gestures:**

```typescript
// hooks/useSwipe.ts
import { useEffect, useRef, useState } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
}

export const useSwipe = (options: SwipeOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
  } = options;

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const diffX = touchStart.current.x - touchEnd.x;
      const diffY = touchStart.current.y - touchEnd.y;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            onSwipeLeft?.();
          } else {
            onSwipeRight?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0) {
            onSwipeUp?.();
          } else {
            onSwipeDown?.();
          }
        }
      }

      touchStart.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance]);
};
```

### **Mobile Navigation:**

```jsx
// components/layout/MobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Package, FileText, User, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: FileText, label: 'Blog', href: '/blog' },
    { icon: User, label: 'Account', href: '/dashboard' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center flex-1
                transition-colors duration-200
                ${isActive 
                  ? 'text-primary-600' 
                  : 'text-text-tertiary'
                }
              `}
            >
              <Icon 
                size={24} 
                className={`mb-1 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
              
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-t-full"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

---

This comprehensive guide provides a complete, production-ready SaaS website with:

✅ Beautiful, responsive design
✅ Dark/Light theme with smooth transitions
✅ Mobile-first approach
✅ SEO optimized
✅ Performance optimized
✅ Complete API integration
✅ Smooth animations and interactions
✅ Accessible components
✅ Type-safe with TypeScript
✅ Modern React patterns
✅ Ready for deployment

The website seamlessly integrates with the admin panel and user dashboard, providing a cohesive experience across all user roles!