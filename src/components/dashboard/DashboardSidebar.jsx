import { ShoppingBag, Download, Key, Settings, LifeBuoy, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import Modal from '../ui/Modal';

export default function DashboardSidebar({
  darkMode,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUIStore((state) => state.showToast);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const navItems = [
    { id: 'purchases', label: 'My Purchases', icon: ShoppingBag },
    { id: 'licenses', label: 'License Keys', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        onClick={() => {
          setActiveTab(item.id);
          setSidebarOpen(false);
        }}
        className={`w-full h-12 rounded-xl px-4 flex items-center gap-3 transition-all duration-300 group ${
          isActive
            ? darkMode
              ? 'bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 border-l-3 border-[#3B82F6] text-[#60A5FA]'
              : 'bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 border-l-3 border-[#3B82F6] text-[#3B82F6]'
            : darkMode
            ? 'text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white'
            : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
        } ${isActive ? 'font-semibold' : ''} hover:translate-x-1`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-[70px] h-[calc(100vh-70px)] w-[260px] border-r transition-all duration-300 z-40 ${
          darkMode
            ? 'bg-[#1A2C4A] border-white/10'
            : 'bg-white border-[#E2E8F0]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden self-end mb-4 p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </nav>

          <button
            onClick={() => setLogoutModalOpen(true)}
            className={`w-full h-12 rounded-xl px-4 flex items-center gap-3 transition-all duration-300 hover:translate-x-1 ${
              darkMode
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Logout"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Are you sure you want to logout?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                darkMode
                  ? 'border-2 border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
