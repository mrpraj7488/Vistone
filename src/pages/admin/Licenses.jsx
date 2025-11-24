import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Key,
  Shield,
  Globe,
  Calendar,
  User,
  Package,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Filter,
  MoreVertical,
  Settings,
  Activity,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  FileText,
  Zap,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showLicenseDetails, setShowLicenseDetails] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort options
  const productOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'prod-1', label: 'React Dashboard Pro' },
    { value: 'prod-2', label: 'Vue Admin Template' },
    { value: 'prod-3', label: 'Angular Dashboard' },
    { value: 'prod-4', label: 'React Native App' },
    { value: 'prod-5', label: 'WordPress Theme' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'regular', label: 'Regular License' },
    { value: 'extended', label: 'Extended License' },
    { value: 'developer', label: 'Developer License' },
    { value: 'lifetime', label: 'Lifetime License' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'key-asc', label: 'License Key A-Z' },
    { value: 'key-desc', label: 'License Key Z-A' },
    { value: 'product', label: 'Product Name' },
    { value: 'customer', label: 'Customer Name' },
    { value: 'expiry', label: 'Expiry Date' }
  ];

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          products(name, version),
          user_profiles(full_name, email),
          orders(order_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedLicenses = data?.map(license => ({
        id: license.id,
        licenseKey: license.license_key,
        product: {
          id: license.product_id,
          name: license.products?.name || 'Unknown Product',
          version: license.products?.version || '1.0.0'
        },
        customer: {
          id: license.user_id,
          name: license.user_profiles?.full_name || 'Unknown User',
          email: license.user_profiles?.email || 'N/A'
        },
        orderId: license.orders?.order_number || license.order_id,
        status: license.status || 'active',
        type: license.license_type || 'regular',
        domains: license.allowed_domains || [],
        maxDomains: license.max_domains || 1,
        activationCount: license.activation_count || 0,
        activationLimit: license.activation_limit || 1,
        createdAt: license.created_at,
        expiresAt: license.expires_at,
        lastUsed: license.last_used_at,
        ipAddresses: license.ip_addresses || [],
        notes: license.notes || ''
      })) || [];

      setLicenses(transformedLicenses);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      toast.error('Failed to load licenses');
      setLicenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'suspended': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'revoked': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || colors['active'];
  };

  const getStatusIcon = (status) => {
    const icons = {
      'active': CheckCircle,
      'expired': XCircle,
      'suspended': Clock,
      'revoked': AlertTriangle
    };
    return icons[status] || CheckCircle;
  };

  const getTypeColor = (type) => {
    const colors = {
      'regular': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'extended': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'developer': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'lifetime': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    };
    return colors[type] || colors['regular'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort licenses
  const filteredLicenses = licenses
    .filter(license => {
      const matchesSearch = 
        license.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        license.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        license.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        license.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProduct = selectedProduct === 'all' || license.product.id === selectedProduct;
      const matchesStatus = selectedStatus === 'all' || license.status === selectedStatus;
      const matchesType = selectedType === 'all' || license.type === selectedType;
      
      return matchesSearch && matchesProduct && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'key-asc':
          return a.licenseKey.localeCompare(b.licenseKey);
        case 'key-desc':
          return b.licenseKey.localeCompare(a.licenseKey);
        case 'product':
          return a.product.name.localeCompare(b.product.name);
        case 'customer':
          return a.customer.name.localeCompare(b.customer.name);
        case 'expiry':
          if (!a.expiresAt && !b.expiresAt) return 0;
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLicenses = filteredLicenses.slice(startIndex, startIndex + itemsPerPage);

  // License actions
  const handleSelectLicense = (licenseId) => {
    setSelectedLicenses(prev => {
      const newSelected = prev.includes(licenseId)
        ? prev.filter(id => id !== licenseId)
        : [...prev, licenseId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedLicenses.length === paginatedLicenses.length) {
      setSelectedLicenses([]);
      setShowBulkActions(false);
    } else {
      const allIds = paginatedLicenses.map(l => l.id);
      setSelectedLicenses(allIds);
      setShowBulkActions(true);
    }
  };

  const handleCopyLicenseKey = (licenseKey) => {
    navigator.clipboard.writeText(licenseKey);
    toast.success('License key copied to clipboard!');
  };

  const handleActivateLicense = (licenseId) => {
    setLicenses(prev => prev.map(license => 
      license.id === licenseId 
        ? { ...license, status: 'active' }
        : license
    ));
    toast.success('License activated successfully!');
  };

  const handleSuspendLicense = (licenseId) => {
    setLicenses(prev => prev.map(license => 
      license.id === licenseId 
        ? { ...license, status: 'suspended' }
        : license
    ));
    toast.success('License suspended successfully!');
  };

  const handleRevokeLicense = (licenseId) => {
    if (window.confirm('Are you sure you want to revoke this license? This action cannot be undone.')) {
      setLicenses(prev => prev.map(license => 
        license.id === licenseId 
          ? { ...license, status: 'revoked' }
          : license
      ));
      toast.success('License revoked successfully!');
    }
  };

  const generateNewLicense = () => {
    const newKey = `NEW-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const newLicense = {
      id: Date.now(),
      licenseKey: newKey,
      product: {
        id: 'prod-1',
        name: 'New Product',
        version: '1.0.0'
      },
      customer: {
        id: 'user-new',
        name: 'New Customer',
        email: 'new@example.com'
      },
      orderId: `ORD-${Date.now()}`,
      status: 'active',
      type: 'regular',
      domains: [],
      maxDomains: 1,
      activationCount: 0,
      activationLimit: 1,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      lastUsed: null,
      ipAddresses: [],
      notes: 'Manually generated license'
    };

    setLicenses(prev => [newLicense, ...prev]);
    toast.success('New license generated successfully!');
    setShowGenerator(false);
  };

  // License Action Menu Component
  const LicenseActionMenu = ({ license }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 py-2">
              <button
                onClick={() => {
                  setShowLicenseDetails(license);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-full text-left"
              >
                <Eye size={14} className="text-blue-600 dark:text-blue-400" />
                View Details
              </button>
              
              <button
                onClick={() => {
                  handleCopyLicenseKey(license.licenseKey);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 transition-colors w-full text-left"
              >
                <Copy size={14} className="text-green-600 dark:text-green-400" />
                Copy License Key
              </button>

              {license.status === 'suspended' && (
                <button
                  onClick={() => {
                    handleActivateLicense(license.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors w-full text-left"
                >
                  <Unlock size={14} className="text-emerald-600 dark:text-emerald-400" />
                  Activate License
                </button>
              )}

              {license.status === 'active' && (
                <button
                  onClick={() => {
                    handleSuspendLicense(license.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors w-full text-left"
                >
                  <Lock size={14} className="text-yellow-600 dark:text-yellow-400" />
                  Suspend License
                </button>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              <button
                onClick={() => {
                  handleRevokeLicense(license.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors w-full text-left"
              >
                <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                Revoke License
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key size={28} className="text-blue-600 dark:text-blue-400" />
            License Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product licenses, activations, and customer access
          </p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Generate License
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Licenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{licenses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Key size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Licenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {licenses.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Expired Licenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {licenses.filter(l => l.status === 'expired').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <XCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Activations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {licenses.reduce((sum, l) => sum + l.activationCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Zap size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search licenses, products, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {productOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              {selectedLicenses.length} license(s) selected
            </span>
            <button
              onClick={() => {
                selectedLicenses.forEach(id => handleActivateLicense(id));
                setSelectedLicenses([]);
                setShowBulkActions(false);
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Activate Selected
            </button>
            <button
              onClick={() => {
                selectedLicenses.forEach(id => handleSuspendLicense(id));
                setSelectedLicenses([]);
                setShowBulkActions(false);
              }}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Suspend Selected
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Revoke ${selectedLicenses.length} selected licenses?`)) {
                  selectedLicenses.forEach(id => handleRevokeLicense(id));
                  setSelectedLicenses([]);
                  setShowBulkActions(false);
                }
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Revoke Selected
            </button>
          </div>
        )}

        {/* License Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedLicenses.length === paginatedLicenses.length && paginatedLicenses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">License Key</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Activations</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Expires</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLicenses.map((license) => {
                const StatusIcon = getStatusIcon(license.status);
                return (
                  <tr key={license.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.includes(license.id)}
                        onChange={() => handleSelectLicense(license.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {license.licenseKey}
                        </code>
                        <button
                          onClick={() => handleCopyLicenseKey(license.licenseKey)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Copy license key"
                        >
                          <Copy size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{license.product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">v{license.product.version}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{license.customer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{license.customer.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(license.status)}`}>
                        <StatusIcon size={12} />
                        {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(license.type)}`}>
                        {license.type.charAt(0).toUpperCase() + license.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {license.activationCount}/{license.activationLimit}
                        </span>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(license.activationCount / license.activationLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {license.expiresAt ? formatDate(license.expiresAt) : 'Never'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <LicenseActionMenu license={license} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedLicenses.length === 0 && (
            <div className="text-center py-12">
              <Key size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No licenses found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLicenses.length)} of {filteredLicenses.length} licenses
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* License Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate New License</h3>
              <button
                onClick={() => setShowGenerator(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate a new license key for manual distribution or testing purposes.
            </p>
            <div className="flex gap-3">
              <button
                onClick={generateNewLicense}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate License
              </button>
              <button
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Details Modal */}
      {showLicenseDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">License Details</h3>
                <button
                  onClick={() => setShowLicenseDetails(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* License Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">License Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border">
                    {showLicenseDetails.licenseKey}
                  </code>
                  <button
                    onClick={() => handleCopyLicenseKey(showLicenseDetails.licenseKey)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Product & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product</label>
                  <div className="text-gray-900 dark:text-white">
                    <div className="font-medium">{showLicenseDetails.product.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Version {showLicenseDetails.product.version}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer</label>
                  <div className="text-gray-900 dark:text-white">
                    <div className="font-medium">{showLicenseDetails.customer.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{showLicenseDetails.customer.email}</div>
                  </div>
                </div>
              </div>

              {/* Status & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(showLicenseDetails.status)}`}>
                    {React.createElement(getStatusIcon(showLicenseDetails.status), { size: 14 })}
                    {showLicenseDetails.status.charAt(0).toUpperCase() + showLicenseDetails.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">License Type</label>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(showLicenseDetails.type)}`}>
                    {showLicenseDetails.type.charAt(0).toUpperCase() + showLicenseDetails.type.slice(1)}
                  </span>
                </div>
              </div>

              {/* Domains */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Authorized Domains ({showLicenseDetails.domains.length}/{showLicenseDetails.maxDomains})
                </label>
                <div className="space-y-2">
                  {showLicenseDetails.domains.length > 0 ? (
                    showLicenseDetails.domains.map((domain, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Globe size={14} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{domain}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No domains registered</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(showLicenseDetails.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Used</label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(showLicenseDetails.lastUsed)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expires</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {showLicenseDetails.expiresAt ? formatDateTime(showLicenseDetails.expiresAt) : 'Never'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {showLicenseDetails.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {showLicenseDetails.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Licenses;
