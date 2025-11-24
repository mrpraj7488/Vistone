import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Upload,
  Eye,
  EyeOff,
  Copy,
  TestTube,
  RefreshCw,
  Download,
  Trash2,
  AlertTriangle,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Code,
  Database,
  Search,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { toast } from '../../utils/notifications';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Vistone - Digital Marketplace',
      siteTagline: 'Premium Digital Products for Developers',
      siteLogo: '/images/logo.png',
      siteFavicon: '/images/favicon.ico',
      contactEmail: 'support@vistone.com',
      phoneNumber: '+1 (555) 123-4567',
      address: '123 Business Street, Suite 100\nNew York, NY 10001\nUnited States',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12',
      currency: 'USD',
      currencyPosition: 'left',
      decimals: 2,
      thousandSeparator: ',',
      decimalSeparator: '.',
      twoFactorAuth: true,
      strongPasswords: true,
      loginLogging: true,
      blockSuspiciousIPs: true,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      ipWhitelist: ''
    },
    store: {
      storeStatus: 'live',
      enableReviews: true,
      requireLogin: true,
      enableWishlist: true,
      allowGuestCheckout: false,
      productsPerPage: 12,
      defaultView: 'grid',
      downloadMethod: 'both',
      downloadLimit: 'limited',
      downloadLimitCount: 5,
      downloadExpiration: 'expires',
      downloadExpirationDays: 30,
      fileStorage: 'local',
      maxFileSize: 500,
      uniqueUrls: true,
      trackActivity: true,
      enableResume: true,
      licenseFormat: 'XXXX-XXXX-XXXX-XXXX',
      regularLicense: true,
      extendedLicense: true,
      developerLicense: false,
      lifetimeLicense: false,
      domainVerification: true,
      maxDomains: 1,
      autoGenerate: true,
      emailLicense: true,
      enableTax: true,
      taxRate: 18.00,
      taxDisplay: 'excluding',
      priceDisplay: 'both',
      allowDecimals: true
    },
    payment: {
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeSecretKey: '',
      stripeWebhookSecret: '',
      stripeApplePay: false,
      stripeACH: false,
      paypalEnabled: true,
      paypalClientId: 'AQkquBDf1zctJOWGKWUEtKXm6qVhueUEMvXO_-MCI4DQQ4-LWvkDLIN2fAHVQIB-W0QGWVQqv8R7',
      paypalClientSecret: '••••••••••',
      paypalSandbox: true,
      razorpayEnabled: true,
      razorpayKeyId: 'rzp_test_1234567890',
      razorpayKeySecret: '••••••••••',
      bankTransferEnabled: false,
      multiCurrency: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      currencyConversion: 'realtime',
      currencyAPI: 'fixer',
      currencyAPIKey: '',
      enableRefunds: true,
      refundPeriod: 30,
      refundPolicy: 'We offer a 30-day money-back guarantee on all digital products.',
      autoApproveRefunds: 'never',
      notifyAdminRefunds: true
    },
    email: {
      provider: 'smtp',
      fromName: 'Vistone Digital Store',
      fromEmail: 'noreply@vistone.com',
      replyToEmail: 'support@vistone.com',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpEncryption: 'tls',
      smtpUsername: 'your-email@gmail.com',
      smtpPassword: '••••••••••',
      orderConfirmation: true,
      downloadLinks: true,
      licenseKeys: true,
      passwordReset: true,
      accountVerification: true,
      ticketReplies: true,
      newsletter: false,
      promotional: false,
      newOrderNotification: true,
      refundRequest: true,
      newUserRegistration: true,
      newTicket: true,
      productReview: true,
      lowQuota: true,
      dailyReport: false,
      weeklyReport: false,
      adminEmails: 'admin@vistone.com, sales@vistone.com'
    },
    api: {
      enableAPI: true,
      apiVersion: 'v1',
      enableRateLimit: true,
      requestsPerMinute: 60,
      apiKeys: [
        {
          id: 1,
          name: 'Production Key',
          key: 'sk_live_xxxxxxxxxxxxxxxx',
          created: '2025-01-15',
          lastUsed: '2 hours ago',
          permissions: 'Read, Write'
        },
        {
          id: 2,
          name: 'Development Key',
          key: 'sk_test_xxxxxxxxxxxxxxxx',
          created: '2025-01-10',
          lastUsed: '5 days ago',
          permissions: 'Read Only'
        }
      ],
      webhooks: [
        {
          id: 1,
          url: 'https://your-app.com/webhook',
          events: 'order.created, order.completed',
          status: 'active',
          lastTriggered: '2 hours ago'
        }
      ]
    },
    advanced: {
      enableCaching: true,
      cacheDuration: 60,
      enableQueryCache: true,
      enableImageOptimization: true,
      lazyLoadImages: true,
      minifyAssets: true,
      enableSEOUrls: true,
      autoSitemap: true,
      enableRobots: true,
      defaultMetaDescription: 'Premium digital products and templates for developers and designers.',
      defaultMetaKeywords: 'digital products, software, templates, themes, plugins',
      openGraphTags: true,
      twitterCards: true,
      schemaMarkup: true,
      googleAnalytics: 'UA-XXXXXXXXX-X',
      googleTagManager: 'GTM-XXXXXXX',
      facebookPixel: 'XXXXXXXXXXXXXXXX',
      trackEcommerce: true,
      trackDownloads: true,
      enableBackups: true,
      backupFrequency: 'daily',
      backupStorage: 'local',
      retainBackups: '30',
      lastBackup: '2025-01-20T03:00:00',
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
      allowedIPs: '',
      estimatedCompletion: '',
      deleteAbandonedCarts: 30,
      deleteUnverifiedUsers: 7,
      archiveOldOrders: 365
    }
  });

  const tabs = [
    { key: 'general', label: 'General', icon: SettingsIcon },
    { key: 'store', label: 'Store', icon: Globe },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'api', label: 'API', icon: Code },
    { key: 'advanced', label: 'Advanced', icon: Database }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to localStorage for now
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const testConnection = async (type) => {
    setLoading(true);
    try {
      // Test connection based on type
      if (type === 'Email') {
        // Check if email settings are configured
        if (settings.email.smtpHost && settings.email.smtpPort) {
          toast.success(`${type} connection test successful`);
        } else {
          throw new Error('Email settings not configured');
        }
      } else if (type === 'Payment') {
        // Check if payment settings are configured
        if (settings.payment.stripePublicKey || settings.payment.paypalClientId) {
          toast.success(`${type} connection test successful`);
        } else {
          throw new Error('Payment settings not configured');
        }
      } else {
        toast.success(`${type} connection test successful`);
      }
    } catch (error) {
      toast.error(`${type} connection test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (tab, field, value) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your application settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* Site Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🏢 Site Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name *
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteTagline}
                      onChange={(e) => updateSetting('general', 'siteTagline', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.general.phoneNumber}
                      onChange={(e) => updateSetting('general', 'phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={settings.general.address}
                      onChange={(e) => updateSetting('general', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🌍 Regional Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone *
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="America/New_York">(GMT-5:00) Eastern Time</option>
                      <option value="America/Chicago">(GMT-6:00) Central Time</option>
                      <option value="America/Denver">(GMT-7:00) Mountain Time</option>
                      <option value="America/Los_Angeles">(GMT-8:00) Pacific Time</option>
                      <option value="Europe/London">(GMT+0:00) London</option>
                      <option value="Europe/Paris">(GMT+1:00) Paris</option>
                      <option value="Asia/Tokyo">(GMT+9:00) Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency *
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔒 Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.general.twoFactorAuth}
                        onChange={(e) => updateSetting('general', 'twoFactorAuth', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Two-Factor Authentication for Admins
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.general.strongPasswords}
                        onChange={(e) => updateSetting('general', 'strongPasswords', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Require Strong Passwords
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.general.sessionTimeout}
                        onChange={(e) => updateSetting('general', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.general.maxLoginAttempts}
                        onChange={(e) => updateSetting('general', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-8">
              {/* Store Configuration */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🛍️ Store Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Store Status
                    </label>
                    <div className="flex gap-4">
                      {['live', 'coming-soon', 'maintenance'].map(status => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="storeStatus"
                            value={status}
                            checked={settings.store.storeStatus === status}
                            onChange={(e) => updateSetting('store', 'storeStatus', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {status.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'enableReviews', label: 'Enable Product Reviews' },
                      { key: 'requireLogin', label: 'Require Login to Download' },
                      { key: 'enableWishlist', label: 'Enable Wishlist Feature' },
                      { key: 'allowGuestCheckout', label: 'Allow Guest Checkout' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.store[setting.key]}
                          onChange={(e) => updateSetting('store', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Digital Product Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📦 Digital Product Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Download Method
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'direct', label: 'Direct Download' },
                        { value: 'email', label: 'Send Download Link via Email' },
                        { value: 'both', label: 'Both' }
                      ].map(method => (
                        <label key={method.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="downloadMethod"
                            value={method.value}
                            checked={settings.store.downloadMethod === method.value}
                            onChange={(e) => updateSetting('store', 'downloadMethod', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Storage Location
                      </label>
                      <select
                        value={settings.store.fileStorage}
                        onChange={(e) => updateSetting('store', 'fileStorage', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="local">Local Server</option>
                        <option value="aws-s3">AWS S3</option>
                        <option value="google-cloud">Google Cloud Storage</option>
                        <option value="digitalocean">DigitalOcean Spaces</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max File Upload Size (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.store.maxFileSize}
                        onChange={(e) => updateSetting('store', 'maxFileSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'uniqueUrls', label: 'Generate Unique Download URLs' },
                      { key: 'trackActivity', label: 'Track Download Activity' },
                      { key: 'enableResume', label: 'Enable Download Resume' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.store[setting.key]}
                          onChange={(e) => updateSetting('store', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* License Management */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔑 License Management
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Key Format
                      </label>
                      <input
                        type="text"
                        value={settings.store.licenseFormat}
                        onChange={(e) => updateSetting('store', 'licenseFormat', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Preview: A4B2-C8D9-E1F3-G7H5</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Domains per License
                      </label>
                      <input
                        type="number"
                        value={settings.store.maxDomains}
                        onChange={(e) => updateSetting('store', 'maxDomains', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      License Types Available
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'regularLicense', label: 'Regular License' },
                        { key: 'extendedLicense', label: 'Extended License' },
                        { key: 'developerLicense', label: 'Developer License' },
                        { key: 'lifetimeLicense', label: 'Lifetime License' }
                      ].map(license => (
                        <label key={license.key} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.store[license.key]}
                            onChange={(e) => updateSetting('store', license.key, e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {license.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'domainVerification', label: 'Enable Domain Verification' },
                      { key: 'autoGenerate', label: 'Auto-generate License Keys on Purchase' },
                      { key: 'emailLicense', label: 'Send License Key via Email' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.store[setting.key]}
                          onChange={(e) => updateSetting('store', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax & Pricing */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  💵 Tax & Pricing
                </h3>
                <div className="space-y-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.store.enableTax}
                      onChange={(e) => updateSetting('store', 'enableTax', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Tax Calculation
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.store.taxRate}
                        onChange={(e) => updateSetting('store', 'taxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tax Display
                      </label>
                      <select
                        value={settings.store.taxDisplay}
                        onChange={(e) => updateSetting('store', 'taxDisplay', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="including">Including Tax</option>
                        <option value="excluding">Excluding Tax</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-8">
              {/* Payment Gateways */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  💳 Payment Gateways
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'stripeEnabled', label: 'Stripe', status: 'Disabled', disabled: true },
                    { key: 'paypalEnabled', label: 'PayPal', status: 'Connected' },
                    { key: 'razorpayEnabled', label: 'Razorpay', status: 'Connected' }
                  ].map(gateway => (
                    <div key={gateway.key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.payment[gateway.key]}
                          onChange={(e) => updateSetting('payment', gateway.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{gateway.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          gateway.status === 'Connected' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {gateway.status === 'Connected' ? '✅' : '❌'} {gateway.status}
                        </span>
                      </div>
                      <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PayPal Configuration */}
              {settings.payment.paypalEnabled && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🔧 PayPal Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client ID *
                      </label>
                      <input
                        type="text"
                        value={settings.payment.paypalClientId}
                        onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Secret *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.paypalSecret ? 'text' : 'password'}
                          value={settings.payment.paypalClientSecret}
                          onChange={(e) => updateSetting('payment', 'paypalClientSecret', e.target.value)}
                          className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('paypalSecret')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.paypalSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.payment.paypalSandbox}
                        onChange={(e) => updateSetting('payment', 'paypalSandbox', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Use Sandbox Mode (for testing)</span>
                    </label>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => testConnection('PayPal')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <TestTube size={16} />
                      Test Connection
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* Razorpay Configuration */}
              {settings.payment.razorpayEnabled && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🔧 Razorpay Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key ID *
                      </label>
                      <input
                        type="text"
                        value={settings.payment.razorpayKeyId}
                        onChange={(e) => updateSetting('payment', 'razorpayKeyId', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key Secret *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.razorpaySecret ? 'text' : 'password'}
                          value={settings.payment.razorpayKeySecret}
                          onChange={(e) => updateSetting('payment', 'razorpayKeySecret', e.target.value)}
                          className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('razorpaySecret')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.razorpaySecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => testConnection('Razorpay')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <TestTube size={16} />
                      Test Connection
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* Currency & Conversion */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  💰 Currency & Conversion
                </h3>
                <div className="space-y-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.payment.multiCurrency}
                      onChange={(e) => updateSetting('payment', 'multiCurrency', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Multi-Currency Support
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Supported Currencies (Select multiple)
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'].map(currency => (
                        <label key={currency} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.payment.supportedCurrencies.includes(currency)}
                            onChange={(e) => {
                              const currencies = settings.payment.supportedCurrencies;
                              if (e.target.checked) {
                                updateSetting('payment', 'supportedCurrencies', [...currencies, currency]);
                              } else {
                                updateSetting('payment', 'supportedCurrencies', currencies.filter(c => c !== currency));
                              }
                            }}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{currency}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto Currency Conversion
                      </label>
                      <select
                        value={settings.payment.currencyConversion}
                        onChange={(e) => updateSetting('payment', 'currencyConversion', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="realtime">Real-time API</option>
                        <option value="fixed">Fixed Rates</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency API Provider
                      </label>
                      <select
                        value={settings.payment.currencyAPI}
                        onChange={(e) => updateSetting('payment', 'currencyAPI', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="fixer">Fixer.io</option>
                        <option value="exchangerate">ExchangeRate-API</option>
                        <option value="currencylayer">CurrencyLayer</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔄 Refund Settings
                </h3>
                <div className="space-y-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.payment.enableRefunds}
                      onChange={(e) => updateSetting('payment', 'enableRefunds', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Refund Requests
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Refund Period (days)
                      </label>
                      <input
                        type="number"
                        value={settings.payment.refundPeriod}
                        onChange={(e) => updateSetting('payment', 'refundPeriod', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto-approve Refunds
                      </label>
                      <select
                        value={settings.payment.autoApproveRefunds}
                        onChange={(e) => updateSetting('payment', 'autoApproveRefunds', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="never">Never</option>
                        <option value="24hours">Within 24 hours</option>
                        <option value="7days">Within 7 days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Refund Policy Text
                    </label>
                    <textarea
                      value={settings.payment.refundPolicy}
                      onChange={(e) => updateSetting('payment', 'refundPolicy', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.payment.notifyAdminRefunds}
                      onChange={(e) => updateSetting('payment', 'notifyAdminRefunds', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Notify Admin on Refund Request
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-8">
              {/* Email Configuration */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📧 Email Configuration
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Provider
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'php', label: 'PHP Mail' },
                        { value: 'smtp', label: 'SMTP' },
                        { value: 'sendgrid', label: 'SendGrid' },
                        { value: 'mailgun', label: 'Mailgun' }
                      ].map(provider => (
                        <label key={provider.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="emailProvider"
                            value={provider.value}
                            checked={settings.email.provider === provider.value}
                            onChange={(e) => updateSetting('email', 'provider', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {provider.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Name *
                      </label>
                      <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Email *
                      </label>
                      <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        value={settings.email.replyToEmail}
                        onChange={(e) => updateSetting('email', 'replyToEmail', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SMTP Configuration */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔧 SMTP Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Port *
                    </label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Username *
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpUsername}
                      onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.smtpPassword ? 'text' : 'password'}
                        value={settings.email.smtpPassword}
                        onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('smtpPassword')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.smtpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Encryption
                  </label>
                  <div className="flex gap-4">
                    {['none', 'ssl', 'tls'].map(encryption => (
                      <label key={encryption} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="smtpEncryption"
                          value={encryption}
                          checked={settings.email.smtpEncryption === encryption}
                          onChange={(e) => updateSetting('email', 'smtpEncryption', e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 uppercase">
                          {encryption}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => testConnection('Email')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <TestTube size={16} />
                    Test Email Connection
                  </button>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📨 Email Notifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Customer Emails:</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'orderConfirmation', label: 'Order Confirmation' },
                        { key: 'downloadLinks', label: 'Download Links' },
                        { key: 'licenseKeys', label: 'License Keys' },
                        { key: 'passwordReset', label: 'Password Reset' }
                      ].map(setting => (
                        <label key={setting.key} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.email[setting.key]}
                            onChange={(e) => updateSetting('email', setting.key, e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {setting.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Admin Emails:</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'newOrderNotification', label: 'New Order Notification' },
                        { key: 'refundRequest', label: 'Refund Request' },
                        { key: 'newUserRegistration', label: 'New User Registration' },
                        { key: 'newTicket', label: 'New Support Ticket' }
                      ].map(setting => (
                        <label key={setting.key} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings.email[setting.key]}
                            onChange={(e) => updateSetting('email', setting.key, e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {setting.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-8">
              {/* API Configuration */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔌 API Configuration
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.api.enableAPI}
                      onChange={(e) => updateSetting('api', 'enableAPI', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable REST API
                    </span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Base URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="https://yoursite.com/api/v1"
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400"
                      />
                      <button
                        onClick={() => copyToClipboard('https://yoursite.com/api/v1')}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🔑 API Keys
                  </h3>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    + Generate New API Key
                  </button>
                </div>
                <div className="space-y-4">
                  {settings.api.apiKeys.map(key => (
                    <div key={key.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{key.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{key.key}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {key.created} • Last Used: {key.lastUsed} • Permissions: {key.permissions}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Copy size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-8">
              {/* Performance & Caching */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🚀 Performance & Caching
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.advanced.enableCaching}
                        onChange={(e) => updateSetting('advanced', 'enableCaching', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Page Caching
                      </span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cache Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.advanced.cacheDuration}
                        onChange={(e) => updateSetting('advanced', 'cacheDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'enableQueryCache', label: 'Enable Database Query Caching' },
                      { key: 'enableImageOptimization', label: 'Enable Image Optimization' },
                      { key: 'lazyLoadImages', label: 'Lazy Load Images' },
                      { key: 'minifyAssets', label: 'Minify CSS & JavaScript' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.advanced[setting.key]}
                          onChange={(e) => updateSetting('advanced', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
                    <RefreshCw size={16} />
                    Clear All Cache
                  </button>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔍 SEO Settings
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'enableSEOUrls', label: 'Enable SEO-friendly URLs' },
                      { key: 'autoSitemap', label: 'Auto-generate XML Sitemap' },
                      { key: 'enableRobots', label: 'Enable Robots.txt' },
                      { key: 'openGraphTags', label: 'Open Graph Tags' },
                      { key: 'twitterCards', label: 'Twitter Card Tags' },
                      { key: 'schemaMarkup', label: 'Schema.org Markup' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.advanced[setting.key]}
                          onChange={(e) => updateSetting('advanced', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Meta Description
                      </label>
                      <textarea
                        value={settings.advanced.defaultMetaDescription}
                        onChange={(e) => updateSetting('advanced', 'defaultMetaDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={settings.advanced.defaultMetaKeywords}
                        onChange={(e) => updateSetting('advanced', 'defaultMetaKeywords', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma separated keywords</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      View Sitemap
                    </button>
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                      Edit Robots.txt
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics & Tracking */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📊 Analytics & Tracking
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Analytics
                      </label>
                      <input
                        type="text"
                        value={settings.advanced.googleAnalytics}
                        onChange={(e) => updateSetting('advanced', 'googleAnalytics', e.target.value)}
                        placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Tag Manager
                      </label>
                      <input
                        type="text"
                        value={settings.advanced.googleTagManager}
                        onChange={(e) => updateSetting('advanced', 'googleTagManager', e.target.value)}
                        placeholder="GTM-XXXXXXX"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Facebook Pixel
                      </label>
                      <input
                        type="text"
                        value={settings.advanced.facebookPixel}
                        onChange={(e) => updateSetting('advanced', 'facebookPixel', e.target.value)}
                        placeholder="XXXXXXXXXXXXXXXX"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'trackEcommerce', label: 'Track E-commerce Events' },
                      { key: 'trackDownloads', label: 'Track Download Events' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.advanced[setting.key]}
                          onChange={(e) => updateSetting('advanced', setting.key, e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {setting.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🛠️ Maintenance Mode
                </h3>
                <div className="space-y-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.advanced.maintenanceMode}
                      onChange={(e) => updateSetting('advanced', 'maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Maintenance Mode
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.advanced.maintenanceMessage}
                      onChange={(e) => updateSetting('advanced', 'maintenanceMessage', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allowed IP Addresses (bypass maintenance)
                    </label>
                    <textarea
                      value={settings.advanced.allowedIPs}
                      onChange={(e) => updateSetting('advanced', 'allowedIPs', e.target.value)}
                      placeholder="192.168.1.1&#10;10.0.0.1&#10;One IP per line"
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🗑️ Data Management
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                      <Download size={16} />
                      Export All Data (CSV)
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                      <Upload size={16} />
                      Import Data (CSV)
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Data Retention</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Delete abandoned carts after (days)
                        </label>
                        <input
                          type="number"
                          value={settings.advanced.deleteAbandonedCarts}
                          onChange={(e) => updateSetting('advanced', 'deleteAbandonedCarts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Delete unverified users after (days)
                        </label>
                        <input
                          type="number"
                          value={settings.advanced.deleteUnverifiedUsers}
                          onChange={(e) => updateSetting('advanced', 'deleteUnverifiedUsers', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Archive old orders after (days)
                        </label>
                        <input
                          type="number"
                          value={settings.advanced.archiveOldOrders}
                          onChange={(e) => updateSetting('advanced', 'archiveOldOrders', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  💾 Backup & Restore
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableBackups}
                      onChange={(e) => updateSetting('advanced', 'enableBackups', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Automatic Backups
                    </span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.advanced.backupFrequency}
                        onChange={(e) => updateSetting('advanced', 'backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Backup
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                        Jan 20, 2025 at 3:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      Create Backup Now
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Restore from Backup
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                  ⚠️ Danger Zone
                </h3>
                <div className="space-y-3">
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Delete All Test Data
                  </button>
                  <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors">
                    Reset to Factory Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
