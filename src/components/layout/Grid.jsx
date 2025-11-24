export const Grid = ({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 }, 
  gap = 6,
  className = '' 
}) => {
  // Tailwind-safe grid column classes
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };
  
  const mdClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    12: 'md:grid-cols-12',
  };
  
  const lgClasses = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    12: 'lg:grid-cols-12',
  };
  
  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  const defaultCol = colClasses[cols.default] || 'grid-cols-1';
  const mdCol = cols.md ? (mdClasses[cols.md] || '') : '';
  const lgCol = cols.lg ? (lgClasses[cols.lg] || '') : '';
  const gapClass = gapClasses[gap] || 'gap-6';
  
  return (
    <div className={`
      grid
      ${defaultCol}
      ${mdCol}
      ${lgCol}
      ${gapClass}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Grid;

