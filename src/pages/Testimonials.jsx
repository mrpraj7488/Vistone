import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Filter, ArrowRight, Quote, User, Building } from 'lucide-react';

export default function Testimonials({ darkMode }) {
  const [testimonials, setTestimonials] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    fetchProducts();
  }, [sortBy, selectedProduct, selectedRating]);

  const fetchTestimonials = async () => {
    setLoading(true);
    let query = supabase
      .from('testimonials')
      .select(`
        *,
        product:products(name, slug)
      `);

    if (selectedProduct !== 'all') {
      query = query.eq('product_id', selectedProduct);
    }

    if (selectedRating) {
      query = query.gte('rating', selectedRating);
    }

    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    setTestimonials(data || []);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug')
      .order('name');

    setProducts(data || []);
  };

  const ratingStats = [5, 4, 3, 2, 1].map(rating => {
    const count = testimonials.filter(t => t.rating === rating).length;
    const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const averageRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    : 0;

  return (
    <div className={`min-h-screen pt-20 pb-20 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className={`relative py-20 border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              Customer Stories
            </span>
            <h1 className={`text-5xl md:text-6xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Thousands</span>
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't just take our word for it. See what our customers have to say about their experience with Vistone products.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
          >
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} className={i < Math.round(averageRating) ? "" : "opacity-30"} />
                ))}
              </div>
              <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Average Rating</div>
            </div>

            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {testimonials.length}+
              </div>
              <div className={`text-blue-500 mb-2`}>
                <MessageSquare size={20} className="mx-auto" />
              </div>
              <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Verified Reviews</div>
            </div>

            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                98%
              </div>
              <div className={`text-emerald-500 mb-2`}>
                <Quote size={20} className="mx-auto" />
              </div>
              <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recommendation Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border-2 outline-none font-medium cursor-pointer transition-all ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>

            <select
              value={selectedRating || ''}
              onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
              className={`px-4 py-2.5 rounded-xl border-2 outline-none font-medium cursor-pointer transition-all ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`w-full md:w-64 px-4 py-2.5 rounded-xl border-2 outline-none font-medium cursor-pointer transition-all ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
            >
              <option value="all">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
              <MessageSquare size={48} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No testimonials found
            </h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex flex-col h-full p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                      {testimonial.avatar || testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {testimonial.role}
                        {testimonial.company && <span className="opacity-75"> @ {testimonial.company}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                        className={i < testimonial.rating ? "text-amber-400" : "text-slate-300 dark:text-slate-700"}
                      />
                    ))}
                  </div>

                  <div className="relative flex-1">
                    <Quote size={24} className={`absolute -top-2 -left-2 opacity-10 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                    <p className={`relative z-10 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      "{testimonial.content}"
                    </p>
                  </div>

                  {testimonial.product && (
                    <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <Link
                        to={`/products/${testimonial.product.slug}`}
                        className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}
                      >
                        <span className={`px-2 py-1 rounded-md text-xs ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>Product</span>
                        {testimonial.product.name}
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
