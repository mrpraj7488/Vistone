import { forwardRef, cloneElement, isValidElement } from 'react';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  variant: {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      hover:from-primary-700 hover:to-primary-800
      text-white shadow-lg hover:shadow-xl
      focus:ring-primary-500
      focus:ring-offset-2
      dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-700
      dark:hover:from-primary-700 dark:hover:to-primary-800
    `,
    secondary: `
      bg-gradient-to-r from-secondary-600 to-secondary-700
      hover:from-secondary-700 hover:to-secondary-800
      text-white shadow-md hover:shadow-lg
      focus:ring-secondary-500
      focus:ring-offset-2
    `,
    outline: `
      border-2 border-primary-500
      text-primary-500 hover:bg-primary-50
      dark:text-primary-400 dark:border-primary-400
      dark:hover:bg-primary-950
      focus:ring-primary-500
      focus:ring-offset-2
      light:border-primary-600 light:text-primary-700 light:hover:bg-primary-100
    `,
    ghost: `
      text-primary-600 hover:bg-primary-50
      dark:text-primary-400 dark:hover:bg-primary-950
      focus:ring-primary-500
      focus:ring-offset-2
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white shadow-md hover:shadow-lg
      focus:ring-red-500
      focus:ring-offset-2
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700
      hover:from-green-700 hover:to-green-800
      text-white shadow-md hover:shadow-lg
      focus:ring-green-500
      focus:ring-offset-2
    `,
    link: `
      text-primary-600 hover:text-primary-700
      dark:text-primary-400 dark:hover:text-primary-300
      underline-offset-4 hover:underline
      p-0 h-auto
    `,
  },
  size: {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
    xl: 'h-16 px-10 text-xl rounded-2xl',
    icon: 'h-10 w-10 rounded-lg',
  },
};

export const Button = forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children, 
  disabled,
  asChild,
  ...props 
}, ref) => {
  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.primary;
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.md;
  
  const buttonClasses = `
    inline-flex items-center justify-center
    font-semibold transition-all duration-300
    disabled:opacity-50 disabled:pointer-events-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${variantClasses}
    ${sizeClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const content = loading ? (
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
  );

  // If asChild is true, clone the child element and add classes/props
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: `${buttonClasses} ${children.props.className || ''}`,
      ref,
      ...props,
      children: (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children.props.children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      ),
    });
  }
  
  return (
    <button
      className={buttonClasses}
      ref={ref}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
