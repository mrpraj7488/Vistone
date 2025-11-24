import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  Package,
  ShoppingBag,
  Settings,
  Shield,
  FileText,
  Trash2,
  Edit,
  Plus,
  Eye,
  Download,
  Mail,
  Clock,
  Filter,
  Search,
  Calendar,
  MapPin,
  Monitor
} from 'lucide-react';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filters, setFilters] = useState({
    user: 'all',
    action: 'all',
    dateRange: '7days',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  // Sample activity data
  const sampleActivities = [
    {
      id: 1,
      user: { name: 'Admin User', email: 'admin@vistone.com', avatar: null, role: 'Super Admin' },
      action: 'product_created',
      target: 'React Dashboard Pro',
      targetId: 'prod_123',
      description: 'Created new product "React Dashboard Pro"',
      metadata: { price: '$49', category: 'Dashboards' },
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0.0.0',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      severity: 'info'
    },
    {
      id: 2,
      user: { name: 'Support Agent', email: 'support@vistone.com', avatar: null, role: 'Support' },
      action: 'ticket_replied',
      target: 'Ticket #245',
      targetId: 'ticket_245',
      description: 'Replied to support ticket "Cannot download file"',
      metadata: { priority: 'High', customer: 'John Doe' },
      ip: '192.168.1.2',
      userAgent: 'Firefox 121.0.0.0',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      severity: 'info'
    },
    {
      id: 3,
      user: { name: 'Admin User', email: 'admin@vistone.com', avatar: null, role: 'Super Admin' },
      action: 'settings_updated',
      target: 'Payment Settings',
      targetId: 'settings_payment',
      description: 'Updated payment gateway configuration',
      metadata: { gateway: 'Stripe', test_mode: false },
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0.0.0',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      severity: 'warning'
    },
    {
      id: 4,
      user: { name: 'Editor', email: 'editor@vistone.com', avatar: null, role: 'Editor' },
      action: 'blog_published',
      target: 'Getting Started with React Hooks',
      targetId: 'blog_456',
      description: 'Published blog post "Getting Started with React Hooks"',
      metadata: { category: 'Tutorials', tags: ['React', 'Hooks'] },
      ip: '192.168.1.3',
      userAgent: 'Safari 17.2.0',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      severity: 'info'
    },
    {
      id: 5,
      user: { name: 'Admin User', email: 'admin@vistone.com', avatar: null, role: 'Super Admin' },
      action: 'user_deleted',
      target: 'User #456',
      targetId: 'user_456',
      description: 'Deleted user account for suspicious activity',
      metadata: { reason: 'Spam account', email: 'spam@example.com' },
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0.0.0',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      severity: 'error'
    },
    {
      id: 6,
      user: { name: 'System', email: 'system@vistone.com', avatar: null, role: 'System' },
      action: 'backup_completed',
      target: 'Database Backup',
      targetId: 'backup_789',
      description: 'Automated database backup completed successfully',
      metadata: { size: '245 MB', duration: '2m 34s' },
      ip: 'localhost',
      userAgent: 'System Process',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      severity: 'success'
    },
    {
      id: 7,
      user: { name: 'Admin User', email: 'admin@vistone.com', avatar: null, role: 'Super Admin' },
      action: 'order_refunded',
      target: 'Order #12340',
      targetId: 'order_12340',
      description: 'Processed refund for order #12340',
      metadata: { amount: '$79.00', reason: 'Customer request' },
      ip: '192.168.1.1',
      userAgent: 'Chrome 120.0.0.0',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      severity: 'warning'
    },
    {
      id: 8,
      user: { name: 'Failed Login', email: 'unknown@hacker.com', avatar: null, role: 'Unknown' },
      action: 'login_failed',
      target: 'Admin Login',
      targetId: 'login_attempt',
      description: 'Failed login attempt with invalid credentials',
      metadata: { attempts: 5, blocked: true },
      ip: '203.0.113.1',
      userAgent: 'Unknown Bot',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      severity: 'error'
    }
  ];

  // Load activities
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActivities(sampleActivities);
      setFilteredActivities(sampleActivities);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter activities
  useEffect(() => {
    let filtered = [...activities];

    // Filter by user
    if (filters.user !== 'all') {
      filtered = filtered.filter(activity => 
        activity.user.role.toLowerCase() === filters.user.toLowerCase()
      );
    }

    // Filter by action
    if (filters.action !== 'all') {
      filtered = filtered.filter(activity => 
        activity.action.includes(filters.action)
      );
    }

    // Filter by date range
    const now = new Date();
    const dateFilters = {
      '1day': 24 * 60 * 60 * 1000,
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '90days': 90 * 24 * 60 * 60 * 1000
    };

    if (filters.dateRange !== 'all' && dateFilters[filters.dateRange]) {
      const cutoff = new Date(now.getTime() - dateFilters[filters.dateRange]);
      filtered = filtered.filter(activity => activity.timestamp >= cutoff);
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm) ||
        activity.user.name.toLowerCase().includes(searchTerm) ||
        activity.target.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filters]);

  // Get action icon
  const getActionIcon = (action) => {
    const iconMap = {
      product_created: Plus,
      product_updated: Edit,
      product_deleted: Trash2,
      order_created: ShoppingBag,
      order_refunded: ShoppingBag,
      user_created: User,
      user_updated: User,
      user_deleted: Trash2,
      blog_published: FileText,
      blog_updated: Edit,
      ticket_replied: Mail,
      settings_updated: Settings,
      login_failed: Shield,
      backup_completed: Download,
      system: Settings
    };

    return iconMap[action] || Activity;
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colorMap = {
      info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      warning: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
      error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    };

    return colorMap[severity] || colorMap.info;
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get user avatar
  const getUserAvatar = (user) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-500'
    ];
    const colorIndex = user.name ? user.name.charCodeAt(0) % colors.length : 0;

    return (
      <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity size={28} />
          Activity Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all administrative actions and system events
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User Filter */}
          <select
            value={filters.user}
            onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="super admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="support">Support</option>
            <option value="system">System</option>
          </select>

          {/* Action Filter */}
          <select
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="login">Login</option>
            <option value="settings">Settings</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="1day">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities ({filteredActivities.length})
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No activities found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const Icon = getActionIcon(activity.action);
              
              return (
                <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {getUserAvatar(activity.user)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Main Description */}
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1.5 rounded-lg ${getSeverityColor(activity.severity)}`}>
                              <Icon size={14} />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {activity.user.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {activity.description}
                            </span>
                          </div>

                          {/* Metadata */}
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Technical Details */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{activity.ip}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Monitor size={12} />
                              <span>{activity.userAgent}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield size={12} />
                              <span>{activity.user.role}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(activity.timestamp)}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <button className="px-6 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
