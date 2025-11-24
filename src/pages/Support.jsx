import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

export default function Support({ darkMode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchData = async () => {
    const [categoriesResult, featuredResult, trendingResult] = await Promise.all([
      supabase.from('help_categories').select('*').order('sort_order'),
      supabase.from('help_articles').select('*').eq('is_featured', true).limit(6),
      supabase.from('help_articles').select('*').eq('is_trending', true).limit(4),
    ]);

    setCategories(categoriesResult.data || []);
    setFeaturedArticles(featuredResult.data || []);
    setTrendingArticles(trendingResult.data || []);
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    const { data } = await supabase
      .from('help_articles')
      .select('id, title, slug')
      .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
      .limit(5);

    setSuggestions(data || []);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/support/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularTopics = [
    { icon: '🚀', title: 'Getting Started', description: 'Quick setup guides', link: '/support/category/getting-started' },
    { icon: '👤', title: 'Account Management', description: 'Profile and settings', link: '/support/category/account-management' },
    { icon: '💳', title: 'Billing & Payments', description: 'Invoices and subscriptions', link: '/support/category/billing-payments' },
    { icon: '🔧', title: 'Technical Issues', description: 'Troubleshooting help', link: '/support/category/technical-issues' },
    { icon: '📥', title: 'Downloads & Licenses', description: 'Manage your software', link: '/support/category/downloads-licenses' },
    { icon: '📡', title: 'API Documentation', description: 'Integration guides', link: '/support/category/api-documentation' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 text-gradient">How Can We Help You?</h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Search our knowledge base or browse categories below
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles, tutorials, FAQs..."
                className={`w-full px-6 py-5 pr-16 rounded-full border-2 outline-none transition-all text-lg ${
                  darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-bold"
              >
                Search
              </button>
            </div>

            {suggestions.length > 0 && (
              <div
                className={`absolute w-full mt-2 rounded-2xl p-4 shadow-2xl z-10 ${
                  darkMode ? 'glass-dark' : 'glass-light'
                }`}
              >
                <p className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Suggestions
                </p>
                {suggestions.map((article) => (
                  <Link
                    key={article.id}
                    to={`/support/article/${article.slug}`}
                    className={`block p-3 rounded-lg hover:bg-cyan-500/10 transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTopics.map((topic, idx) => (
              <Link
                key={idx}
                to={topic.link}
                className={`rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                  darkMode ? 'glass-dark' : 'glass-light'
                }`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{topic.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {topic.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-3xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Knowledge Base Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/support/category/${category.slug}`}
                  className={`rounded-2xl p-6 flex items-start gap-4 transition-all hover:-translate-y-1 ${
                    darkMode ? 'glass-dark' : 'glass-light'
                  }`}
                >
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                    <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      {category.article_count} articles
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-3xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/support/article/${article.slug}`}
                  className={`rounded-2xl p-6 transition-all hover:-translate-y-2 ${darkMode ? 'glass-dark' : 'glass-light'}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400">⭐</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {article.view_count} views
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {article.title}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {article.excerpt}
                  </p>
                  <div className={`flex items-center gap-2 font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    Read More <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className={`rounded-2xl p-8 ${darkMode ? 'bg-gradient-to-br from-cyan-900 to-blue-900' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-black text-white mb-3">Live Chat Support</h3>
            <p className="text-white/90 mb-6">Get instant help from our support team</p>
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Chat
            </Button>
          </div>

          <div className={`rounded-2xl p-8 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-500 to-pink-600'}`}>
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-2xl font-black text-white mb-3">Submit a Ticket</h3>
            <p className="text-white/90 mb-6">We'll get back to you within 24 hours</p>
            <Link to="/support/tickets/new">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Create Ticket
              </Button>
            </Link>
          </div>
        </div>

        <div className={`rounded-2xl p-8 text-center ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Need More Help?
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-sm font-bold mb-1">Email</div>
              <a href="mailto:support@vistone.com" className="text-cyan-500 hover:underline">
                support@vistone.com
              </a>
            </div>
            <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-sm font-bold mb-1">Phone</div>
              <a href="tel:+15551234567" className="text-cyan-500 hover:underline">
                +1 (555) 123-4567
              </a>
            </div>
            <div className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-sm font-bold mb-1">Hours</div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
