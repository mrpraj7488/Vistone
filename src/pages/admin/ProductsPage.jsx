import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Star,
  MoreVertical,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Copy,
  BarChart3
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dashboards', label: 'Dashboards' },
    { value: 'templates', label: 'Templates' },
    { value: 'themes', label: 'Themes' },
    { value: 'mobile-apps', label: 'Mobile Apps' },
    { value: 'plugins', label: 'Plugins' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'featured', label: 'Featured' },
    { value: 'draft', label: 'Draft' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price Low-High' },
    { value: 'price-high', label: 'Price High-Low' },
    { value: 'sales', label: 'Most Sales' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const transformedProducts = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.featured_image || '/api/placeholder/80/80',
        rating: product.rating_average || 0,
        reviewCount: product.rating_count || 0,
        salesCount: product.sales_count || 0,
        regularPrice: product.regular_price,
        extendedPrice: product.extended_price,
        status: product.status || 'active',
        featured: product.is_featured || false,
        category: product.category || 'Uncategorized',
        publishDate: product.created_at,
        lastUpdated: product.updated_at || product.created_at,
        views: product.views_count || 0
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products with useMemo for performance
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
          product.category.toLowerCase().replace(' ', '-') === selectedCategory;
        const matchesStatus = selectedStatus === 'all' ||
          product.status === selectedStatus ||
          (selectedStatus === 'featured' && product.featured);
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.publishDate) - new Date(a.publishDate);
          case 'oldest':
            return new Date(a.publishDate) - new Date(b.publishDate);
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-low':
            return a.regularPrice - b.regularPrice;
          case 'price-high':
            return b.regularPrice - a.regularPrice;
          case 'sales':
            return b.salesCount - a.salesCount;
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
      setShowBulkActions(false);
    } else {
      const allIds = paginatedProducts.map(p => p.id);
      setSelectedProducts(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      setShowBulkActions(false);
      toast.success(`${selectedProducts.length} products deleted`);
    }
  };

  const handleBulkStatusChange = (status) => {
    setProducts(prev => prev.map(p =>
      selectedProducts.includes(p.id) ? { ...p, status } : p
    ));
    setSelectedProducts([]);
    setShowBulkActions(false);
    toast.success(`${selectedProducts.length} products updated`);
  };

  const ProductActionMenu = ({ product }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
        >
          <MoreVertical size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 py-2">
              <Link
                to={`/admin/products/${product.id}`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-lg mx-2"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Eye size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">View Details</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">See full information</div>
                </div>
              </Link>
              <Link
                to={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 transition-colors rounded-lg mx-2"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Edit size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium">Edit Product</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Modify details</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(product.slug);
                  toast.success('Slug copied to clipboard!');
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors rounded-lg mx-2 w-full text-left"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Copy size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Copy Slug</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Copy URL slug</div>
                </div>
              </button>
              <button
                onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors rounded-lg mx-2 w-full text-left"
              >
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <ExternalLink size={14} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium">View Live</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Open in new tab</div>
                </div>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <Link
                to={`/admin/analytics/products/${product.id}`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 transition-colors rounded-lg mx-2"
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 size={14} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Performance data</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                    setProducts(prev => prev.filter(p => p.id !== product.id));
                    toast.success('Product deleted successfully');
                  }
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-lg mx-2 w-full text-left"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="font-medium">Delete Product</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Permanent removal</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-64 shimmer"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 opacity-80"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-green-100 dark:bg-green-900/30 rounded-full w-16"></div>
                    <div className="h-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-16"></div>
                    <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16"></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-20 border border-gray-200 dark:border-gray-600"></div>
                  <div className="h-10 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-blue-900/40 rounded-lg w-36 border border-blue-200 dark:border-blue-700"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-40"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-36"></div>
              </div>
            </div>
          </div>

          {/* Products Table Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="animate-pulse">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              </div>
              {/* Table Rows */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Products ({filteredProducts.length})
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your digital products and inventory
              </p>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full shadow-sm"></div>
                  <span className="font-medium">{products.filter(p => p.status === 'active').length}</span>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full shadow-sm"></div>
                  <span className="font-medium">{products.filter(p => p.status === 'draft').length}</span>
                  <span>Drafts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm"></div>
                  <span className="font-medium">{products.filter(p => p.featured).length}</span>
                  <span>Featured</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <Link
                to="/admin/products/new"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                Add New Product
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Enhanced Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, category, SKU, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Category Filter */}
              <div className="relative min-w-[160px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Enhanced Status Filter */}
              <div className="relative min-w-[140px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Enhanced Sort Filter */}
              <div className="relative min-w-[150px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Advanced Filter Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProducts.length} of {products.length} products
                </span>
                {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSortBy('newest');
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">View:</span>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                  <button className="p-2 rounded-md bg-blue-500 text-white shadow-sm transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
                    <BarChart3 size={16} />
                  </button>
                  <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    <Package size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Bulk Actions */}
            {showBulkActions && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkStatusChange('active')}
                      className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                    >
                      Mark Active
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('inactive')}
                      className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                    >
                      Mark Inactive
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="w-12 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
                {paginatedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200"
                  >
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-shadow"
                          />
                          {product.featured && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {product.name}
                            </h3>
                            {product.featured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {product.rating}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({product.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {product.salesCount} sales
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {product.views} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Regular:</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${product.regularPrice}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Extended:</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${product.extendedPrice}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${product.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
                          : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        {product.featured && (
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(product.publishDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(product.publishDate).toLocaleDateString('en-US', {
                            weekday: 'short'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(product.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.floor((new Date() - new Date(product.lastUpdated)) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <ProductActionMenu product={product} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 text-sm border rounded ${currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'No products found'
                  : 'No products yet'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  : 'Get started by creating your first product to begin managing your inventory.'
                }
              </p>
              {(!searchQuery && selectedCategory === 'all' && selectedStatus === 'all') && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/admin/products/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Product
                  </Link>
                  <button className="inline-flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Documentation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
