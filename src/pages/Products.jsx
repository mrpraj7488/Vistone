import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { Container } from '../components/layout/Container';

export default function Products({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedRating, setSelectedRating] = useState(null);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    // Select all fields. We don't use relations because category is a string column
    // and technologies are stored in tech_stack array
    let query = supabase
      .from('products')
      .select('*');

    if (selectedCategory) {
      // If selectedCategory is a string (from our hardcoded list), match it
      // If it was an ID, we'd need to check how categories are handled.
      // For now, assuming category is a string column based on ProductForm
      query = query.eq('category', selectedCategory);
    }

    // Only show active products
    query = query.eq('status', 'active');

    if (sortBy === 'price-low') {
      query = query.order('regular_price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('regular_price', { ascending: false });
    } else if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('sales_count', { ascending: false }); // Assuming sales_count exists
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
    }

    setProducts(data || []);
    setLoading(false);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product);
    showToast('Added to cart!', 'success');
  };

  const handleAddToWishlist = (product, e) => {
    e.preventDefault();
    addToWishlist(product);
    showToast('Added to wishlist!', 'success');
  };

  const filteredProducts = products.filter((product) => {
    if (selectedRating && (product.rating || 0) < selectedRating) return false;
    // Use regular_price instead of price_monthly
    const price = product.regular_price || 0;
    if (price < priceRange[0] || price > priceRange[1])
      return false;
    return true;
  });

  return (
    <div
      className={`min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'
        }`}
    >
      <Container>
        <div className="mb-10 sm:mb-12">
          <nav
            className={`mb-3 sm:mb-4 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
          >
            <Link to="/" className="hover:text-cyan-500">
              Home
            </Link>{' '}
            / <span className={darkMode ? 'text-white' : 'text-gray-900'}>Products</span>
          </nav>
          <h1
            className="font-black mb-2 text-gradient"
            style={{
              fontSize: 'clamp(2rem, 4vw + 0.5rem, 3rem)', // 32px - 48px
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
            }}
          >
            Our Software Solutions
          </h1>
          <p
            className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)', // 15px - 18px
              lineHeight: 1.6,
            }}
          >
            Discover powerful tools to transform your business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <aside className="w-full lg:w-1/4">
            <div
              className={`rounded-2xl p-4 sm:p-5 lg:p-6 ${darkMode ? 'glass-dark' : 'glass-light'
                } lg:sticky lg:top-24`}
            >
              <h3
                className={`font-bold mb-4 sm:mb-5 ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                style={{
                  fontSize: 'clamp(1.05rem, 1.9vw, 1.25rem)', // 17px - 20px
                }}
              >
                Filters
              </h3>

              <div className="mb-8">
                <h4
                  className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  style={{
                    fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', // 14px - 16px
                  }}
                >
                  Categories
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${!selectedCategory
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id || cat.name} // Handle if cat is just object with name
                      onClick={() => setSelectedCategory(cat.name || cat.id)} // Use name if that's what we filter by
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === (cat.name || cat.id)
                          ? 'bg-cyan-500 text-white'
                          : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                      <span>
                        {cat.icon} {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4
                  className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  style={{
                    fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
                  }}
                >
                  Price Range
                </h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    $0 - ${priceRange[1]}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4
                  className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  style={{
                    fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
                  }}
                >
                  Minimum Rating
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setSelectedRating(selectedRating === rating ? null : rating)
                      }
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedRating === rating
                          ? 'bg-cyan-500 text-white'
                          : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                      {'⭐'.repeat(rating)}+ & Up
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange([0, 200]);
                  setSelectedRating(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <p
                className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                style={{
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                }}
              >
                Showing {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-3 sm:gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg border-2 outline-none ${darkMode
                      ? 'glass-dark border-cyan-500/30 text-white'
                      : 'glass-light border-gray-200 text-gray-900'
                    }`}
                  style={{
                    fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)',
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'grid'
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    ▦
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'list'
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : (
              <div
                className={`grid gap-5 sm:gap-6 lg:gap-8 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                  }`}
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${darkMode ? 'glass-dark' : 'glass-light'
                      }`}
                  >
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                      <img
                        src={product.featured_image || '/api/placeholder/400/300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.is_featured && (
                        <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </span>
                      )}
                      {product.trending && (
                        <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Trending
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 lg:p-6">
                      {product.category && (
                        <span
                          className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'
                            }`}
                        >
                          {product.category}
                        </span>
                      )}

                      <h3
                        className={`font-bold mt-2 mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        style={{
                          fontSize: 'clamp(1rem, 1.9vw, 1.25rem)', // 16px - 20px
                        }}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-yellow-400">{'⭐'.repeat(Math.floor(product.rating || 0))}</span>
                        <span
                          className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          style={{
                            fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)',
                          }}
                        >
                          {product.rating || 0} ({product.rating_count || 0})
                        </span>
                      </div>

                      <p
                        className={`mb-3 sm:mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        style={{
                          fontSize: 'clamp(0.85rem, 1.5vw, 0.98rem)',
                        }}
                      >
                        {product.short_description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className={`font-black ${darkMode ? 'text-cyan-400' : 'text-cyan-600'
                              }`}
                            style={{
                              fontSize: 'clamp(1.2rem, 2.1vw, 1.6rem)', // 19px - 25px
                            }}
                          >
                            ${product.regular_price}
                          </span>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => handleAddToWishlist(product, e)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-all ${isInWishlist(product.id)
                                ? 'bg-red-500 text-white'
                                : darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                          >
                            ❤️
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="p-1.5 sm:p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                          >
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="text-7xl sm:text-8xl mb-4 sm:mb-6">📦</div>
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                >
                  No products found
                </h3>
                <p className={`mb-6 sm:mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Try adjusting your filters or browse all products
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 200]);
                    setSelectedRating(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
