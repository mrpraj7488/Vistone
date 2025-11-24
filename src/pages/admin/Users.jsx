import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Lock,
  ChevronDown,
  User,
  Plus
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { ErrorHandler, showSuccess } from '../../utils/errorHandler';
import { getRoleDisplayName, getRoleColors, ROLES } from '../../utils/roleUtils';
import UserDetailsPanel from '../../components/admin/UserDetailsPanel';
import UserFormModal from '../../components/admin/UserFormModal';

// Fallback to regular supabase if admin client is not available
const dbClient = supabaseAdmin || supabase;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch orders separately for better performance
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, created_at');

      if (ordersError) console.warn('Orders fetch error:', ordersError);

      // Transform the data to match the component's expected format
      const transformedUsers = profiles.map((profile) => {
        // Calculate user orders and spending
        const userOrders = orders?.filter(order => order.user_id === profile.id) || [];
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const lastPurchase = userOrders.length > 0 
          ? userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
          : null;

        return {
          id: profile.id,
          name: profile.full_name || profile.email?.split('@')[0] || 'Unknown',
          email: profile.email || '',
          role: profile.role || 'user',
          status: profile.status || 'active',
          joinedDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '',
          lastLogin: profile.updated_at || profile.created_at,
          lastPurchase,
          totalSpent,
          totalOrders: userOrders.length,
          emailVerified: true, // Assume verified for now
          twoFactorEnabled: false,
          phone: profile.phone || '',
          country: profile.country || '',
          recentOrders: userOrders.slice(0, 3).map(order => ({
            id: order.id,
            product: 'Order Items',
            price: order.total_amount || 0
          }))
        };
      });

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetailsPanel(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error } = await dbClient
          .from('user_profiles')
          .delete()
          .eq('id', userId);

        if (error) {
          ErrorHandler.handleSupabaseError(error, 'Failed to delete user');
          return;
        }

        setUsers(prev => prev.filter(u => u.id !== userId));
        showSuccess('User deleted successfully');
      } catch (error) {
        ErrorHandler.handleError(error, 'Failed to delete user');
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        ErrorHandler.handleError(new Error('User not found'), 'Cannot update user status');
        return;
      }

      const newStatus = user.status === 'active' ? 'suspended' : 'active';

      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) {
        ErrorHandler.handleSupabaseError(error, 'Failed to update user status');
        return;
      }

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      showSuccess(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      ErrorHandler.handleError(error, 'Failed to update user status');
    }
  };

  const handleSendEmail = (user) => {
    toast.success(`Email sent to ${user.email}`);
  };

  const handleViewOrders = (user) => {
    toast.success(`Viewing orders for ${user.name}`);
  };

  const handleCreateUser = async (userData) => {
    console.log('=== CREATING USER ===');
    console.log('Form data received:', userData);
    
    // Basic validation
    if (!userData.name?.trim()) {
      console.log('Validation failed: Name is required');
      toast.error('Name is required');
      throw new Error('Validation failed');
    }

    if (!userData.email?.trim()) {
      console.log('Validation failed: Email is required');
      toast.error('Email is required');
      throw new Error('Validation failed');
    }

    if (!userData.email.includes('@')) {
      console.log('Validation failed: Invalid email format');
      toast.error('Please enter a valid email address');
      throw new Error('Invalid email');
    }

    console.log('Validation passed, attempting database insert...');

    try {
      // First, let's check if we can read from the table
      console.log('Testing table access...');
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      console.log('Table access test:', { testData, testError });
      
      if (testError && testError.code === '42P01') {
        console.error('Table does not exist!');
        toast.error('Database table "user_profiles" does not exist. Please set up your database first.');
        throw new Error('Table not found');
      }

      // Prepare the insert data
      const insertData = {
        full_name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone?.trim() || null,
        role: userData.role || 'user',
        status: userData.status || 'active',
        country: userData.country?.trim() || null
      };
      
      console.log('Inserting data:', insertData);
      
      // Try to create user profile in Supabase using admin client
      const { data, error } = await dbClient
        .from('user_profiles')
        .insert([insertData])
        .select()
        .single();

      console.log('=== SUPABASE RESPONSE ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Supabase insert error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Handle specific error cases with user-friendly messages
        if (error.code === '42P01') {
          toast.error('Database table not found. Please contact support.');
        } else if (error.code === '23505') {
          toast.error('A user with this email already exists. Please use a different email.');
        } else if (error.code === '42501') {
          toast.error('Permission denied. Please contact support.');
        } else if (error.code === '23502' || (error.message && error.message.includes('null value in column "id"'))) {
          toast.error('Database table structure issue. Please run the table setup script or contact support.');
        } else if (error.code === '23514' || error.message?.includes('check constraint')) {
          toast.error('Invalid data format. Please check the role and status values.');
        } else if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
          toast.error('Database relationship error. Please run the constraint fix script or contact support.');
        } else if (error.message?.includes('row-level security policy')) {
          toast.error('Database permission error. Please check Row Level Security policies in Supabase.');
        } else {
          toast.error(`Database error: ${error.message || 'Unknown error occurred'}`);
        }
        throw error;
      }

      if (!data) {
        console.error('No data returned from insert');
        toast.error('User creation failed: No data returned from database');
        throw new Error('No data returned');
      }

      console.log('✅ User created successfully in database:', data);

      // Transform the created user to match UI format
      const newUser = {
        id: data.id,
        name: data.full_name || data.email?.split('@')[0] || 'Unknown',
        email: data.email || '',
        role: data.role || 'user',
        status: data.status || 'active',
        joinedDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        lastLogin: data.updated_at || data.created_at || new Date().toISOString(),
        lastPurchase: null,
        totalSpent: 0,
        totalOrders: 0,
        emailVerified: false,
        twoFactorEnabled: false,
        phone: data.phone || '',
        country: data.country || '',
        recentOrders: []
      };

      console.log('Adding user to local state:', newUser);
      setUsers(prev => {
        console.log('Previous users count:', prev.length);
        const updated = [newUser, ...prev];
        console.log('Updated users count:', updated.length);
        return updated;
      });
      
      console.log('✅ User creation completed successfully');
      toast.success('User created successfully! They can now access the system.');
      
    } catch (error) {
      console.error('=== ERROR IN handleCreateUser ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', error);
      
      // Only show additional error message if we haven't already shown one
      if (!(error.message && error.message.includes('Validation failed')) && 
          !(error.message && error.message.includes('Invalid email')) && 
          !(error.message && error.message.includes('Table not found'))) {
        toast.error(`Failed to create user: ${error.message || 'Unknown error'}`);
      }
      
      throw error; // Re-throw so the modal can handle loading state
    }
  };

  const handleUpdateUser = async (userData) => {
    // Validate required fields
    const validation = ErrorHandler.validateRequired(userData, ['name', 'email', 'role']);
    if (!validation.isValid) {
      ErrorHandler.handleValidationError(validation.errors, 'User update failed');
      throw new Error('Validation failed');
    }

    // Validate email format
    if (!ErrorHandler.validateEmail(userData.email)) {
      ErrorHandler.handleValidationError('Please enter a valid email address');
      throw new Error('Invalid email');
    }

    // Update user profile in Supabase
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        full_name: userData.name,
        email: userData.email,
        phone: userData.phone || null,
        role: userData.role,
        status: userData.status,
        country: userData.country || null
      })
      .eq('id', editingUser.id);

    if (error) {
      ErrorHandler.handleSupabaseError(error, 'Failed to update user');
      throw error;
    }

    // Update local state
    setUsers(prev => prev.map(u => 
      u.id === editingUser.id ? { ...u, ...userData } : u
    ));
    showSuccess('User updated successfully!');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const joinDate = new Date(user.joinedDate);
      const now = new Date();
      const daysDiff = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
      
      if (filterDate === 'week') matchesDate = daysDiff <= 7;
      else if (filterDate === 'month') matchesDate = daysDiff <= 30;
      else if (filterDate === 'year') matchesDate = daysDiff <= 365;
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const totalUsers = users.length;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users ({totalUsers})
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowUserModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="co-admin">Co-Admin</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          {/* Date Filter */}
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {(user.name || 'U').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || 'Unknown User'}
                        </p>
                        {user.role === 'user' ? (
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Package size={12} />
                              {user.totalOrders} purchases
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={12} />
                              ${user.totalSpent.toLocaleString()} spent
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Staff member
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                      {user.emailVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColors(user.role).bg} ${getRoleColors(user.role).text} ${getRoleColors(user.role).border} border`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(user.joinedDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Eye size={14} />
                          👁️ View Profile
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Edit size={14} />
                          ✏️ Edit User
                        </button>
                        <button
                          onClick={() => handleSendEmail(user)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Mail size={14} />
                          📧 Send Email
                        </button>
                        <button
                          onClick={() => handleViewOrders(user)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Package size={14} />
                          📦 View Orders
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Ban size={14} />
                          🔒 {user.status === 'active' ? 'Suspend' : 'Activate'} Account
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          🗑️ Delete User
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Panel */}
      <UserDetailsPanel
        user={selectedUser}
        isOpen={showDetailsPanel}
        onClose={() => {
          setShowDetailsPanel(false);
          setSelectedUser(null);
        }}
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default Users;
