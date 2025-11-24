import { forwardRef } from 'react';

export const Card = forwardRef(({ 
  className = '', 
  hover = false, 
  interactive = false, 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={`
      bg-white dark:bg-slate-800
      border border-gray-200 dark:border-gray-700
      rounded-xl shadow-md
      transition-all duration-300
      ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
      ${interactive ? 'cursor-pointer hover:border-primary-500 dark:hover:border-primary-400' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

export const CardHeader = forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 ${className}`}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className}`}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 flex items-center ${className}`}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export default Card;

