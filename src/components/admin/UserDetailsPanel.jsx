import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
  DollarSign,
  ShoppingCart,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Eye
} from 'lucide-react';

const UserDetailsPanel = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Profile */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Customer since: {formatDate(user.joinedDate)}
            </p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Statistics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              📊 Statistics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.totalOrders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${user.totalSpent?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Order:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${user.totalOrders ? (user.totalSpent / user.totalOrders).toFixed(2) : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Purchase:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.lastPurchase ? formatDate(user.lastPurchase) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {user.recentOrders && user.recentOrders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                📦 Recent Orders
              </h4>
              <div className="space-y-2">
                {user.recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">#{order.id}</span>
                    <span className="mx-2">-</span>
                    <span className="text-gray-900 dark:text-white">{order.product}</span>
                    <span className="text-gray-600 dark:text-gray-400"> (${order.price})</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                View All Orders
              </button>
            </div>
          )}

          {/* Account Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              📋 Account Details
            </h4>
            <div className="space-y-2">
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{user.phone}</span>
                </div>
              )}
              {user.country && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Country:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{user.country}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(user.joinedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Login:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🔐 Account Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {user.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {user.status === 'active' ? 'Active' : 'Suspended'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {user.emailVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">2FA:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.twoFactorEnabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {user.twoFactorEnabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {user.twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <Edit size={16} />
              Edit User
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Eye size={16} />
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
