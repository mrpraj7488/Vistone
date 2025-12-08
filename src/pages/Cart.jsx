import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import {
  ShoppingCart, Trash2, Heart, Minus, Plus, ArrowRight,
  ShieldCheck, CreditCard, ShoppingBag, ArrowLeft, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart({ darkMode }) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const showToast = useUIStore((state) => state.showToast);
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleMoveToWishlist = (item) => {
    if (!isInWishlist(item.id)) {
      addToWishlist(item);
      showToast('Moved to wishlist!', 'success');
    } else {
      showToast('Already in wishlist!', 'info');
    }
    removeItem(item.id, item.licenseType);
  };

  const handleRemove = (item) => {
    removeItem(item.id, item.licenseType);
    showToast('Removed from cart', 'info');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-32 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800/50' : 'bg-slate-200/50'}`}
            >
              <ShoppingCart size={64} className={darkMode ? 'text-slate-600' : 'text-slate-400'} />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Your cart is empty
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Looks like you haven't added anything to your cart yet.
              Explore our products and find something amazing!
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/products">
                <Button className="h-12 px-8 text-lg gap-2">
                  <ShoppingBag size={20} />
                  Start Shopping
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
          <nav className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link> / <span className={darkMode ? 'text-white' : 'text-slate-900'}>Cart</span>
          </nav>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Shopping Cart
            <span className={`ml-3 text-xl font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const price = item.licenseType === 'yearly' ? item.price_yearly : item.price_monthly || item.regular_price;
                // Fallback price logic if specific license prices aren't set
                const displayPrice = item.sale_price || price || item.regular_price;

                return (
                  <motion.div
                    key={`${item.id}-${item.licenseType}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-6 transition-all ${darkMode
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="shrink-0 w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        <img
                          src={item.featured_image || '/api/placeholder/400/300'}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <Link
                              to={`/products/${item.slug}`}
                              className={`text-lg sm:text-xl font-bold hover:text-blue-500 transition-colors line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'
                                }`}
                            >
                              {item.name}
                            </Link>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              License: <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {item.licenseType === 'yearly' ? 'Extended License' : 'Standard License'}
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className={`p-2 rounded-lg transition-colors ${darkMode
                                ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-500'
                                : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                              }`}
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4">
                          {/* Quantity Controls */}
                          <div className={`flex items-center gap-3 p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                            }`}>
                            <button
                              onClick={() => updateQuantity(item.id, item.licenseType, Math.max(1, item.quantity - 1))}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${darkMode
                                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                  : 'hover:bg-white text-slate-500 hover:text-slate-900 hover:shadow-sm'
                                }`}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className={`w-8 text-center font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.licenseType, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${darkMode
                                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                  : 'hover:bg-white text-slate-500 hover:text-slate-900 hover:shadow-sm'
                                }`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className={`text-xs mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                ${displayPrice} × {item.quantity}
                              </div>
                              <div className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                ${(displayPrice * item.quantity).toFixed(2)}
                              </div>
                            </div>

                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${darkMode
                                  ? 'text-blue-400 hover:text-blue-300'
                                  : 'text-blue-600 hover:text-blue-700'
                                }`}
                            >
                              <Heart size={14} className={isInWishlist(item.id) ? "fill-current" : ""} />
                              Move to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/products"
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 shrink-0">
            <div className={`sticky top-28 rounded-2xl border p-6 ${darkMode
                ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                : 'bg-white border-slate-200 shadow-lg shadow-slate-200/50'
              }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className={`flex justify-between text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Subtotal</span>
                  <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Tax (18%)</span>
                  <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className={`pt-4 border-t border-dashed ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-end">
                    <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Total</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full h-12 text-base shadow-lg shadow-blue-500/25 mb-4 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <div className={`flex flex-col gap-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2">
                  <Lock size={12} />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-dashed border-slate-200 dark:border-slate-800">
                <p className={`text-xs text-center mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  We accept
                </p>
                <div className="flex justify-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                  {/* Simple CSS-only card placeholders or icons */}
                  <div className={`h-6 w-10 rounded ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold`}>VISA</div>
                  <div className={`h-6 w-10 rounded ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold`}>MC</div>
                  <div className={`h-6 w-10 rounded ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold`}>AMEX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
