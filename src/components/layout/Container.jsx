export const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    sm: 'max-w-4xl',      // 896px
    default: 'max-w-7xl', // 1280px
    lg: 'max-w-[1440px]', // 1440px
    full: 'max-w-full',
  };
  
  return (
    <div 
      className={`
        container mx-auto
        ${sizes[size]}
        ${className}
      `}
      style={{
        paddingLeft: 'clamp(1rem, 4vw, 2rem)', // 16px - 32px
        paddingRight: 'clamp(1rem, 4vw, 2rem)', // 16px - 32px
      }}
    >
      {children}
    </div>
  );
};

export default Container;

