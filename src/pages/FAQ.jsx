import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function FAQ({ darkMode }) {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const { data } = await supabase.from('faq').select('*').order('sort_order');
    setFaqs(data || []);
    setLoading(false);
  };

  const categories = ['all', ...new Set(faqs.map((f) => f.category))];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>FAQ</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">Frequently Asked Questions</h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Find answers to common questions about our products and services
          </p>

          <div className="max-w-2xl mx-auto">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all text-lg ${
                darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-white'
                  : darkMode
                  ? 'glass-dark text-gray-300 hover:bg-gray-800'
                  : 'glass-light text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin text-6xl">⚙️</div>
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No FAQs found
            </h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, idx) => (
              <div key={faq.id} className={`rounded-2xl overflow-hidden ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-cyan-500/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">❓</span>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {faq.question}
                      </h3>
                    </div>
                    {faq.category && (
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                          darkMode ? 'bg-gray-800 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-2xl transition-transform ${
                      openIndex === idx ? 'rotate-180' : ''
                    } ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}
                  >
                    ▼
                  </span>
                </button>

                {openIndex === idx && (
                  <div className={`px-6 pb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-start gap-3 pl-11">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={`rounded-2xl p-8 text-center mt-12 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Still Have Questions?
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/support"
              className="px-6 py-3 rounded-xl font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              Visit Help Center
            </Link>
            <Link
              to="/contact"
              className={`px-6 py-3 rounded-xl font-bold border-2 transition-colors ${
                darkMode
                  ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
                  : 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
              }`}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
