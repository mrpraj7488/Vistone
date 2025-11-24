import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  darkMode = false, 
  size = 'medium', 
  showProductCount = true,
  onClick,
  className = ''
}) => {
  const sizeClasses = {
    small: 'p-4 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg'
  };

  const iconSizes = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-6xl'
  };

  const CardContent = () => (
    <div className={`
      w-full rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer
      ${darkMode ? 'glass-dark' : 'glass-light'}
      ${sizeClasses[size]}
      ${className}
    `}
    style={{
      background: darkMode 
        ? `linear-gradient(135deg, ${category.color || '#3B82F6'}20, ${category.color || '#3B82F6'}10)`
        : `linear-gradient(135deg, ${category.color || '#3B82F6'}10, ${category.color || '#3B82F6'}05)`
    }}>
      <div className="text-center">
        <div className={`${iconSizes[size]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {category.icon || '📁'}
        </div>
        
        <h3 className={`font-bold mb-2 ${
          size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'
        } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {category.name}
        </h3>
        
        {category.description && (
          <p className={`mb-4 line-clamp-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {category.description}
          </p>
        )}
        
        {showProductCount && (
          <div className={`flex items-center justify-center gap-2 font-medium ${
            size === 'small' ? 'text-xs' : 'text-sm'
          } ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <Package size={size === 'small' ? 14 : 16} />
            {category.productCount || 0} products
          </div>
        )}

        <div className={`flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${
          darkMode ? 'text-cyan-400' : 'text-cyan-600'
        }`}>
          <span className={size === 'small' ? 'text-xs' : 'text-sm'}>Explore</span>
          <ArrowRight size={size === 'small' ? 14 : 16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={() => onClick(category)} className="w-full">
        <CardContent />
      </button>
    );
  }

  return (
    <Link to={`/categories/${category.slug}`} className="block w-full">
      <CardContent />
    </Link>
  );
};

export default CategoryCard;
