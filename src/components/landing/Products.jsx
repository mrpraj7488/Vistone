import { useEffect, useState } from 'react';
import { Store, ShoppingBag, Utensils, CreditCard, ShoppingCart, Barcode, ShoppingCartIcon, Star, Heart, Package, ArrowRight, Flame, Sparkles, Timer, Zap, Search } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useCartStore, useUIStore, useWishlistStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

const fallbackProducts = [
  {
    id: 1,
    slug: 'storeking',
    icon: Store,
    name: 'StoreKing',
    description: 'Complete e-commerce solution for your online store with advanced features and seamless integration.',
    color: 'from-green-500 to-emerald-500',
    regular_price: 79,
    sale_price: 49,
    rating: 4.8,
    rating_count: 1250,
    sales_count: 8500,
    is_featured: true,
    trending: true,
    category: 'E-commerce',
    features: ['Multi-vendor', 'Payment Gateway', 'Inventory Management'],
  },
  {
    id: 2,
    slug: 'shopperzz',
    icon: ShoppingBag,
    name: 'Shopperzz',
    description: 'Modern shopping platform with advanced features for the next generation of e-commerce.',
    color: 'from-blue-500 to-cyan-500',
    regular_price: 99,
    sale_price: 59,
    rating: 4.9,
    rating_count: 980,
    sales_count: 6200,
    is_featured: true,
    trending: true,
    category: 'Retail',
    features: ['Mobile App', 'AI Search', 'Live Chat'],
  },
  {
    id: 3,
    slug: 'foodappi',
    icon: Utensils,
    name: 'FoodAppi',
    description: 'Food delivery and restaurant management system for modern food businesses.',
    color: 'from-orange-500 to-red-500',
    regular_price: 109,
    sale_price: 69,
    rating: 4.7,
    rating_count: 750,
    sales_count: 4800,
    is_featured: false,
    category: 'Food & Beverage',
    features: ['Delivery Tracking', 'Menu Management', 'Order Processing'],
  },
  {
    id: 4,
    slug: 'posking',
    icon: CreditCard,
    name: 'PosKing',
    description: 'Point of sale system for retail businesses with comprehensive features.',
    color: 'from-purple-500 to-pink-500',
    regular_price: 129,
    sale_price: 79,
    rating: 4.6,
    rating_count: 650,
    sales_count: 3900,
    is_featured: false,
    category: 'POS Systems',
    features: ['Barcode Scanner', 'Receipt Printing', 'Sales Reports'],
  },
  {
    id: 5,
    slug: 'shopking',
    icon: ShoppingCart,
    name: 'ShopKing',
    description: 'Multi-vendor marketplace platform for comprehensive e-commerce solutions.',
    color: 'from-indigo-500 to-blue-500',
    regular_price: 149,
    sale_price: 89,
    rating: 4.8,
    rating_count: 1100,
    sales_count: 7200,
    is_featured: true,
    trending: true,
    category: 'Marketplace',
    features: ['Multi-vendor', 'Commission System', 'Seller Dashboard'],
  },
  {
    id: 6,
    slug: 'foodscan',
    icon: Barcode,
    name: 'FoodScan',
    description: 'Inventory and stock management solution for food businesses.',
    color: 'from-teal-500 to-green-500',
    regular_price: 99,
    sale_price: 59,
    rating: 4.5,
    rating_count: 420,
    sales_count: 2800,
    is_featured: false,
    category: 'Inventory',
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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        if (isMounted && data && data.length > 0) {
          setProducts(data);
        } else if (isMounted) {
          setProducts(fallbackProducts);
        }
      } catch (e) {
        console.warn('Failed to fetch products from Supabase, using fallback.', e);
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
            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}></div>
              <Button
                size="lg"
                className={`relative px-8 py-3 rounded-full font-bold transition-all duration-300 w-full sm:w-auto overflow-hidden ${darkMode
                  ? '!bg-slate-900 !text-white border border-slate-700 hover:!bg-slate-800'
                  : '!bg-white !text-slate-900 border border-slate-200 hover:!bg-slate-50'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Products
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'
                  }`} />
              </Button>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function ProductCard({ product, index, darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const addToCart = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priced = {
      ...product,
      price_monthly: product.sale_price || product.regular_price,
      price_yearly: product.sale_price || product.regular_price,
    };
    addToCart(priced, 'regular');
    navigate('/checkout');
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    showToast('Added to wishlist!', 'success');
  };

  const imageSrc = product.featured_image || product.image || `https://via.placeholder.com/640x480?text=${encodeURIComponent(product.name)}`;

  return (
    <div
      ref={ref}
      className={`group h-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link
        to={`/products/${product.slug}`}
        className={`group relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode
          ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30'
          : 'bg-white border-slate-200 hover:border-blue-500/30 hover:shadow-blue-500/10'
          } ${product.trending ? 'ring-1 ring-rose-500/50 shadow-lg shadow-rose-500/10' : ''}`}
      >
        {/* Image Container - 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
                }`}
            >
              <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.is_featured && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 shadow-lg shadow-amber-900/20 flex items-center gap-1">
                <Sparkles size={10} /> Featured
              </span>
            )}
            {product.trending && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 flex items-center gap-1 animate-pulse">
                <Flame size={10} className="fill-white" /> Hot Sale
              </span>
            )}
          </div>

          {/* Hype Banner for Trending/Sale */}
          {(product.trending || product.sale_price) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-md text-white text-[10px] font-bold py-2 px-2 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <Timer size={12} className="animate-spin-slow" />
              <span>Selling Fast! Limited Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          <div className="mb-1.5">
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {product.category || 'Software'}
            </span>
          </div>

          <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 0) ? "" : "text-slate-300 dark:text-slate-600"} />
              ))}
            </div>
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {product.rating || 0}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-500'}`}>
              ({product.rating_count || 0} reviews)
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between w-full">
                <div className="flex flex-col">
                  {product.sale_price ? (
                    <>
                      <span className={`text-[10px] line-through ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        ${product.regular_price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-rose-500">
                          ${product.sale_price}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 animate-pulse border border-rose-500/20">
                          <Flame size={10} fill="currentColor" />
                          Hot Sale
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <span className={`text-[10px] sm:text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Price</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          ${product.regular_price}
                        </span>
                        {product.trending && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20">
                            <Zap size={10} fill="currentColor" />
                            Selling Fast
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className={`w-full relative overflow-hidden h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg group/btn transition-all ${darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
                  }`}
              >
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                <span>Buy Now</span>
                <ShoppingCart size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
