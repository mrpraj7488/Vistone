import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Container } from '../components/layout/Container';

export default function Blog({ darkMode }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('category')
      .not('category', 'is', null);

    const uniqueCategories = [...new Set(data?.map(p => p.category) || [])];
    setCategories(uniqueCategories);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 ${
        darkMode ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      <Container>
        <nav
          className={`mb-4 sm:mb-6 text-xs sm:text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <Link to="/" className="hover:text-cyan-500">
            Home
          </Link>{' '}
          / <span className={darkMode ? 'text-white' : 'text-gray-900'}>Blog</span>
        </nav>

        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1
            className="font-black mb-2 text-gradient"
            style={{
              fontSize: 'clamp(2rem, 4vw + 0.5rem, 3rem)', // 32px - 48px
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
            }}
          >
            Our Blog
          </h1>
          <p
            className={`mb-6 sm:mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)', // 15px - 18px
              lineHeight: 1.6,
            }}
          >
            Latest insights, tutorials, and industry news.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 outline-none transition-all text-sm sm:text-base ${
                  darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-lg sm:text-2xl">
                🔍
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <aside className="w-full lg:w-1/4">
            <div className={`rounded-2xl p-4 sm:p-5 lg:p-6 ${darkMode ? 'glass-dark' : 'glass-light'} lg:sticky lg:top-24`}>
              <h3
                className={`font-bold mb-4 sm:mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{
                  fontSize: 'clamp(1.05rem, 1.9vw, 1.25rem)', // 17px - 20px
                }}
              >
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  All Posts ({posts.length})
                </button>
                {categories.map((cat) => {
                  const count = posts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-cyan-500 text-white'
                          : darkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-sm">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-8">
                <h3
                  className={`font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{
                    fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                  }}
                >
                  Newsletter
                </h3>
                <p
                  className={`mb-3 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  style={{
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  }}
                >
                  Get weekly updates.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className={`w-full px-3 py-2 rounded-lg border-2 outline-none mb-2 text-sm ${
                    darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                  }`}
                />
                <button className="w-full px-3 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors text-sm font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>

          <main className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-7xl sm:text-8xl mb-4 sm:mb-6">📝</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No articles found
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer ${darkMode ? 'glass-dark' : 'glass-light'}`}
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 lg:p-6">
                      <div
                        className={`flex items-center gap-2 sm:gap-3 mb-2.5 sm:mb-3 text-xs sm:text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.read_time || 5} min read</span>
                      </div>

                      <h3
                        className={`font-bold mb-2.5 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{
                          fontSize: 'clamp(1rem, 1.9vw, 1.25rem)', // 16px - 20px
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        className={`mb-3 sm:mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        style={{
                          fontSize: 'clamp(0.85rem, 1.5vw, 0.98rem)',
                        }}
                      >
                        {post.excerpt}
                      </p>

                      <div
                        className={`inline-flex items-center gap-1.5 font-semibold transition-all group-hover:gap-3 ${
                          darkMode ? 'text-cyan-400' : 'text-cyan-600'
                        }`}
                        style={{
                          fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                        }}
                      >
                        Read More <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
