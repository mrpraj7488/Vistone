import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Filter, Grid, List, ArrowRight, Package, Star } from 'lucide-react';

export default function Categories({ darkMode }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category);
        fetchProducts(category.id);
      }
    } else if (!categorySlug) {
      setSelectedCategory(null);
      setProducts([]);
    }
  }, [categorySlug, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          product_count:products(count)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const transformedCategories = data?.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon || '📁',
        color: category.color || '#3B82F6',
        productCount: category.product_count?.[0]?.count || 0,
        parentId: category.parent_id
      })) || [];

      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId) => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug, icon, color)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order(sortBy === 'name' ? 'name' : sortBy === 'price' ? 'price_monthly' : 'created_at', 
               { ascending: sortBy !== 'newest' });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    if (category) {
      navigate(`/categories/${category.slug}`);
    } else {
      navigate('/categories');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build category tree for hierarchical display
  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
      } else {
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    return rootCategories;
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link>
          {' / '}
          <Link to="/categories" className="hover:text-cyan-500">Categories</Link>
          {selectedCategory && (
            <>
              {' / '}
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                {selectedCategory.name}
              </span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">
            {selectedCategory ? selectedCategory.name : 'Product Categories'}
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {selectedCategory 
              ? selectedCategory.description || `Explore our ${selectedCategory.name.toLowerCase()} collection`
              : 'Discover our organized collection of digital products and solutions'
            }
          </p>

          {/* Search and Filters */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={selectedCategory ? "Search products..." : "Search categories..."}
                className={`w-full pl-12 pr-4 py-4 rounded-full border-2 outline-none transition-all text-lg ${
                  darkMode 
                    ? 'glass-dark border-cyan-500/30 text-white' 
                    : 'glass-light border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {selectedCategory && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg border-2 outline-none ${
                    darkMode
                      ? 'glass-dark border-cyan-500/30 text-white'
                      : 'glass-light border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="newest">Newest First</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin text-6xl">⚙️</div>
          </div>
        ) : selectedCategory ? (
          /* Products View */
          <div>
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ← Back to Categories
              </button>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {filteredProducts.length} products found
              </p>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No products found
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {searchQuery ? 'Try adjusting your search terms' : 'This category is currently empty'}
                </p>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
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
                    </div>

                    <div className="p-6">
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.rating_average || 0} ({product.rating_count || 0})
                        </span>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-2xl font-black ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            ${product.price_monthly}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            /mo
                          </span>
                        </div>
                        <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                          darkMode ? 'text-cyan-400' : 'text-cyan-600'
                        }`} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Categories View */
          <div>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📁</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No categories found
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categoryTree.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                        darkMode ? 'glass-dark' : 'glass-light'
                      }`}
                      style={{
                        background: darkMode 
                          ? `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                          : `linear-gradient(135deg, ${category.color}10, ${category.color}05)`
                      }}
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {category.description}
                        </p>
                        <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
                          darkMode ? 'text-cyan-400' : 'text-cyan-600'
                        }`}>
                          <Package size={16} />
                          {category.productCount} products
                        </div>
                      </div>
                    </button>

                    {/* Child Categories */}
                    {category.children && category.children.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 ml-4">
                        {category.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleCategorySelect(child)}
                            className={`p-4 rounded-lg transition-colors text-left ${
                              darkMode 
                                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' 
                                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{child.icon}</span>
                              <div>
                                <div className="font-medium">{child.name}</div>
                                <div className="text-xs opacity-75">{child.productCount} products</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
