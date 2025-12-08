import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore, useWishlistStore, useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import {
    Filter, X, ChevronDown, Search, Grid, List, Heart,
    ShoppingCart, Star, SlidersHorizontal, Check, Zap, Flame, Timer, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Products({ darkMode }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        let query = supabase.from('products').select('*');

        if (selectedCategory) {
            query = query.eq('category', selectedCategory);
        }

        query = query.eq('status', 'active');

        if (sortBy === 'price-low') {
            query = query.order('regular_price', { ascending: true });
        } else if (sortBy === 'price-high') {
            query = query.order('regular_price', { ascending: false });
        } else if (sortBy === 'rating') {
            query = query.order('rating', { ascending: false });
        } else if (sortBy === 'popular') {
            query = query.order('sales_count', { ascending: false });
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
        e.stopPropagation(); // Prevent navigation
        addToCart(product);
        showToast('Added to cart!', 'success');
    };

    const handleAddToWishlist = (product, e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation
        addToWishlist(product);
        showToast('Added to wishlist!', 'success');
    };

    const filteredProducts = products.filter((product) => {
        if (selectedRating && (product.rating || 0) < selectedRating) return false;
        const price = product.regular_price || 0;
        if (price < priceRange[0] || price > priceRange[1]) return false;
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const FilterContent = () => (
        <div className="space-y-8">
            <div>
                <h4 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Categories
                </h4>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : darkMode
                                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id || cat.name}
                            onClick={() => setSelectedCategory(cat.name || cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${selectedCategory === (cat.name || cat.id)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : darkMode
                                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <span>{cat.name}</span>
                            {selectedCategory === (cat.name || cat.id) && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Price Range
                </h4>
                <div className="space-y-4 px-1">
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                    />
                    <div className={`flex justify-between text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>$0</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Rating
                </h4>
                <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedRating === rating
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : darkMode
                                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-slate-400"} />
                                ))}
                            </div>
                            <span>& Up</span>
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
                    setSearchQuery('');
                }}
            >
                Reset Filters
            </Button>
        </div>
    );

    return (
        <div className={`min-h-screen pt-24 pb-20 ${darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
            <Container>
                {/* Header Section */}
                <div className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <nav className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link> / <span className={darkMode ? 'text-white' : 'text-slate-900'}>Products</span>
                            </nav>
                            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Explore Solutions
                            </h1>
                            <p className={`text-lg max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Premium digital products designed to accelerate your workflow.
                            </p>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${darkMode
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                                }`}
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className={`sticky top-28 rounded-2xl p-6 border ${darkMode
                            ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                            : 'bg-white/50 border-slate-200 backdrop-blur-xl'
                            }`}>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    <AnimatePresence>
                        {showMobileFilters && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowMobileFilters(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className={`fixed right-0 top-0 h-full w-[300px] z-50 p-6 overflow-y-auto ${darkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Filters</h3>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <FilterContent />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center justify-between ${darkMode
                            ? 'bg-slate-900/50 border-slate-800'
                            : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                            <div className="relative w-full sm:w-auto sm:min-w-[240px]">
                                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all ${darkMode
                                        ? 'bg-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50'
                                        : 'bg-slate-100 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50'
                                        }`}
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm outline-none border cursor-pointer ${darkMode
                                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                                        }`}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>

                                <div className={`hidden sm:flex p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid'
                                            ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list'
                                            ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`aspect-[4/5] rounded-2xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                                }`}>
                                {filteredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/products/${product.slug}`}
                                        className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode
                                            ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30'
                                            : 'bg-white border-slate-200 hover:border-blue-500/30 hover:shadow-blue-500/10'
                                            } ${product.trending ? 'ring-1 ring-rose-500/50 shadow-lg shadow-rose-500/10' : ''}`}
                                    >
                                        {/* Image Container - 4:3 Aspect Ratio */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={product.featured_image || '/api/placeholder/400/300'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Floating Actions */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
                                                <button
                                                    onClick={(e) => handleAddToWishlist(product, e)}
                                                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${isInWishlist(product.id)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
                                                        }`}
                                                >
                                                    <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                                </button>
                                            </div>

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                                                {product.is_featured && (
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 shadow-lg shadow-amber-900/20 flex items-center gap-1">
                                                        <Sparkles size={10} /> Featured
                                                    </span>
                                                )}
                                                {product.trending && (
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 flex items-center gap-1 animate-pulse">
                                                        <Flame size={10} className="fill-white" /> Hot Sale
                                                    </span>
                                                )}
                                            </div>

                                            {/* Hype Banner for Trending/Sale */}
                                            {(product.trending || product.sale_price) && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-md text-white text-[10px] font-bold py-2 px-2 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                                                    <Timer size={12} className="animate-spin-slow" />
                                                    <span>Selling Fast! Limited Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-4 sm:p-5 flex flex-col">
                                            <div className="mb-1.5">
                                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                    {product.category}
                                                </span>
                                            </div>

                                            <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {product.name}
                                            </h3>

                                            <div className="flex items-center gap-1.5 mb-4">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 0) ? "" : "text-slate-300 dark:text-slate-600"} />
                                                    ))}
                                                </div>
                                                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {product.rating || 0}
                                                </span>
                                                <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-500'}`}>
                                                    ({product.rating_count || 0} reviews)
                                                </span>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex flex-col">
                                                        {product.sale_price ? (
                                                            <>
                                                                <span className={`text-[10px] line-through ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                    ${product.regular_price}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-lg sm:text-xl font-black text-rose-500">
                                                                        ${product.sale_price}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className={`text-[10px] sm:text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Price</span>
                                                                <span className={`text-lg sm:text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                                    ${product.regular_price}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => handleAddToCart(product, e)}
                                                        className={`relative overflow-hidden flex-1 h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg group/btn transition-all ${darkMode
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
                                                            }`}
                                                    >
                                                        <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                                                        <span>Buy Now</span>
                                                        <ShoppingCart size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Search size={40} className={darkMode ? 'text-slate-600' : 'text-slate-400'} />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    No products found
                                </h3>
                                <p className={`max-w-md mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    We couldn't find any products matching your filters. Try adjusting your search or filter criteria.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setPriceRange([0, 200]);
                                        setSelectedRating(null);
                                        setSearchQuery('');
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </Container>
        </div>
    );
}
