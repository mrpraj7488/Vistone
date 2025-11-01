import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
      .lte('published_at', new Date().toISOString())
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
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Blog</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">Our Blog</h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Latest insights, tutorials, and industry news
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all text-lg ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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

              <div className="mt-8">
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Newsletter
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get weekly updates
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className={`w-full px-4 py-2 rounded-lg border-2 outline-none mb-2 ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                />
                <button className="w-full px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:w-3/4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📝</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No articles found
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${darkMode ? 'glass-dark' : 'glass-light'}`}
                  >
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
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

                    <div className="p-6">
                      <div className={`flex items-center gap-3 mb-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.read_time} min read</span>
                      </div>

                      <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {post.title}
                      </h3>

                      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {post.excerpt}
                      </p>

                      <div className={`flex items-center gap-2 font-bold transition-all group-hover:gap-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        Read More <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
