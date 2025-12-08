import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Container } from '../components/layout/Container';
import {
  ShoppingCart, Heart, Star, Check, Shield, Zap, Globe,
  Smartphone, Monitor, Download, Clock, Share2, ChevronRight,
  Layers, Box, FileText, MessageSquare, AlertCircle
} from 'lucide-react';

export default function ProductDetail({ darkMode }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
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
    addToCart(product, licenseType);
    showToast('Added to cart!', 'success');
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      showToast('Already in wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist!', 'success');
    }
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
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
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-grid ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
      </div>

      <Container className="relative z-10 pt-24 sm:pt-32">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to="/products" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Products</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-slate-800 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
              <img
                src={images[selectedImage] || '/api/placeholder/800/600'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Featured
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === idx
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 scale-95'
                      : 'hover:opacity-80'
                    }`}
                >
                  <img src={img || '/api/placeholder/100/100'} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Tabs Section - Desktop */}
            <div className="hidden lg:block mt-12">
              <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
                <div className="flex gap-8">
                  {['description', 'features', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab
                          ? 'text-blue-500'
                          : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-fadeIn">
                {activeTab === 'description' && (
                  <div className={`prose max-w-none ${darkMode ? 'prose-invert' : 'prose-slate'}`}>
                    <p className="text-lg leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features?.map((feature, idx) => (
                      <div key={idx} className={`p-4 rounded-xl flex gap-4 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Check size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Feature {idx + 1}</h4>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {reviews.length} Reviews
                      </h3>
                      <Button onClick={() => setReviewModalOpen(true)} variant="outline" size="sm">
                        Write a Review
                      </Button>
                    </div>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className={`p-6 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-100'} shadow-sm`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {review.user_name?.[0] || 'A'}
                              </div>
                              <div>
                                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {review.user_name || 'Anonymous'}
                                </div>
                                <div className="flex text-yellow-400 text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-300 dark:text-slate-600" : ""} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{review.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className={`text-center py-12 rounded-xl border-2 border-dashed ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                        <p>No reviews yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className={`sticky top-24 p-6 sm:p-8 rounded-3xl shadow-xl border backdrop-blur-xl ${darkMode
                ? 'bg-slate-800/80 border-slate-700/50'
                : 'bg-white/80 border-white/50'
              }`}>
              {product.category && (
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {product.category}
                  </span>
                  {product.status === 'active' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              )}

              <h1 className={`text-3xl sm:text-4xl font-black mb-4 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.rating || 4.8}</span>
                  <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>({product.rating_count || 12} reviews)</span>
                </div>
                <div className={`w-px h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-1">
                  <Download size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                  <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{product.sales_count || 0} Sales</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    ${price}
                  </span>
                  {licenseType === 'extended' && (
                    <span className={`text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>USD</span>
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  One-time payment. Lifetime access.
                </p>
              </div>

              {/* License Selector */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setLicenseType('single')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${licenseType === 'single'
                      ? 'border-blue-500 bg-blue-500/5'
                      : darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Regular</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personal projects</div>
                </button>
                <button
                  onClick={() => setLicenseType('extended')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${licenseType === 'extended'
                      ? 'border-blue-500 bg-blue-500/5'
                      : darkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Extended</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Commercial use</div>
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <button
                  onClick={handleAddToWishlist}
                  className={`p-4 rounded-xl border-2 transition-all ${isInWishlist(product.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : darkMode
                        ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 text-sm">
                  <Shield size={16} className="text-green-500" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Secure checkout with Stripe</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-yellow-500" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Instant download after purchase</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-blue-500" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Free lifetime updates</span>
                </div>
              </div>
            </div>

            {/* Product Meta Sidebar */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Product Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Version</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.version || '1.0.0'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Last Updated</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {product.last_update || new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>License</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>Standard / Extended</span>
                </div>

                {product.compatibility && product.compatibility.length > 0 && (
                  <div className="pt-2">
                    <span className={`block mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Compatible With</span>
                    <div className="flex flex-wrap gap-2">
                      {product.compatibility.map(item => (
                        <span key={item} className={`px-2.5 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="pt-2">
                    <span className={`block mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span key={tag} className={`px-2.5 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                          }`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs Content (Visible only on mobile) */}
        <div className="lg:hidden mt-12 space-y-8">
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Description</h3>
            <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Features</h3>
            <ul className="space-y-3">
              {product.features?.map((feature, idx) => (
                <li key={idx} className="flex gap-3">
                  <Check size={20} className="text-blue-500 shrink-0" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                </li>
              ))}
            </ul>
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
    </div>
  );
}
