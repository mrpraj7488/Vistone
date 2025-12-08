import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import {
  Heart, ShoppingCart, Trash2, ArrowRight, Star, Sparkles,
  ShoppingBag, ChevronLeft, ExternalLink, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist({ darkMode }) {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);
  const navigate = useNavigate();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product);
    showToast('Added to cart!', 'success');
  };

  const handleRemove = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(productId);
    showToast('Removed from wishlist', 'info');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-32 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow-xl shadow-slate-200/50'}`}
            >
              <Heart size={48} className={`animate-pulse ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Your wishlist is empty
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Looks like you haven't saved any items yet. Explore our products and find something you love!
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/products">
                <Button className="h-12 px-8 text-base shadow-lg shadow-blue-500/25">
                  Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
      <Container>
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <nav className={`text-sm mb-4 inline-flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link> / <span className={darkMode ? 'text-white' : 'text-slate-900'}>Wishlist</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                My Wishlist
              </h1>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>

            <Link to="/products">
              <Button variant="outline" className="hidden md:flex">
                <ChevronLeft className="w-4 h-4 mr-2" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${darkMode
                    ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30'
                    : 'bg-white border-slate-200 hover:border-blue-500/30 hover:shadow-blue-500/10'
                  }`}
              >
                {/* Image */}
                <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.featured_image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(product.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-red-500 transition-colors z-10"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.sale_price && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-lg shadow-rose-500/30 flex items-center gap-1">
                        <Flame size={10} fill="currentColor" /> Sale
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5">
                  <Link
                    to={`/products/${product.slug}`}
                    className="block mb-2"
                  >
                    <h3 className={`font-bold text-lg line-clamp-1 group-hover:text-blue-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                          className={i < Math.floor(product.rating || 0) ? "" : "text-slate-300 dark:text-slate-600"}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {product.rating || 0}
                    </span>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                      {product.sale_price ? (
                        <>
                          <span className={`text-xs line-through ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            ${product.regular_price}
                          </span>
                          <span className="text-xl font-black text-rose-500">
                            ${product.sale_price}
                          </span>
                        </>
                      ) : (
                        <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          ${product.regular_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full h-11 text-sm shadow-lg group/btn border-0 ${darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
                      }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={16} className="group-hover/btn:translate-x-[-2px] transition-transform" />
                      Add to Cart
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
