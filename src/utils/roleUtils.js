// Role utility functions for the 3-role system
// Admin, Co-Admin, User

export const ROLES = {
  ADMIN: 'admin',
  CO_ADMIN: 'co-admin', 
  USER: 'user'
};

export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.CO_ADMIN]: 'Co-Admin',
  [ROLES.USER]: 'User'
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full website access and all permissions',
  [ROLES.CO_ADMIN]: 'Limited admin panel access set by Admin',
  [ROLES.USER]: 'Regular website user purchasing products and services'
};

export const ROLE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700'
  },
  [ROLES.CO_ADMIN]: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-700'
  },
  [ROLES.USER]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700'
  }
};

export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || 'Unknown';
};

export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || 'No description available';
};

export const getRoleColors = (role) => {
  return ROLE_COLORS[role] || ROLE_COLORS[ROLES.USER];
};

export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

export const getAllRoles = () => {
  return Object.values(ROLES);
};

export const getRoleOptions = () => {
  return [
    { value: ROLES.USER, label: 'User (Regular User)', description: ROLE_DESCRIPTIONS[ROLES.USER] },
    { value: ROLES.CO_ADMIN, label: 'Co-Admin (Limited Access)', description: ROLE_DESCRIPTIONS[ROLES.CO_ADMIN] },
    { value: ROLES.ADMIN, label: 'Admin (Full Access)', description: ROLE_DESCRIPTIONS[ROLES.ADMIN] }
  ];
};

// Permission checking functions
export const hasAdminAccess = (userRole) => {
  return userRole === ROLES.ADMIN;
};

export const hasCoAdminAccess = (userRole) => {
  return userRole === ROLES.ADMIN || userRole === ROLES.CO_ADMIN;
};

export const canManageUsers = (userRole) => {
  return userRole === ROLES.ADMIN; // Only admin can manage users
};

export const canManageProducts = (userRole) => {
  return userRole === ROLES.ADMIN || userRole === ROLES.CO_ADMIN;
};

export const canViewAnalytics = (userRole) => {
  return userRole === ROLES.ADMIN || userRole === ROLES.CO_ADMIN;
};
