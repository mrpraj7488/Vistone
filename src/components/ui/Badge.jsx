const badgeVariants = {
  variant: {
    default: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    outline: 'border-2 border-current bg-transparent',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-3 py-1 text-sm rounded-lg',
    lg: 'px-4 py-1.5 text-base rounded-lg',
  },
};

export function Badge({ 
  className = '', 
  variant = 'default', 
  size = 'md', 
  ...props 
}) {
  const variantClasses = badgeVariants.variant[variant] || badgeVariants.variant.default;
  const sizeClasses = badgeVariants.size[size] || badgeVariants.size.md;
  
  return (
    <span 
      className={`
        inline-flex items-center font-medium transition-colors
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `} 
      {...props} 
    />
  );
}

export default Badge;

