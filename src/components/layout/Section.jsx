export const Section = ({ 
  children, 
  className = '', 
  background = 'default',
  spacing = 'default',
  id,
  ...props
}) => {
  const backgrounds = {
    default: 'bg-white dark:bg-slate-900',
    secondary: 'bg-gray-50 dark:bg-slate-800',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-800 dark:to-slate-900',
    transparent: 'bg-transparent',
  };
  
  const spacings = {
    sm: 'py-12 sm:py-16',
    default: 'py-16 sm:py-20 lg:py-24',
    lg: 'py-20 sm:py-24 lg:py-32',
    none: 'py-0',
  };
  
  return (
    <section 
      id={id}
      className={`
        ${backgrounds[background] || backgrounds.default}
        ${spacings[spacing] || spacings.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section;

