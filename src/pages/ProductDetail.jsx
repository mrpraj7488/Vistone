import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Container } from '../components/layout/Container';
import {
  ShoppingCart, Heart, Star, Check, Shield, Zap, Globe,
  Smartphone, Monitor, Download, Clock, Share2, ChevronRight,
  Layers, Box, FileText, MessageSquare, AlertCircle, ChevronDown, ArrowRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AccordionItem = ({ title, isOpen, onClick, children, darkMode, icon: Icon }) => {
  return (
    <div className={`border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between py-5 text-left transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
          }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />}
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</span>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-base leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductDetail({ darkMode }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [openSection, setOpenSection] = useState('description');
  const [licenseType, setLicenseType] = useState('single');
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (productData) {
        setProduct(productData);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const priced = {
      ...product,
      price_monthly: licenseType === 'extended' ? product.extended_price : product.regular_price,
      price_yearly: licenseType === 'extended' ? product.extended_price : product.regular_price,
    };
    addToCart(priced, licenseType);
    showToast('Added to cart!', 'success');
  };

  const handleBuyNow = () => {
    const priced = {
      ...product,
      price_monthly: licenseType === 'extended' ? product.extended_price : product.regular_price,
      price_yearly: licenseType === 'extended' ? product.extended_price : product.regular_price,
    };
    addToCart(priced, licenseType);
    navigate('/checkout');
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast('Already in wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const price = licenseType === 'extended' ? product?.extended_price : product?.regular_price;

  const getImages = () => {
    if (!product) return [];
    if (product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      return [product.featured_image, ...product.gallery_images].filter(Boolean);
    }
    return [product.featured_image].filter(Boolean);
  };

  const images = getImages();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center space-y-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Product not found</h1>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-32 lg:pb-20 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-grid ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} />
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
      </div>

      <Container className="relative z-10 pt-24 sm:pt-32">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to="/products" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Products</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-7 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className={`relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${darkMode ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
                <img
                  src={images[selectedImage] || '/api/placeholder/800/600'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {product.is_featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles size={12} /> Featured
                  </div>
                )}
              </div>

              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === idx
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 scale-95 opacity-100'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <img src={img || '/api/placeholder/100/100'} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Sections (Accordion) */}
            <div className="mt-8">
              <AccordionItem
                title="Description"
                isOpen={openSection === 'description'}
                onClick={() => toggleSection('description')}
                darkMode={darkMode}
                icon={FileText}
              >
                <div className={`prose max-w-none ${darkMode ? 'prose-invert text-slate-300' : 'prose-slate text-slate-600'}`}>
                  <p>{product.description}</p>
                </div>
              </AccordionItem>

              <AccordionItem
                title="Features"
                isOpen={openSection === 'features'}
                onClick={() => toggleSection('features')}
                darkMode={darkMode}
                icon={Layers}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features?.map((feature, idx) => (
                    <div key={idx} className={`p-4 rounded-xl flex gap-3 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-blue-500" />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              <AccordionItem
                title={`Reviews (${reviews.length})`}
                isOpen={openSection === 'reviews'}
                onClick={() => toggleSection('reviews')}
                darkMode={darkMode}
                icon={MessageSquare}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.rating || 4.8}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < Math.floor(product.rating || 4.8) ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => setReviewModalOpen(true)} variant="outline" size="sm">
                      Write a Review
                    </Button>
                  </div>

                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className={`p-5 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} border ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
                              {review.user_name?.[0] || 'A'}
                            </div>
                            <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {review.user_name || 'Anonymous'}
                            </span>
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{review.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 rounded-xl border-2 border-dashed ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                      <p className="text-sm">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </AccordionItem>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-5 relative">
            <div className={`sticky top-28 p-6 sm:p-8 rounded-3xl shadow-xl border backdrop-blur-xl transition-all ${darkMode
              ? 'bg-slate-900/80 border-slate-800 shadow-black/20'
              : 'bg-white/80 border-white/50 shadow-slate-200/50'
              }`}>

              {/* Header Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    {product.category || 'Software'}
                  </span>
                  {product.status === 'active' && (
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {product.name}
                </h1>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Version {product.version || '1.0.0'} • Last updated {product.last_update || new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Price Display */}
              <div className="mb-6 sm:mb-8 p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    ${price}
                  </span>
                  <span className={`text-base sm:text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>USD</span>
                </div>
                <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  One-time payment. Lifetime access.
                </p>
              </div>

              {/* License Selector */}
              <div className="space-y-3 mb-6 sm:mb-8">
                <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select License</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setLicenseType('single')}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-300 ${licenseType === 'single'
                      ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                      : darkMode ? 'border-slate-800 bg-slate-800/50 hover:border-slate-600' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                  >
                    <div className={`font-bold mb-1 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Regular</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personal projects</div>
                    {licenseType === 'single' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />}
                  </button>
                  <button
                    onClick={() => setLicenseType('extended')}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-300 ${licenseType === 'extended'
                      ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                      : darkMode ? 'border-slate-800 bg-slate-800/50 hover:border-slate-600' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                  >
                    <div className={`font-bold mb-1 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Extended</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Commercial use</div>
                    {licenseType === 'extended' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6 sm:mb-8">
                {/* Buy Now Button with Shine Effect */}
                <div className="relative group">
                  <div className={`absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}></div>
                  <Button
                    onClick={handleBuyNow}
                    className={`relative w-full h-12 sm:h-14 text-base sm:text-lg font-bold overflow-hidden transition-all duration-300 ${darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Buy Now <ArrowRight size={20} />
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className={`flex-1 h-12 font-bold text-sm sm:text-base transition-all ${darkMode
                      ? 'border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-800'
                      : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`px-4 rounded-xl border-2 transition-all flex items-center justify-center ${isInWishlist(product.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : darkMode
                        ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield size={16} className="text-green-500" />
                  </div>
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Secure checkout with Stripe</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Zap size={16} className="text-yellow-500" />
                  </div>
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Instant download after purchase</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock size={16} className="text-blue-500" />
                  </div>
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Free lifetime updates & support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Please sign in to write a review.</p>
          <Button onClick={() => setReviewModalOpen(false)} fullWidth>Close</Button>
        </div>
      </Modal>

      {/* Mobile Sticky Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 z-50 lg:hidden border-t backdrop-blur-xl transition-all duration-300 ${darkMode
        ? 'bg-slate-900/90 border-slate-800'
        : 'bg-white/90 border-slate-200'
        }`}>
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Price</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>${price}</span>
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>USD</span>
            </div>
          </div>
          <Button
            onClick={handleBuyNow}
            className={`flex-1 h-12 text-base font-bold shadow-lg shadow-blue-500/20 overflow-hidden relative group ${darkMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Buy Now <ArrowRight size={18} />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
          </Button>
        </div>
      </div>
    </div>
  );
}
