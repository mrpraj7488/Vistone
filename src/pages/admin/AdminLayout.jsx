import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  BarChart3,
  Ticket,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ChevronsLeft,
  ShoppingBag,
  Download,
  Key,
  Gift,
  Star,
  FileEdit,
  Shield,
  Activity,
  DollarSign,
  AlertCircle,
  Palette,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { toast } from '../../utils/notifications';
import AdvancedSearch from '../../components/admin/AdvancedSearch';
import ExportImport from '../../components/admin/ExportImport';
import PWAInstallPrompt from '../../components/admin/PWAInstallPrompt';
import NotificationSettings from '../../components/admin/NotificationSettings';
import RolePermissions from '../../components/admin/RolePermissions';
import NotificationDropdown from '../../components/admin/NotificationDropdown';
import websocketService from '../../services/websocket';
import notificationService from '../../services/notificationService';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    // Default to light mode if no preference is saved
    return savedTheme === 'dark';
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // removed unused searchResults state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(true);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showRolePermissions, setShowRolePermissions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs for click outside handling
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user = {}, logout } = useAuthStore();

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Optimized notification handlers using professional notification service
  const handleNotification = useCallback((notification) => {
    // Determine notification type based on data
    let notificationType = 'SYSTEM_ALERT';
    if (notification.type === 'order') notificationType = 'ORDER';
    else if (notification.type === 'support') notificationType = 'SUPPORT_TICKET';
    else if (notification.type === 'review') notificationType = 'REVIEW';
    else if (notification.type === 'user') notificationType = 'USER_REGISTRATION';

    notificationService.addNotification(notificationType, notification);
  }, []);

  const handleOrderUpdate = useCallback((order) => {
    notificationService.addNotification('ORDER', {
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      customerName: order.customer || order.customerName,
      amount: order.amount || order.total
    });
  }, []);

  // WebSocket and Sound Notifications Integration
  useEffect(() => {
    // Connect to WebSocket for real-time updates (gracefully handles server absence)
    websocketService.connect();

    // Sound notification service will be initialized on first user interaction
    // No need to preload here to avoid AudioContext warnings

    const handleStatsUpdate = (stats) => {
      // Update dashboard stats in real-time
      console.log('Stats updated:', stats);
    };

    const handleReconnectFailed = () => {
      console.log('WebSocket service disabled - notifications will work in offline mode');
      // Don't show toast in production since WebSocket is intentionally disabled
      if (window.location.hostname === 'localhost') {
        toast.info('Real-time notifications disabled - using offline mode', {
          duration: 3000,
          position: 'bottom-right'
        });
      }
    };

    websocketService.on('notification', handleNotification);
    websocketService.on('orderUpdate', handleOrderUpdate);
    websocketService.on('statsUpdate', handleStatsUpdate);
    websocketService.on('reconnect_failed', handleReconnectFailed);

    return () => {
      websocketService.off('notification', handleNotification);
      websocketService.off('orderUpdate', handleOrderUpdate);
      websocketService.off('statsUpdate', handleStatsUpdate);
      websocketService.off('reconnect_failed', handleReconnectFailed);
      websocketService.disconnect();
    };
  }, [handleNotification, handleOrderUpdate]);

  // Session Expiry Monitoring - Check every minute and on user activity
  useEffect(() => {
    const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    const checkSessionExpiry = () => {
      const sessionExpiry = localStorage.getItem('adminSessionExpiry');
      const lastActivity = localStorage.getItem('adminLastActivity');
      const now = Date.now();

      // Check if session has expired based on stored expiry time
      if (sessionExpiry && now > parseInt(sessionExpiry)) {
        console.log('⏰ Session expired (exceeded 2 hours)');
        toast.warning('Session expired. Please login again.');
        handleLogout();
        return;
      }

      // Check if inactive for more than 2 hours
      if (lastActivity && (now - parseInt(lastActivity)) > SESSION_TIMEOUT) {
        console.log('⏰ Session expired (inactive for 2 hours)');
        toast.warning('Session expired due to inactivity. Please login again.');
        handleLogout();
        return;
      }
    };

    // Update last activity on user actions
    const updateActivity = () => {
      const now = Date.now();
      localStorage.setItem('adminLastActivity', now.toString());

      // Also extend expiry if user is active (sliding expiration)
      const newExpiry = now + SESSION_TIMEOUT;
      localStorage.setItem('adminSessionExpiry', newExpiry.toString());
    };

    // Check session every minute
    const intervalId = setInterval(checkSessionExpiry, 60000);

    // Check immediately on mount
    checkSessionExpiry();

    // Update activity on user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      clearInterval(intervalId);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);


  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const handleLogout = async () => {
    try {
      // Clear all admin authentication data
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminSessionExpiry');
      localStorage.removeItem('adminLastActivity');

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      if (logout) {
        logout();
      }

      // Redirect to admin login page
      navigate('/admin-1253223');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const navigationItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/admin/products', icon: Package, label: 'Products', badge: '24' },
    { path: '/admin/categories', icon: Tags, label: 'Categories', badge: '12' },
    { path: '/admin/users', icon: Users, label: 'Users', badge: '456' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { path: '/admin/support', icon: Ticket, label: 'Support', badge: '8' },
    { path: '/admin/blogs', icon: FileText, label: 'Blogs', badge: '34' },
    { path: '/admin/theme', icon: Palette, label: 'Theme', badge: null },
  ];

  const otherMenuItems = [
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/downloads', icon: Download, label: 'Downloads' },
    { path: '/admin/licenses', icon: Key, label: 'Licenses' },
    { path: '/admin/coupons', icon: Gift, label: 'Coupons' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/pages', icon: FileEdit, label: 'Pages' },
  ];

  // Initialize professional notification system
  useEffect(() => {
    // Subscribe to notification service updates
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Set initial unread count
    setUnreadCount(notificationService.getUnreadCount());

    return unsubscribe;
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🎯</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block font-['Poppins']">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-4" ref={searchRef}>
            <div className="relative flex-1 max-w-md">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-left"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <span>Search products, orders, customers...</span>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Search size={20} />
            </button>

            {/* Enhanced Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className={`relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${notificationDropdownOpen ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } ${unreadCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Bell size={20} className={unreadCount > 0 ? 'animate-pulse' : ''} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-white dark:border-gray-800">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
                buttonRef={notificationRef}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-semibold">
                          {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin Name'}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                            <Shield size={12} className="mr-1" />
                            Super Admin
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Users size={16} /> My Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <Link
                      to="/admin/activity"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Activity size={18} />
                      Activity Log
                    </Link>
                    <button
                      onClick={() => setShowNotificationSettings(true)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                    >
                      <Bell size={18} />
                      Notification Settings
                    </button>
                    <button
                      onClick={() => setShowRolePermissions(true)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                    >
                      <Shield size={18} />
                      Roles & Permissions
                    </button>
                    <button
                      onClick={() => setShowExportImport(true)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                    >
                      <Download size={18} />
                      Export/Import
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - 260px width, collapsible to 80px */}
      <aside className={`fixed left-0 top-[70px] bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${sidebarCollapsed ? 'w-20' : 'w-[260px]'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg transition-colors ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 border-l-3 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Other Menu */}
            <div className="mt-2">
              <button
                onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} />
                  {!sidebarCollapsed && <span>Other</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown size={16} className={`transition-transform ${otherMenuOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {otherMenuOpen && !sidebarCollapsed && (
                <div className="ml-4 mt-1">
                  {otherMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                          ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg transition-colors ${location.pathname === '/admin/settings'
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Settings size={20} />
              {!sidebarCollapsed && <span>Settings</span>}
            </Link>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>

            {/* Collapse Button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 mt-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronsLeft size={20} className="rotate-180" /> : <ChevronsLeft size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-[70px] ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[260px]'
        }`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Export/Import Modal */}
      <ExportImport
        isOpen={showExportImport}
        onClose={() => setShowExportImport(false)}
      />

      {/* Notification Settings Modal */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      {/* Role & Permissions Modal */}
      <RolePermissions
        isOpen={showRolePermissions}
        onClose={() => setShowRolePermissions(false)}
      />


      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default AdminLayout;
