import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  X, 
  CheckCheck, 
  Trash2, 
  Filter,
  ArrowRight,
  Circle
} from 'lucide-react';
import notificationService from '../../services/notificationService';

const NotificationDropdown = ({ isOpen, onClose, buttonRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Priority colors and labels
  const priorityConfig = {
    critical: { color: 'red', label: 'Critical', bg: 'bg-red-100 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
    high: { color: 'orange', label: 'High', bg: 'bg-orange-100 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
    medium: { color: 'blue', label: 'Medium', bg: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
    low: { color: 'gray', label: 'Low', bg: 'bg-gray-100 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800' }
  };

  // Category colors
  const categoryColors = {
    sales: 'text-green-600 dark:text-green-400',
    support: 'text-blue-600 dark:text-blue-400',
    feedback: 'text-yellow-600 dark:text-yellow-400',
    users: 'text-purple-600 dark:text-purple-400',
    inventory: 'text-orange-600 dark:text-orange-400',
    payments: 'text-red-600 dark:text-red-400',
    system: 'text-red-600 dark:text-red-400',
    analytics: 'text-green-600 dark:text-green-400',
    downloads: 'text-blue-600 dark:text-blue-400',
    marketing: 'text-pink-600 dark:text-pink-400',
    content: 'text-indigo-600 dark:text-indigo-400'
  };

  // Load notifications and subscribe to updates
  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(notificationService.getNotifications());
      setStats(notificationService.getStats());
    };

    // Initial load
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe((event, data) => {
      updateNotifications();
    });

    return unsubscribe;
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  // Handle notification click with smart routing
  const handleNotificationClick = (notification) => {
    // Mark as read
    notificationService.markAsRead(notification.id);
    
    // Navigate to the specific route
    if (notification.route) {
      navigate(notification.route);
      onClose();
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  // Handle clear all notifications
  const handleClearAll = () => {
    notificationService.clearAll();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.category === filter;
  });

  // Get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {stats.unread > 0 && (
              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                {stats.unread}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'unread', label: 'Unread', count: stats.unread },
            { key: 'sales', label: 'Sales', count: stats.categories?.sales || 0 },
            { key: 'support', label: 'Support', count: stats.categories?.support || 0 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {stats.total > 0 && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            {stats.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {filter === 'unread' ? 'All caught up!' : 'New notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              const priorityStyle = priorityConfig[notification.priority];
              const categoryColor = categoryColors[notification.category];
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all group ${
                    notification.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon with priority indicator */}
                    <div className="relative">
                      <div className={`p-2 rounded-lg ${priorityStyle.bg} ${priorityStyle.border} border`}>
                        <Icon size={16} className={categoryColor} />
                      </div>
                      {notification.unread && (
                        <Circle size={8} className="absolute -top-1 -right-1 text-blue-500 fill-current" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium text-sm ${
                              notification.unread 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                              priorityStyle.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              priorityStyle.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              priorityStyle.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {priorityStyle.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {getRelativeTime(notification.timestamp)}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">
                              • {notification.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action indicator */}
                        <ArrowRight 
                          size={14} 
                          className="text-gray-400 group-hover:text-blue-500 transition-colors mt-1 flex-shrink-0" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Link
          to="/admin/activity"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          View all activity
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
