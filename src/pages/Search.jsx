import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Search({ darkMode }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ products: [], blog: [] });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    if (!query || query.length < 2) return;

    setLoading(true);
    const searchTerm = `%${query.toLowerCase()}%`;

    const [productsResult, blogResult] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, tagline, featured_image, price_monthly, rating_average')
        .or(`name.ilike.${searchTerm},tagline.ilike.${searchTerm},description.ilike.${searchTerm}`),
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, read_time')
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .lte('published_at', new Date().toISOString())
    ]);

    setResults({
      products: productsResult.data || [],
      blog: blogResult.data || [],
    });
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const filteredResults = {
    products: filter === 'all' || filter === 'products' ? results.products : [],
    blog: filter === 'all' || filter === 'blog' ? results.blog : [],
  };

  const totalResults = filteredResults.products.length + filteredResults.blog.length;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Search</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-5xl font-black mb-8 text-gradient">Search</h1>

          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, blog posts..."
                className={`w-full px-6 py-4 pr-24 rounded-full border-2 outline-none transition-all text-lg ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-bold"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {searchQuery && (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {loading ? 'Searching...' : `Found ${totalResults} results for "${searchQuery}"`}
              </p>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                      ? 'glass-dark text-gray-300'
                      : 'glass-light text-gray-700'
                  }`}
                >
                  All ({results.products.length + results.blog.length})
                </button>
                <button
                  onClick={() => setFilter('products')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'products'
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                      ? 'glass-dark text-gray-300'
                      : 'glass-light text-gray-700'
                  }`}
                >
                  Products ({results.products.length})
                </button>
                <button
                  onClick={() => setFilter('blog')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'blog'
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                      ? 'glass-dark text-gray-300'
                      : 'glass-light text-gray-700'
                  }`}
                >
                  Blog ({results.blog.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">��</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No results found
                </h3>
                <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Try different keywords or browse our products
                </p>
                <Link to="/products" className="inline-block px-6 py-3 rounded-xl font-bold btn-gradient">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredResults.products.length > 0 && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Products ({filteredResults.products.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredResults.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          className={`rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-2 group ${darkMode ? 'glass-dark' : 'glass-light'}`}
                        >
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                            <img
                              src={product.featured_image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
                              PRODUCT
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {product.name}
                            </h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {product.tagline}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-2xl font-black ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                ${product.price_monthly}
                              </span>
                              <span className="text-yellow-400">
                                ⭐ {product.rating_average}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {filteredResults.blog.length > 0 && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Blog Posts ({filteredResults.blog.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredResults.blog.map((post) => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className={`rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-2 group ${darkMode ? 'glass-dark' : 'glass-light'}`}
                        >
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600">
                            {post.featured_image && (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            )}
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
                              BLOG POST
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {post.title}
                            </h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {post.excerpt}
                            </p>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(post.published_at).toLocaleDateString()} • {post.read_time} min read
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!searchQuery && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Start Searching
            </h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Enter a search term to find products, blog posts, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
