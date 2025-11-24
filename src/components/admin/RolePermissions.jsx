import React, { useState, useEffect } from 'react';
import { Shield, Users, UserCheck, Save, RotateCcw, Check, X } from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { ROLES, getRoleDisplayName, getRoleDescription, getRoleColors } from '../../utils/roleUtils';
import { toast } from '../../utils/notifications';

// Professional Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  };
  
  const thumbSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex items-center ${sizeClasses[size]} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
        ${checked 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          ${thumbSizes[size]} bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out flex items-center justify-center
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
        `}
      >
        {checked ? (
          <Check size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} className="text-blue-600" />
        ) : (
          <X size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} className="text-gray-400" />
        )}
      </span>
    </button>
  );
};

const RolePermissionsOptimized = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [permissions, setPermissions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Production-ready permission categories aligned with your SaaS platform
  const permissionCategories = {
    'Dashboard & Analytics': {
      'view_dashboard': 'View Dashboard',
      'view_analytics': 'View Analytics & Reports',
      'export_reports': 'Export Reports'
    },
    'User Management': {
      'view_users': 'View Users',
      'create_users': 'Create Users',
      'edit_users': 'Edit Users',
      'delete_users': 'Delete Users',
      'manage_user_roles': 'Manage User Roles'
    },
    'Product Management': {
      'view_products': 'View Products',
      'create_products': 'Create Products',
      'edit_products': 'Edit Products',
      'delete_products': 'Delete Products',
      'manage_categories': 'Manage Categories',
      'manage_inventory': 'Manage Inventory'
    },
    'Order Management': {
      'view_orders': 'View Orders',
      'edit_orders': 'Edit Orders',
      'process_orders': 'Process Orders',
      'cancel_orders': 'Cancel Orders',
      'process_refunds': 'Process Refunds'
    },
    'Content Management': {
      'view_content': 'View Content',
      'create_content': 'Create Content',
      'edit_content': 'Edit Content',
      'delete_content': 'Delete Content',
      'manage_media': 'Manage Media Files'
    },
    'System Settings': {
      'view_settings': 'View Settings',
      'edit_settings': 'Edit Settings',
      'manage_integrations': 'Manage Integrations',
      'view_logs': 'View System Logs',
      'system_maintenance': 'System Maintenance'
    }
  };

  // Default permissions for the 3-role system
  const defaultPermissions = {
    [ROLES.ADMIN]: {
      // Admin has full access
      ...Object.keys(permissionCategories).reduce((acc, category) => {
        Object.keys(permissionCategories[category]).forEach(permission => {
          acc[permission] = true;
        });
        return acc;
      }, {})
    },
    [ROLES.CO_ADMIN]: {
      // Co-Admin has limited access
      'view_dashboard': true,
      'view_analytics': true,
      'export_reports': false,
      'view_users': true,
      'create_users': false,
      'edit_users': false,
      'delete_users': false,
      'manage_user_roles': false,
      'view_products': true,
      'create_products': true,
      'edit_products': true,
      'delete_products': false,
      'manage_categories': true,
      'manage_inventory': true,
      'view_orders': true,
      'edit_orders': true,
      'process_orders': true,
      'cancel_orders': false,
      'process_refunds': false,
      'view_content': true,
      'create_content': true,
      'edit_content': true,
      'delete_content': false,
      'manage_media': true,
      'view_settings': true,
      'edit_settings': false,
      'manage_integrations': false,
      'view_logs': false,
      'system_maintenance': false
    },
    [ROLES.USER]: {
      // Regular users have minimal access
      'view_dashboard': false,
      'view_analytics': false,
      'export_reports': false,
      'view_users': false,
      'create_users': false,
      'edit_users': false,
      'delete_users': false,
      'manage_user_roles': false,
      'view_products': false,
      'create_products': false,
      'edit_products': false,
      'delete_products': false,
      'manage_categories': false,
      'manage_inventory': false,
      'view_orders': false,
      'edit_orders': false,
      'process_orders': false,
      'cancel_orders': false,
      'process_refunds': false,
      'view_content': false,
      'create_content': false,
      'edit_content': false,
      'delete_content': false,
      'manage_media': false,
      'view_settings': false,
      'edit_settings': false,
      'manage_integrations': false,
      'view_logs': false,
      'system_maintenance': false
    }
  };

  // Load permissions from database or localStorage
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      // Try to load from database first
      const { data, error } = await supabaseAdmin
        .from('role_permissions')
        .select('*');

      if (error) {
        console.log('No database permissions found, using defaults');
        setPermissions(defaultPermissions);
      } else if (data && data.length > 0) {
        // Convert database format to component format
        const dbPermissions = {};
        data.forEach(row => {
          if (!dbPermissions[row.role]) {
            dbPermissions[row.role] = {};
          }
          dbPermissions[row.role][row.permission] = row.granted;
        });
        setPermissions(dbPermissions);
      } else {
        setPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions(defaultPermissions);
    }
    setLoading(false);
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permission]: value
      }
    }));
    setHasChanges(true);
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      // Delete existing permissions for all roles
      await supabaseAdmin
        .from('role_permissions')
        .delete()
        .neq('id', 0); // Delete all

      // Insert new permissions
      const permissionRows = [];
      Object.entries(permissions).forEach(([role, rolePermissions]) => {
        Object.entries(rolePermissions).forEach(([permission, granted]) => {
          permissionRows.push({
            role,
            permission,
            granted,
            updated_at: new Date().toISOString()
          });
        });
      });

      const { error } = await supabaseAdmin
        .from('role_permissions')
        .insert(permissionRows);

      if (error) {
        throw error;
      }

      // Also save to localStorage as backup
      localStorage.setItem('role-permissions', JSON.stringify(permissions));
      
      setHasChanges(false);
      toast.success('Permissions saved successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions. Please try again.');
    }
    setSaving(false);
  };

  const resetToDefaults = () => {
    setPermissions(defaultPermissions);
    setHasChanges(true);
    toast.info('Permissions reset to defaults');
  };

  const selectAllInCategory = (category, value) => {
    const categoryPermissions = Object.keys(permissionCategories[category]);
    const updatedPermissions = { ...permissions };
    
    categoryPermissions.forEach(permission => {
      updatedPermissions[selectedRole] = {
        ...updatedPermissions[selectedRole],
        [permission]: value
      };
    });
    
    setPermissions(updatedPermissions);
    setHasChanges(true);
  };

  const getPermissionCount = (role) => {
    if (!permissions[role]) return { granted: 0, total: 0 };
    
    const rolePermissions = permissions[role];
    const granted = Object.values(rolePermissions).filter(Boolean).length;
    const total = Object.keys(rolePermissions).length;
    
    return { granted, total };
  };

  if (!isOpen) return null;

  const currentRolePermissions = permissions[selectedRole] || {};
  const roleColors = getRoleColors(selectedRole);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Shield size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Role & Permissions Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure access control for your team members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Roles Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Roles</h3>
            <div className="space-y-3">
              {Object.values(ROLES).map((role) => {
                const colors = getRoleColors(role);
                const { granted, total } = getPermissionCount(role);
                
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedRole === role
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 ${colors.bg} border ${colors.border} rounded-lg`}>
                        {role === ROLES.ADMIN ? <Shield size={16} className={colors.text} /> :
                         role === ROLES.CO_ADMIN ? <UserCheck size={16} className={colors.text} /> :
                         <Users size={16} className={colors.text} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {getRoleDisplayName(role)}
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {granted}/{total} permissions
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {getRoleDescription(role)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getRoleDisplayName(selectedRole)} Permissions
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Configure what this role can access and modify
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        Object.keys(permissionCategories).forEach(category => {
                          selectAllInCategory(category, true);
                        });
                      }}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Enable All
                    </button>
                    <button
                      onClick={() => {
                        Object.keys(permissionCategories).forEach(category => {
                          selectAllInCategory(category, false);
                        });
                      }}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Disable All
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([category, categoryPermissions]) => {
                    const categoryGranted = Object.keys(categoryPermissions).filter(
                      permission => currentRolePermissions[permission]
                    ).length;
                    const categoryTotal = Object.keys(categoryPermissions).length;
                    
                    return (
                      <div key={category} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                            <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                              {categoryGranted}/{categoryTotal}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => selectAllInCategory(category, true)}
                              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                            >
                              Enable All
                            </button>
                            <button
                              onClick={() => selectAllInCategory(category, false)}
                              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                            >
                              Disable All
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(categoryPermissions).map(([permission, label]) => (
                            <div
                              key={permission}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {label}
                              </span>
                              <ToggleSwitch
                                checked={currentRolePermissions[permission] || false}
                                onChange={(value) => handlePermissionChange(permission, value)}
                                disabled={selectedRole === ROLES.USER && permission.includes('manage')}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={savePermissions}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasChanges && !saving
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsOptimized;
