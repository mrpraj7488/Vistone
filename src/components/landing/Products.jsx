import { useEffect, useState } from 'react';
import { Store, ShoppingBag, Utensils, CreditCard, ShoppingCart, Barcode, ShoppingCartIcon, Star, Heart, Package } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useCartStore, useUIStore, useWishlistStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const fallbackProducts = [
  {
    id: 1,
    slug: 'storeking',
    icon: Store,
    name: 'StoreKing',
    description: 'Complete e-commerce solution for your online store with advanced features and seamless integration.',
    color: 'from-green-500 to-emerald-500',
    price: 49,
    originalPrice: 79,
    rating: 4.8,
    reviews: 1250,
    sales: 8500,
    isFeatured: true,
    isBestSeller: true,
    badge: 'Best Seller',
    features: ['Multi-vendor', 'Payment Gateway', 'Inventory Management'],
  },
  {
    id: 2,
    slug: 'shopperzz',
    icon: ShoppingBag,
    name: 'Shopperzz',
    description: 'Modern shopping platform with advanced features for the next generation of e-commerce.',
    color: 'from-blue-500 to-cyan-500',
    price: 59,
    originalPrice: 99,
    rating: 4.9,
    reviews: 980,
    sales: 6200,
    isFeatured: true,
    isNew: true,
    badge: 'New',
    features: ['Mobile App', 'AI Search', 'Live Chat'],
  },
  {
    id: 3,
    slug: 'foodappi',
    icon: Utensils,
    name: 'FoodAppi',
    description: 'Food delivery and restaurant management system for modern food businesses.',
    color: 'from-orange-500 to-red-500',
    price: 69,
    originalPrice: 109,
    rating: 4.7,
    reviews: 750,
    sales: 4800,
    isFeatured: false,
    features: ['Delivery Tracking', 'Menu Management', 'Order Processing'],
  },
  {
    id: 4,
    slug: 'posking',
    icon: CreditCard,
    name: 'PosKing',
    description: 'Point of sale system for retail businesses with comprehensive features.',
    color: 'from-purple-500 to-pink-500',
    price: 79,
    originalPrice: 129,
    rating: 4.6,
    reviews: 650,
    sales: 3900,
    isFeatured: false,
    features: ['Barcode Scanner', 'Receipt Printing', 'Sales Reports'],
  },
  {
    id: 5,
    slug: 'shopking',
    icon: ShoppingCart,
    name: 'ShopKing',
    description: 'Multi-vendor marketplace platform for comprehensive e-commerce solutions.',
    color: 'from-indigo-500 to-blue-500',
    price: 89,
    originalPrice: 149,
    rating: 4.8,
    reviews: 1100,
    sales: 7200,
    isFeatured: true,
    isPopular: true,
    badge: 'Popular',
    features: ['Multi-vendor', 'Commission System', 'Seller Dashboard'],
  },
  {
    id: 6,
    slug: 'foodscan',
    icon: Barcode,
    name: 'FoodScan',
    description: 'Inventory and stock management solution for food businesses.',
    color: 'from-teal-500 to-green-500',
    price: 59,
    originalPrice: 99,
    rating: 4.5,
    reviews: 420,
    sales: 2800,
    isFeatured: false,
    features: ['Stock Tracking', 'Expiry Alerts', 'Supplier Management'],
  },
];

export default function Products({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts({ featured: true, limit: 6, sort: 'created_at', order: 'desc' });
        const list = res?.products || [];
        if (isMounted && list.length > 0) {
          setProducts(list);
        } else if (isMounted) {
          setProducts(fallbackProducts);
        }
      } catch (e) {
        console.warn('Failed to fetch products from API, using fallback.', e);
        if (isMounted) setProducts(fallbackProducts);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className={`section-padding relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900' 
        : 'bg-gradient-to-br from-white via-blue-50/30 to-white'
    }`}>
      {/* Gamification Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div 
          className={`absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 ${
            darkMode ? 'bg-primary-500/30' : 'bg-primary-500/10'
          }`}
          style={{
            animation: 'float 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div 
          className={`absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 ${
            darkMode ? 'bg-accent-500/30' : 'bg-accent-500/10'
          }`}
          style={{
            animation: 'float 10s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '1s',
          }}
        />
        
        {/* Grid pattern */}
        <div className={`absolute inset-0 bg-grid ${
          darkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'
        }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 relative z-10 px-4">
          <h2 
            className={`font-black ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            Our <span className="text-gradient-gamified">Software Solutions</span>
          </h2>
          <p 
            className={`max-w-3xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
              lineHeight: '1.6',
            }}
          >
            Discover our premium digital products designed to accelerate your business growth. Each product comes with lifetime updates and dedicated support.
          </p>
        </div>

        {/* Products Grid - Premium 2-column mobile layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-12 relative z-10">
          {(loading ? fallbackProducts : products).map((product, index) => (
            <ProductCard key={product.id || product.slug || index} product={product} index={index} darkMode={darkMode} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center relative z-10">
          <Button 
            variant="outline" 
            size="lg" 
            rightIcon={<ShoppingCartIcon size={20} />}
            className={`px-6 sm:px-8 font-semibold ${
              darkMode 
                ? 'border-primary-500 text-primary-400 hover:bg-primary-900/30' 
                : 'border-primary-500 text-primary-600 hover:bg-primary-50'
            }`}
            style={{
              fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
            }}
            asChild
          >
            <Link to="/products">
              Browse All Products
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

function ProductCard({ product, index, darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);
  const addWishlist = useWishlistStore((state) => state.addItem);
  const removeWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const navigate = useNavigate();
  const Icon = product.icon || Package;
  
  const discount = product.regular_price && (product.current_price || product.price)
    ? Math.max(0, Math.round(((product.regular_price - (product.current_price || product.price)) / product.regular_price) * 100))
    : (product.originalPrice 
      ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
      : 0);

  const imageSrc = product.featured_image || product.image || `https://via.placeholder.com/640x480?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const priced = {
        ...product,
        price_monthly: product.current_price || product.price || product.regular_price,
        price_yearly: product.current_price || product.price || product.regular_price,
      };
      addToCart(priced, 'regular');
      showToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleBuyNow = () => {
    const priced = {
      ...product,
      price_monthly: product.current_price || product.price || product.regular_price,
      price_yearly: product.current_price || product.price || product.regular_price,
    };
    addToCart(priced, 'regular');
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeWishlist(product.id);
      showToast(`${product.name} removed from wishlist`, 'info');
    } else {
      addWishlist(product);
      showToast(`${product.name} added to wishlist`, 'success');
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        hover 
        interactive 
        className={`h-full group relative overflow-hidden futuristic-card glow-border shine-overlay animated-border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/95 via-slate-800/98 to-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20' 
            : 'bg-white/98 border-2 border-gray-200/80 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20'
        }`}
        style={{
          borderRadius: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
        }}
      >
        {/* Gamification Glow Effect */}
        {(product.is_featured || product.isFeatured) && (
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`} />
        )}

        {/* Badges - Clean professional SaaS design */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-20 flex flex-col gap-1 sm:gap-1.5">
          {product.badge && (
            <Badge 
              variant={product.badge === 'Best Seller' ? 'warning' : product.badge === 'New' ? 'success' : 'secondary'}
              size="sm"
              className="shadow-md px-1.5 sm:px-2 py-0.5 font-semibold"
              style={{
                fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
              }}
            >
              {product.badge}
            </Badge>
          )}
          {discount > 0 && (
            <Badge 
              variant="error" 
              size="sm" 
              className="shadow-md px-1.5 sm:px-2 py-0.5 font-semibold"
              style={{
                fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
              }}
            >
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Media - Premium mobile optimized */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
          {/* Wishlist toggle - Premium mobile sizing */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-20 rounded-full flex items-center justify-center shadow-md transition-colors ${
              darkMode ? 'bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700' : 'bg-white/90 hover:bg-white border border-gray-200'
            }`}
            style={{
              width: 'clamp(1.75rem, 3vw + 0.5rem, 2rem)', // 28px - 32px
              height: 'clamp(1.75rem, 3vw + 0.5rem, 2rem)',
            }}
          >
            <Heart 
              size={14} 
              className={`sm:w-4 sm:h-4 ${isInWishlist ? 'text-red-500' : darkMode ? 'text-slate-300' : 'text-slate-700'}`} 
            />
          </button>
          {/* Status badge - Clean minimal design */}
          <div className="absolute top-1.5 sm:top-2 right-10 sm:right-12 z-20">
            {(product.is_featured || product.isFeatured) && (
              <Badge 
                variant="default" 
                size="sm" 
                className="shadow-md px-1.5 sm:px-2 py-0.5 font-semibold"
                style={{
                  fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
                }}
              >
                Featured
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="relative pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3">
          {/* Icon with gradient background - Premium mobile sizing */}
          <div className={`relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300`}>
            <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${product.color} opacity-15 blur-lg group-hover:opacity-20 transition-opacity duration-300`} />
            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
              <Icon size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-md" />
            </div>
          </div>

          {/* Title - Clean professional SaaS design */}
          <Link 
            to={`/products/${product.slug}`}
            className="block"
          >
            <h3 
              className={`font-bold mb-1 sm:mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 1.125rem)', // 14px - 18px
                lineHeight: '1.3',
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating - Clean professional SaaS display */}
          <div className="flex items-center gap-1 mb-2 sm:mb-2.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={`sm:w-3 sm:h-3 ${
                    i < Math.floor(product.rating_average || product.rating || 0) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : darkMode ? 'text-gray-600' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span 
              className={`ml-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
              style={{
                fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
              }}
            >
              {product.rating_average || product.rating || 0}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-2 sm:pb-3">
          {/* Description - Clean professional SaaS design */}
          <p 
            className={`leading-relaxed mb-2 sm:mb-3 line-clamp-2 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
            style={{
              fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 0.875rem)', // 12px - 14px
              lineHeight: '1.5',
            }}
          >
            {product.short_description || product.description}
          </p>

          {/* Price - Premium mobile sizing */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span 
              className={`font-black ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontSize: 'clamp(1rem, 2.5vw + 0.5rem, 1.5rem)', // 16px - 24px
              }}
            >
              ${product.current_price || product.price || product.regular_price}
            </span>
            {(product.on_sale || product.originalPrice) && (
              <span 
                className={`line-through ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
                style={{
                  fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 1rem)', // 12px - 16px
                }}
              >
                ${product.regular_price || product.originalPrice}
              </span>
            )}
          </div>

          {/* Sales Count - Clean minimal display */}
          <p 
            className={`mb-0 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}
            style={{
              fontSize: 'clamp(0.625rem, 1vw + 0.25rem, 0.75rem)', // 10px - 12px
            }}
          >
            {(product.sales_count || product.sales || 0).toLocaleString()}+ sold
          </p>
        </CardContent>

        <CardFooter className="pt-2 pb-2 sm:pb-3">
          {/* Action Buttons - Clean professional SaaS design */}
          <div className="flex gap-1.5 sm:gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 border font-semibold px-1.5 sm:px-2 py-1 sm:py-1.5 ${
                darkMode 
                  ? 'border-primary-500 text-primary-400 hover:bg-primary-900/30' 
                  : 'border-primary-500 text-primary-600 hover:bg-primary-50'
              }`}
              style={{
                height: 'clamp(2rem, 4vw + 0.5rem, 2.25rem)', // 32px - 36px
                fontSize: 'clamp(0.625rem, 1.25vw + 0.25rem, 0.75rem)', // 10px - 12px
              }}
              onClick={handleBuyNow}
              aria-label="Buy Now"
            >
              Buy Now
            </Button>
            <Button
              variant="primary"
              size="sm"
              className={`flex-1 font-semibold px-1.5 sm:px-2 py-1 sm:py-1.5 ${
                darkMode 
                  ? '' 
                  : '!bg-primary-600 !hover:bg-primary-700 !text-white !shadow-lg hover:!shadow-xl focus:!ring-primary-500'
              }`}
              style={!darkMode ? {
                background: '#2563eb',
                color: '#ffffff',
                height: 'clamp(2rem, 4vw + 0.5rem, 2.25rem)', // 32px - 36px
                fontSize: 'clamp(0.625rem, 1.25vw + 0.25rem, 0.75rem)', // 10px - 12px
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              } : {
                height: 'clamp(2rem, 4vw + 0.5rem, 2.25rem)',
                fontSize: 'clamp(0.625rem, 1.25vw + 0.25rem, 0.75rem)',
              }}
              leftIcon={<ShoppingCartIcon size={12} className="sm:w-3.5 sm:h-3.5" />}
              onClick={handleAddToCart}
              loading={isAdding}
              disabled={isAdding}
              aria-label={isAdding ? 'Adding to cart' : 'Add to cart'}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
