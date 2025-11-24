// Permission utility functions for role-based access control
import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabaseAdmin';

class PermissionManager {
  constructor() {
    this.permissions = {};
    this.loaded = false;
  }

  // Load permissions from database
  async loadPermissions() {
    try {
      const { data, error } = await supabaseAdmin
        .from('role_permissions')
        .select('*');

      if (error) {
        console.error('Error loading permissions:', error);
        return false;
      }

      // Convert to nested object structure
      this.permissions = {};
      data.forEach(row => {
        if (!this.permissions[row.role]) {
          this.permissions[row.role] = {};
        }
        this.permissions[row.role][row.permission] = row.granted;
      });

      this.loaded = true;
      return true;
    } catch (error) {
      console.error('Error loading permissions:', error);
      return false;
    }
  }

  // Check if a role has a specific permission
  hasPermission(role, permission) {
    if (!this.loaded) {
      console.warn('Permissions not loaded yet');
      return false;
    }

    return this.permissions[role]?.[permission] || false;
  }

  // Check multiple permissions for a role
  hasPermissions(role, permissions) {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  // Check if role has any of the specified permissions
  hasAnyPermission(role, permissions) {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  // Get all permissions for a role
  getRolePermissions(role) {
    if (!this.loaded) {
      console.warn('Permissions not loaded yet');
      return {};
    }

    return this.permissions[role] || {};
  }

  // Get all granted permissions for a role
  getGrantedPermissions(role) {
    const rolePermissions = this.getRolePermissions(role);
    return Object.keys(rolePermissions).filter(permission => rolePermissions[permission]);
  }

  // Permission categories for UI organization
  getPermissionCategories() {
    return {
      'Dashboard & Analytics': [
        'view_dashboard',
        'view_analytics', 
        'export_reports'
      ],
      'User Management': [
        'view_users',
        'create_users',
        'edit_users',
        'delete_users',
        'manage_user_roles'
      ],
      'Product Management': [
        'view_products',
        'create_products',
        'edit_products',
        'delete_products',
        'manage_categories',
        'manage_inventory'
      ],
      'Order Management': [
        'view_orders',
        'edit_orders',
        'process_orders',
        'cancel_orders',
        'process_refunds'
      ],
      'Content Management': [
        'view_content',
        'create_content',
        'edit_content',
        'delete_content',
        'manage_media'
      ],
      'System Settings': [
        'view_settings',
        'edit_settings',
        'manage_integrations',
        'view_logs',
        'system_maintenance'
      ]
    };
  }
}

// Create singleton instance
const permissionManager = new PermissionManager();

// Helper functions for common permission checks
export const canViewDashboard = (role) => permissionManager.hasPermission(role, 'view_dashboard');
export const canManageUsers = (role) => permissionManager.hasPermission(role, 'manage_user_roles');
export const canManageProducts = (role) => permissionManager.hasAnyPermission(role, ['create_products', 'edit_products', 'delete_products']);
export const canManageOrders = (role) => permissionManager.hasAnyPermission(role, ['edit_orders', 'process_orders']);
export const canManageContent = (role) => permissionManager.hasAnyPermission(role, ['create_content', 'edit_content', 'delete_content']);
export const canManageSettings = (role) => permissionManager.hasPermission(role, 'edit_settings');

// React hook for permission checking
export const usePermissions = (role) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!permissionManager.loaded) {
      permissionManager.loadPermissions().then(() => {
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, []);

  return {
    loaded,
    hasPermission: (permission) => permissionManager.hasPermission(role, permission),
    hasPermissions: (permissions) => permissionManager.hasPermissions(role, permissions),
    hasAnyPermission: (permissions) => permissionManager.hasAnyPermission(role, permissions),
    getRolePermissions: () => permissionManager.getRolePermissions(role),
    getGrantedPermissions: () => permissionManager.getGrantedPermissions(role)
  };
};

// Permission-based component wrapper
export const PermissionGate = ({ role, permission, permissions, requireAll = true, children, fallback = null }) => {
  const { loaded, hasPermission, hasPermissions, hasAnyPermission } = usePermissions(role);

  if (!loaded) {
    return <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll ? hasPermissions(permissions) : hasAnyPermission(permissions);
  }

  return hasAccess ? children : fallback;
};

export default permissionManager;
