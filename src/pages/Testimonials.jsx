import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Testimonials</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 text-gradient">What Our Clients Say</h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Real feedback from real customers
          </p>

          <div className="flex justify-center gap-6 mt-8">
            <div className={`px-8 py-4 rounded-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <div className="text-4xl font-black text-gradient">{averageRating.toFixed(1)}</div>
              <div className="text-yellow-400 text-2xl">{'⭐'.repeat(Math.round(averageRating))}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Average Rating
              </div>
            </div>
            <div className={`px-8 py-4 rounded-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <div className="text-4xl font-black text-gradient">{testimonials.length}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Reviews
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-8 mb-12 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Overall Customer Rating
          </h2>

          <div className="space-y-4">
            {ratingStats.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-24">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rating}</span>
                  <span className="text-yellow-400">⭐</span>
                </div>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className={`w-20 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {percentage.toFixed(0)}% ({count})
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border-2 outline-none ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>

            <select
              value={selectedRating || ''}
              onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
              className={`px-4 py-2 rounded-lg border-2 outline-none ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={`px-4 py-2 rounded-lg border-2 outline-none ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
          >
            <option value="all">All Products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin text-6xl">⚙️</div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💬</div>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No testimonials found
            </h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 ${darkMode ? 'glass-dark' : 'glass-light'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role}
                      {testimonial.company && `, ${testimonial.company}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                </div>

                <p className={`leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {testimonial.content}
                </p>

                {testimonial.product && (
                  <Link
                    to={`/products/${testimonial.product.slug}`}
                    className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}
                  >
                    Product: {testimonial.product.name}
                  </Link>
                )}

                <div className="mt-4 text-green-500 font-bold flex items-center gap-2">
                  <span>✓</span> Verified Customer
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
