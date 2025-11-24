import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Clock,
  ArrowRight,
  Command,
  X
} from 'lucide-react';

const AdvancedSearch = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Sample data for fuzzy matching
  const searchData = [
    // Products
    { id: 1, type: 'product', title: 'React Dashboard Pro', subtitle: '$49 - Active', icon: Package, path: '/admin/products/1' },
    { id: 2, type: 'product', title: 'Vue Admin Template', subtitle: '$79 - Active', icon: Package, path: '/admin/products/2' },
    { id: 3, type: 'product', title: 'Angular Dashboard', subtitle: '$59 - Inactive', icon: Package, path: '/admin/products/3' },
    { id: 4, type: 'product', title: 'React Native App', subtitle: '$89 - Featured', icon: Package, path: '/admin/products/4' },
    
    // Orders
    { id: 5, type: 'order', title: 'Order #12345', subtitle: 'John Doe - $49', icon: ShoppingBag, path: '/admin/orders/12345' },
    { id: 6, type: 'order', title: 'Order #12344', subtitle: 'Sarah Smith - $79', icon: ShoppingBag, path: '/admin/orders/12344' },
    { id: 7, type: 'order', title: 'Order #12343', subtitle: 'Mike Johnson - $59', icon: ShoppingBag, path: '/admin/orders/12343' },
    
    // Users
    { id: 8, type: 'user', title: 'John Doe', subtitle: 'john@email.com - Customer', icon: Users, path: '/admin/users/8' },
    { id: 9, type: 'user', title: 'Sarah Smith', subtitle: 'sarah@email.com - Customer', icon: Users, path: '/admin/users/9' },
    { id: 10, type: 'user', title: 'Mike Johnson', subtitle: 'mike@email.com - Admin', icon: Users, path: '/admin/users/10' },
    
    // Blog Posts
    { id: 11, type: 'blog', title: 'Getting Started with React', subtitle: 'Published - 234 views', icon: FileText, path: '/admin/blogs/11' },
    { id: 12, type: 'blog', title: 'Vue.js Best Practices', subtitle: 'Draft - 0 views', icon: FileText, path: '/admin/blogs/12' },
  ];

  // Quick actions
  const quickActions = [
    { title: 'Add New Product', subtitle: 'Create a new digital product', icon: Package, path: '/admin/products/new' },
    { title: 'New Blog Post', subtitle: 'Write a new article', icon: FileText, path: '/admin/blogs/new' },
    { title: 'Add User', subtitle: 'Create a new user account', icon: Users, path: '/admin/users/new' },
  ];

  // Fuzzy search implementation
  const fuzzySearch = useCallback((query, items) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    
    return items
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const subtitleMatch = item.subtitle.toLowerCase().includes(searchTerm);
        
        // Simple scoring system
        let score = 0;
        if (titleMatch) score += 10;
        if (subtitleMatch) score += 5;
        
        // Bonus for exact matches
        if (item.title.toLowerCase() === searchTerm) score += 20;
        if (item.title.toLowerCase().startsWith(searchTerm)) score += 15;
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limit results
  }, []);

  // Perform search
  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      
      // Simulate API delay
      const timer = setTimeout(() => {
        const searchResults = fuzzySearch(searchQuery, searchData);
        setResults(searchResults);
        setSelectedIndex(0);
        setLoading(false);
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [searchQuery, fuzzySearch]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('adminRecentSearches', JSON.stringify(updated));
  };


  // Handle selection
  const handleSelect = () => {
    const allItems = [...results, ...quickActions];
    const selectedItem = allItems[selectedIndex];
    
    if (selectedItem) {
      saveRecentSearch(searchQuery);
      navigate(selectedItem.path);
      onClose();
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    saveRecentSearch(searchQuery);
    navigate(item.path);
    onClose();
  };

  // Handle recent search click
  const handleRecentClick = (query) => {
    setSearchQuery(query);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('adminRecentSearches');
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const typeColors = {
    product: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    order: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    user: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    blog: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-start justify-center pt-20 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
            </div>
          ) : searchQuery.trim() ? (
            <>
              {/* Search Results */}
              {results.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Search Results ({results.length})
                  </div>
                  {results.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    
                    return (
                      <button
                        key={`result-${item.id}`}
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${typeColors[item.type]}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Actions */}
              {quickActions.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Quick Actions
                  </div>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    const isSelected = results.length + index === selectedIndex;
                    
                    return (
                      <button
                        key={`action-${index}`}
                        onClick={() => handleItemClick(action)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {action.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {action.subtitle}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* No Results */}
              {results.length === 0 && (
                <div className="p-8 text-center">
                  <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No results found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Try searching for products, orders, or customers
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Default Quick Actions */}
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Quick Actions
                </div>
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleItemClick(action)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {action.subtitle}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdvancedSearch;
