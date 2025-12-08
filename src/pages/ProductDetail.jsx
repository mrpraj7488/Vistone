import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function ProductDetail({ darkMode }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [features, setFeatures] = useState([]);
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
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // Fetch product with all fields
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (productData) {
        setProduct(productData);

        // Fetch reviews if the table exists
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);

        // Features are now stored in the features column as an array
        // We don't need to fetch from product_features table
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
    addToWishlist(product);
    showToast('Added to wishlist!', 'success');
  };

  // Map license types to prices
  const price = licenseType === 'extended' ? product?.extended_price : product?.regular_price;

  const getImages = () => {
    if (!product) return [];
    // Use gallery_images if available, otherwise fall back to featured_image
    if (product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      return [product.featured_image, ...product.gallery_images].filter(Boolean);
    }
    return [product.featured_image].filter(Boolean);
  };

  const images = getImages();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin text-6xl">⚙️</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <Link to="/products" className="hover:text-cyan-500">Products</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img
                src={images[selectedImage] || '/api/placeholder/800/600'}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden border-4 transition-all ${selectedImage === idx
                    ? 'border-cyan-500'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img src={img || '/api/placeholder/100/100'} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            {product.category && (
              <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {product.category}
              </span>
            )}

            <h1 className={`text-4xl font-black mt-2 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h1>

            <p className={`text-xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.short_description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {product.rating || 0} ({product.rating_count || 0} reviews)
              </span>
              <span className="text-gray-400">|</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {product.sales_count || 0} sales
              </span>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-black text-gradient mb-2">
                ${price}
                <span className={`text-lg font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  /{licenseType === 'extended' ? 'extended' : 'regular'}
                </span>
              </div>
            </div>

            <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Lifetime Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>6 Months Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>30-Day Money Back</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={`block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                License Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setLicenseType('regular')}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${licenseType === 'regular'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Regular License
                </button>
                <button
                  onClick={() => setLicenseType('extended')}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${licenseType === 'extended'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Extended License
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className={`block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-12 h-12 rounded-lg font-bold text-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                >
                  -
                </button>
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`w-12 h-12 rounded-lg font-bold text-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Button onClick={handleAddToCart} className="flex-1">
                🛒 Add to Cart
              </Button>
              <Button
                variant={isInWishlist(product.id) ? 'primary' : 'secondary'}
                onClick={handleAddToWishlist}
              >
                ❤️
              </Button>
            </div>

            <div className={`grid grid-cols-3 gap-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>🔒 Secure Checkout</div>
              <div>📦 Instant Delivery</div>
              <div>💳 All Cards Accepted</div>
            </div>

            {/* Product Details Sidebar */}
            <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Version</span>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.version || '1.0.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Updated</span>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.last_update || new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                {product.compatibility && product.compatibility.length > 0 && (
                  <div>
                    <span className={`block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Compatible With</span>
                    <div className="flex flex-wrap gap-1">
                      {product.compatibility.map(item => (
                        <span key={item} className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <span className={`block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {['description', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab
                  ? 'text-cyan-500 border-b-4 border-cyan-500'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features && Array.isArray(product.features) && product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Feature {idx + 1}
                  </h3>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {feature}
                  </p>
                </div>
              ))}
              {(!product.features || product.features.length === 0) && (
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No specific features listed.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Reviews
                </h3>
                <Button onClick={() => setReviewModalOpen(true)}>Write a Review</Button>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-6 rounded-xl ${darkMode ? 'glass-dark' : 'glass-light'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">👤</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Anonymous User
                            </span>
                            {review.is_verified_purchase && (
                              <span className="text-green-500 text-sm">✓ Verified Purchase</span>
                            )}
                          </div>
                          <div className="flex text-yellow-400">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {review.title}
                      </h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Please sign in to write a review.</p>
          <Button onClick={() => setReviewModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
