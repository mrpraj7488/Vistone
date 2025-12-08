import { useState, useEffect } from 'react';
import { Key, Globe, Shield, AlertCircle, CheckCircle, XCircle, Copy, RefreshCw, ChevronRight, Server, Calendar, Download, Clock } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export default function LicensesTab({ darkMode }) {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const { user } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  // Sample licenses data
  const sampleLicenses = [
    {
      id: 1,
      productName: 'React Dashboard Pro',
      licenseKey: 'RDP-2024-XXXX-YYYY-ZZZZ',
      licenseType: 'Extended',
      status: 'active',
      activatedDomains: ['mydomain.com', 'staging.mydomain.com'],
      maxDomains: 5,
      purchaseDate: '2024-01-15',
      expiryDate: null, // Lifetime
      downloadLimit: 'Unlimited',
      downloadsUsed: 3,
      lastUsed: '2024-01-20'
    },
    {
      id: 2,
      productName: 'Vue Admin Template',
      licenseKey: 'VAT-2024-AAAA-BBBB-CCCC',
      licenseType: 'Regular',
      status: 'active',
      activatedDomains: ['mysite.com'],
      maxDomains: 1,
      purchaseDate: '2024-01-10',
      expiryDate: null,
      downloadLimit: 10,
      downloadsUsed: 2,
      lastUsed: '2024-01-18'
    },
    {
      id: 3,
      productName: 'Full Stack Starter Kit',
      licenseKey: 'FSK-2024-DDDD-EEEE-FFFF',
      licenseType: 'Developer',
      status: 'suspended',
      activatedDomains: [],
      maxDomains: 10,
      purchaseDate: '2024-01-05',
      expiryDate: '2025-01-05',
      downloadLimit: 'Unlimited',
      downloadsUsed: 0,
      lastUsed: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLicenses(sampleLicenses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleActivateDomain = async (license) => {
    if (!domainInput.trim()) {
      showToast('Please enter a domain name', 'error');
      return;
    }

    if (license.activatedDomains.length >= license.maxDomains) {
      showToast('Maximum domains reached for this license', 'error');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const updatedLicenses = licenses.map(l =>
        l.id === license.id
          ? { ...l, activatedDomains: [...l.activatedDomains, domainInput.trim()] }
          : l
      );
      setLicenses(updatedLicenses);
      setDomainInput('');
      setActivationModalOpen(false);
      showToast('Domain activated successfully!', 'success');
    }, 1000);
  };

  const handleDeactivateDomain = (license, domain) => {
    const updatedLicenses = licenses.map(l =>
      l.id === license.id
        ? { ...l, activatedDomains: l.activatedDomains.filter(d => d !== domain) }
        : l
    );
    setLicenses(updatedLicenses);
    showToast('Domain deactivated successfully!', 'success');
  };

  const copyLicenseKey = (key) => {
    navigator.clipboard.writeText(key);
    showToast('License key copied to clipboard!', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'suspended':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'expired':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="mr-1.5" />;
      case 'suspended':
        return <XCircle size={16} className="mr-1.5" />;
      case 'expired':
        return <AlertCircle size={16} className="mr-1.5" />;
      default:
        return <AlertCircle size={16} className="mr-1.5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex gap-4">
          <div className={`h-32 flex-1 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          <div className={`h-32 flex-1 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          <div className={`h-32 flex-1 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-40 rounded-2xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            License Management
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your product licenses and domain activations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Licenses
              </p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {licenses.length}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
              <Key size={28} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Licenses
              </p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {licenses.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
              <CheckCircle size={28} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Domains
              </p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {licenses.reduce((sum, l) => sum + l.activatedDomains.length, 0)}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
              <Globe size={28} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Licenses List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {licenses.map((license, index) => (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-md ${darkMode
                ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {license.productName}
                      </h3>
                      <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(license.status)}`}>
                        {getStatusIcon(license.status)}
                        {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {license.licenseType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                        <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          License Key
                        </p>
                        <div className="flex items-center gap-2">
                          <code className={`flex-1 text-sm font-mono break-all ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {license.licenseKey}
                          </code>
                          <button
                            onClick={() => copyLicenseKey(license.licenseKey)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
                            title="Copy license key"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Domain Usage
                          </p>
                          <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {license.activatedDomains.length} / {license.maxDomains}
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full ${license.activatedDomains.length >= license.maxDomains
                              ? 'bg-rose-500'
                              : 'bg-blue-500'
                              }`}
                            style={{ width: `${(license.activatedDomains.length / license.maxDomains) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {license.activatedDomains.length > 0 && (
                      <div className="mb-6">
                        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Activated Domains
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {license.activatedDomains.map((domain) => (
                            <div
                              key={domain}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
                            >
                              <Globe size={14} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {domain}
                              </span>
                              <button
                                onClick={() => handleDeactivateDomain(license, domain)}
                                className="ml-1 text-slate-400 hover:text-rose-500 transition-colors"
                                title="Deactivate domain"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                      <div>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Purchase Date</p>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Calendar size={14} />
                          {new Date(license.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Expiry</p>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Clock size={14} />
                          {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'Lifetime'}
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Downloads</p>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Download size={14} />
                          {license.downloadLimit === 'Unlimited'
                            ? `${license.downloadsUsed} / ∞`
                            : `${license.downloadsUsed} / ${license.downloadLimit}`
                          }
                        </div>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Last Used</p>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Server size={14} />
                          {license.lastUsed ? new Date(license.lastUsed).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48 lg:border-l lg:pl-6 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    {license.status === 'active' && license.activatedDomains.length < license.maxDomains && (
                      <Button
                        onClick={() => {
                          setSelectedLicense(license);
                          setActivationModalOpen(true);
                        }}
                        className="w-full justify-center"
                      >
                        <Globe size={16} className="mr-2" />
                        Activate Domain
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => copyLicenseKey(license.licenseKey)}
                      className="w-full justify-center"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Key
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Domain Activation Modal */}
      <Modal
        isOpen={activationModalOpen}
        onClose={() => {
          setActivationModalOpen(false);
          setDomainInput('');
        }}
        title="Activate Domain"
      >
        <div className="space-y-6">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              Enter the domain name you want to activate for <strong className="font-bold">{selectedLicense?.productName}</strong>
            </p>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Domain Name
            </label>
            <div className="relative">
              <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="example.com"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
              />
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter domain without http:// or https://
            </p>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Domain Usage: {selectedLicense?.activatedDomains.length || 0} / {selectedLicense?.maxDomains || 0}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  You can activate {(selectedLicense?.maxDomains || 0) - (selectedLicense?.activatedDomains.length || 0)} more domains
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setActivationModalOpen(false);
                setDomainInput('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleActivateDomain(selectedLicense)}
              className="flex-1"
              disabled={!domainInput.trim()}
            >
              Activate Domain
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
