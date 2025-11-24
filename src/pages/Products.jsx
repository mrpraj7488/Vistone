import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

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
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        technologies:product_technologies(technology:technologies(name, color))
      `);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (sortBy === 'price-low') {
      query = query.order('price_monthly', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price_monthly', { ascending: false });
    } else if (sortBy === 'rating') {
      query = query.order('rating_average', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('sales_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
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
    if (selectedRating && product.rating_average < selectedRating) return false;
    if (product.price_monthly < priceRange[0] || product.price_monthly > priceRange[1])
      return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Link to="/" className="hover:text-cyan-500">
              Home
            </Link>{' '}
            / <span className={darkMode ? 'text-white' : 'text-gray-900'}>Products</span>
          </nav>
          <h1 className={`text-5xl font-black mb-4 text-gradient`}>
            Our Software Solutions
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover powerful tools to transform your business
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div
              className={`rounded-2xl p-6 sticky top-24 ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filters
              </h3>

              <div className="mb-8">
                <h4
                  className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Categories
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory
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
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
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
                  className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
                    $0 - ${priceRange[1]}/month
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4
                  className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedRating === rating
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
                className="w-full"
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
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Showing {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg border-2 outline-none ${
                    darkMode
                      ? 'glass-dark border-cyan-500/30 text-white'
                      : 'glass-light border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid'
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
                    className={`p-2 rounded-lg ${
                      viewMode === 'list'
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
                className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                      darkMode ? 'glass-dark' : 'glass-light'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                      <img
                        src={product.featured_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.is_new && (
                        <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          New
                        </span>
                      )}
                      {product.is_popular && (
                        <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      {product.category && (
                        <span
                          className={`text-sm font-bold ${
                            darkMode ? 'text-cyan-400' : 'text-cyan-600'
                          }`}
                        >
                          {product.category.name}
                        </span>
                      )}

                      <h3
                        className={`text-xl font-bold mt-2 mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-yellow-400">{'⭐'.repeat(Math.floor(product.rating_average))}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.rating_average} ({product.rating_count})
                        </span>
                      </div>

                      <p
                        className={`text-sm mb-4 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {product.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className={`text-2xl font-black ${
                              darkMode ? 'text-cyan-400' : 'text-cyan-600'
                            }`}
                          >
                            ${product.price_monthly}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            /mo
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleAddToWishlist(product, e)}
                            className={`p-2 rounded-lg transition-all ${
                              isInWishlist(product.id)
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
                            className="p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
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
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📦</div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  No products found
                </h3>
                <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
      </div>
    </div>
  );
}
