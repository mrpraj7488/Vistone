import { useEffect, useState } from 'react';
import { Store, ShoppingBag, Utensils, CreditCard, ShoppingCart, Barcode, ShoppingCartIcon, Star, Heart, Package, ArrowRight, Flame } from 'lucide-react';
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
    <section className={`section-padding relative overflow-hidden py-16 sm:py-24 ${darkMode
      ? 'bg-[#0B0F19]'
      : 'bg-slate-50'
      }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-grid ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} />
        {/* Radial Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-indigo-500/20' : 'bg-blue-500/10'
          }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20 space-y-4 sm:space-y-6 relative z-10 px-3 sm:px-4">
          <Badge
            variant="outline"
            className={`px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${darkMode
              ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
              : 'border-blue-500/30 text-blue-600 bg-blue-50'
              }`}
          >
            Our Products
          </Badge>
          <h2
            className={`font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'
              }`}
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw + 0.75rem, 3.25rem)', // slightly smaller on mobile
              lineHeight: '1.15',
            }}
          >
            Software Solutions for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
              Modern Businesses
            </span>
          </h2>
          <p
            className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            style={{
              fontSize: 'clamp(0.95rem, 1.6vw + 0.3rem, 1.15rem)', // 15px - 18px
              lineHeight: '1.6',
            }}
          >
            Powerful, scalable, and secure digital products designed to accelerate your growth.
          </p>
        </div>

        {/* Products Grid - Optimized for 2 cards per row on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-10 sm:mb-14 md:mb-16 relative z-10">
          {(loading ? fallbackProducts : products).map((product, index) => (
            <ProductCard key={product.id || product.slug || index} product={product} index={index} darkMode={darkMode} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10 sm:mt-14 md:mt-16">
          <Link to="/products">
            <Button
              size="lg"
              className={`group relative px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto ${darkMode
                ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600 shadow-lg hover:shadow-indigo-500/20'
                : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/10'
                }`}
            >
              <span className="flex items-center gap-2">
                View All Products
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
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

  // Calculate discount percentage
  const discount = product.regular_price && (product.current_price || product.price)
    ? Math.max(0, Math.round(((product.regular_price - (product.current_price || product.price)) / product.regular_price) * 100))
    : (product.originalPrice
      ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
      : 0);

  const imageSrc = product.featured_image || product.image || `https://via.placeholder.com/640x480?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priced = {
      ...product,
      price_monthly: product.current_price || product.price || product.regular_price,
      price_yearly: product.current_price || product.price || product.regular_price,
    };
    addToCart(priced, 'regular');
    navigate('/checkout');
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      className={`group h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link to={`/products/${product.slug}`} className="block h-full">
        <Card
          className={`h-full flex flex-col relative overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 ${darkMode
            ? '!bg-slate-900 !border-slate-800 hover:!border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20'
            : '!bg-white !border-slate-200 shadow-md hover:!border-blue-300 hover:shadow-xl hover:shadow-blue-500/10'
            }`}
        >
          {/* Image Section - More compact on mobile for SaaS-style cards */}
          <div className={`relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${darkMode
              ? 'bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent'
              : 'bg-gradient-to-t from-white/10 via-transparent to-transparent'
              }`} />

            {/* Badges - Clean SaaS pills */}
            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-col sm:flex-row gap-0.5 sm:gap-1">
              {product.badge && (
                <span
                  className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full font-semibold shadow-sm ${darkMode
                    ? 'bg-indigo-500/90 text-white'
                    : 'bg-blue-600 text-white'
                    }`}
                  style={{
                    fontSize: 'clamp(0.65rem, 1.2vw + 0.2rem, 0.75rem)', // ~10px - 12px
                  }}
                >
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full font-semibold bg-rose-500 text-white shadow-sm"
                  style={{
                    fontSize: 'clamp(0.65rem, 1.2vw + 0.2rem, 0.75rem)',
                  }}
                >
                  -{discount}%
                </span>
              )}
            </div>

            {/* Wishlist Button - Very small on mobile */}
            <button
              onClick={toggleWishlist}
              className={`absolute top-1 sm:top-2 right-1 sm:right-2 p-1 sm:p-1.5 rounded-full transition-all duration-300 shadow-sm ${isInWishlist
                ? 'bg-red-500 text-white scale-110'
                : darkMode
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-red-500 hover:text-white backdrop-blur-sm'
                  : 'bg-white/90 text-slate-600 hover:bg-red-500 hover:text-white backdrop-blur-sm'
                }`}
            >
              <Heart size={12} className={`sm:w-3.5 sm:h-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          <CardContent className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col">
            {/* Title & Rating - Responsive */}
            <div className="flex items-start justify-between gap-1.5 mb-1 sm:mb-1.5">
              <h3
                className={`font-bold leading-tight flex-1 transition-colors ${darkMode
                  ? 'text-white group-hover:text-indigo-400'
                  : 'text-slate-900 group-hover:text-blue-600'
                  }`}
                style={{
                  fontSize: 'clamp(0.8rem, 1.6vw + 0.3rem, 1rem)', // ~13px - 16px
                }}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-0.5 shrink-0">
                <Star size={10} className="sm:w-3 sm:h-3 text-yellow-500 fill-yellow-500" />
                <span
                  className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-900'
                    }`}
                  style={{
                    fontSize: 'clamp(0.7rem, 1.3vw + 0.25rem, 0.8rem)', // ~11px - 13px
                  }}
                >
                  {product.rating_average || product.rating || 4.8}
                </span>
              </div>
            </div>

            {/* Description - Hidden on very small screens, readable on sm+ */}
            <p
              className={`hidden sm:block mb-2 sm:mb-3 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              style={{
                fontSize: 'clamp(0.8rem, 1.4vw + 0.25rem, 0.9rem)', // ~13px - 14px
              }}
            >
              {product.short_description || product.description}
            </p>

            <div className="mt-auto space-y-1.5 sm:space-y-2.5 md:space-y-3">
              {/* Price & Sales - Clean SaaS style */}
              <div>
                <div className="flex items-baseline gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                  <span
                    className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    style={{
                      fontSize: 'clamp(0.95rem, 2vw + 0.4rem, 1.4rem)', // ~15px - 22px
                    }}
                  >
                    ${product.current_price || product.price || product.regular_price}
                  </span>
                  {(product.on_sale || product.originalPrice) && (
                    <span
                      className={`line-through font-medium ${darkMode ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      style={{
                        fontSize: 'clamp(0.7rem, 1.3vw + 0.2rem, 0.85rem)', // ~11px - 14px
                      }}
                    >
                      ${product.regular_price || product.originalPrice}
                    </span>
                  )}
                </div>
                <p
                  className={`${darkMode ? 'text-slate-500' : 'text-slate-500'
                    }`}
                  style={{
                    fontSize: 'clamp(0.7rem, 1.3vw + 0.2rem, 0.8rem)', // ~11px - 13px
                  }}
                >
                  {(product.sales_count || product.sales || 0).toLocaleString()}+ sales
                </p>
              </div>

              {/* Action Buttons - Responsive & touch friendly */}
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  className={`flex-1 rounded font-semibold transition-all px-2 ${darkMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                    : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  onClick={handleBuyNow}
                  style={{
                    height: 'clamp(2.1rem, 3.8vw, 2.4rem)', // ~34px - 38px
                    fontSize: 'clamp(0.75rem, 1.4vw + 0.2rem, 0.85rem)', // ~12px - 14px
                  }}
                >
                  Buy
                </Button>
                <Button
                  variant="primary"
                  className={`flex-1 rounded font-semibold transition-all px-2 ${darkMode
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  style={{
                    height: 'clamp(2.1rem, 3.8vw, 2.4rem)',
                    fontSize: 'clamp(0.75rem, 1.4vw + 0.2rem, 0.85rem)',
                  }}
                >
                  {isAdding ? (
                    <div className="flex items-center justify-center">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <ShoppingCartIcon size={11} className="sm:w-3 sm:h-3" />
                      Add
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
