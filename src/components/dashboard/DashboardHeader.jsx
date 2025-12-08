import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, User, Settings, Download, LifeBuoy, LogOut, Menu } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

export default function DashboardHeader({ darkMode, setDarkMode, user, setSidebarOpen }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUIStore((state) => state.showToast);

  // Fetch real notifications from database
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          setNotifications(data.map(notif => ({
            id: notif.id,
            icon: notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : '🔵',
            title: notif.title,
            time: new Date(notif.created_at).toLocaleString(),
            read: notif.is_read
          })));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] border-b transition-all duration-300 ${darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200 shadow-sm'
        }`}
    >
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              V
            </div>
            <span
              className={`font-bold text-[22px] hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'
                }`}
            >
              Vistone
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-[26px] rounded-full transition-all duration-300 ${darkMode
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#FFA500]'
              }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div
              className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${darkMode ? 'left-[calc(100%-23px)]' : 'left-[3px]'
                }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-[#8B5CF6]" />
              ) : (
                <Sun className="w-3 h-3 text-[#FF6B35]" />
              )}
            </div>
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-110 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border animate-slide-up ${darkMode
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                  }`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Notifications ({unreadCount})
                    </h3>
                  </div>
                  <button
                    className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
                    onClick={() => {
                      setNotifications(notifications.map((n) => ({ ...n, read: true })));
                      showToast('All notifications marked as read', 'success');
                    }}
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b cursor-pointer transition-colors ${darkMode
                            ? 'border-white/10 hover:bg-white/5'
                            : 'border-gray-100 hover:bg-gray-50'
                          } ${!notif.read ? 'bg-cyan-500/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{notif.icon}</span>
                          <div className="flex-1">
                            <p
                              className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                              {notif.title}
                            </p>
                            <p
                              className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No notifications
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                  <button className="w-full text-center text-sm text-cyan-500 hover:text-cyan-600 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-cyan-500 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {userInitials}
            </button>

            {userMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-2xl shadow-2xl border animate-slide-up ${darkMode
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                  }`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                      >
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p
                        className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode
                        ? 'hover:bg-white/5 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode
                        ? 'hover:bg-white/5 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=downloads"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode
                        ? 'hover:bg-white/5 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>Downloads</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=support"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${darkMode
                        ? 'hover:bg-white/5 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <LifeBuoy className="w-5 h-5" />
                    <span>Support</span>
                  </Link>
                </div>

                <div className="p-2 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-500/10 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
