import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Shield, MapPin } from 'lucide-react';
import CountrySelect from '../common/CountrySelect';

const UserFormModal = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    country: '',
    password: '',
    confirmPassword: '',
    emailVerified: false,
    twoFactorEnabled: false,
    permissions: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        phone: editingUser.phone || '',
        role: editingUser.role || 'user',
        status: editingUser.status || 'active',
        country: editingUser.country || '',
        password: '',
        confirmPassword: '',
        emailVerified: editingUser.emailVerified || false,
        twoFactorEnabled: editingUser.twoFactorEnabled || false,
        permissions: editingUser.permissions || []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        country: '',
        password: '',
        confirmPassword: '',
        emailVerified: false,
        twoFactorEnabled: false,
        permissions: []
      });
    }
  }, [editingUser]);

  const permissions = [
    { key: 'view_products', label: 'View Products' },
    { key: 'edit_products', label: 'Edit Products' },
    { key: 'delete_products', label: 'Delete Products' },
    { key: 'view_orders', label: 'View Orders' },
    { key: 'manage_orders', label: 'Manage Orders' },
    { key: 'view_users', label: 'View Users' },
    { key: 'manage_users', label: 'Manage Users' },
    { key: 'view_analytics', label: 'View Analytics' },
    { key: 'manage_settings', label: 'Manage Settings' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: (prev.permissions || []).includes(permission)
        ? (prev.permissions || []).filter(p => p !== permission)
        : [...(prev.permissions || []), permission]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!editingUser && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        // Error is already handled in the parent component
        console.error('Form submission error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Contact Details Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contact Details
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <CountrySelect
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                error={errors.country}
                placeholder="Select your country"
                className="w-full"
              />
            </div>

            {/* Role & Permissions Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} />
                Role & Permissions
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="user">User (Regular User)</option>
                <option value="co-admin">Co-Admin (Limited Access)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                • Admin: Full website access and permissions<br/>
                • Co-Admin: Limited admin panel access<br/>
                • User: Regular website user
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Permissions Grid */}
            {formData.role !== 'user' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {permissions.map((permission) => (
                    <label key={permission.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(formData.permissions || []).includes(permission.key)}
                        onChange={() => handlePermissionToggle(permission.key)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {permission.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Password Management Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock size={20} />
                Password Management
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Account Settings */}
            <div className="md:col-span-2 mt-4 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.emailVerified}
                  onChange={(e) => handleInputChange('emailVerified', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Email Verified
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Two-Factor Authentication Enabled
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? 'Processing...' : (editingUser ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
