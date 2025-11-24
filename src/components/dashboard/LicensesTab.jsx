import { useState, useEffect } from 'react';
import { Key, Globe, Shield, AlertCircle, CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'suspended':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className={`h-8 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded-lg mb-8 w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`rounded-2xl p-6 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className={`h-6 rounded mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 rounded mb-2 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          License Management
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your product licenses and domain activations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {licenses.length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Licenses
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {licenses.filter(l => l.status === 'active').length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Licenses
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {licenses.reduce((sum, l) => sum + l.activatedDomains.length, 0)}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Domains
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Licenses List */}
      <div className="space-y-6">
        {licenses.map((license) => (
          <div
            key={license.id}
            className={`rounded-2xl p-6 border transition-all ${
              darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(license.status)}
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {license.productName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(license.status)}`}>
                    {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`}>
                    {license.licenseType}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      License Key
                    </p>
                    <div className="flex items-center gap-2">
                      <code className={`text-sm font-mono px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {license.licenseKey}
                      </code>
                      <button
                        onClick={() => copyLicenseKey(license.licenseKey)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Copy license key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Domain Usage
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {license.activatedDomains.length} / {license.maxDomains} domains used
                    </p>
                  </div>
                </div>

                {license.activatedDomains.length > 0 && (
                  <div className="mb-4">
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Activated Domains
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {license.activatedDomains.map((domain) => (
                        <div
                          key={domain}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                        >
                          <Globe className="w-4 h-4" />
                          <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {domain}
                          </span>
                          <button
                            onClick={() => handleDeactivateDomain(license, domain)}
                            className="text-red-500 hover:text-red-600"
                            title="Deactivate domain"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Purchase Date</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {new Date(license.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Expiry</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'Lifetime'}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Downloads</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {license.downloadLimit === 'Unlimited' 
                        ? `${license.downloadsUsed} / Unlimited`
                        : `${license.downloadsUsed} / ${license.downloadLimit}`
                      }
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Used</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {license.lastUsed ? new Date(license.lastUsed).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {license.status === 'active' && license.activatedDomains.length < license.maxDomains && (
                  <Button
                    onClick={() => {
                      setSelectedLicense(license);
                      setActivationModalOpen(true);
                    }}
                    className="whitespace-nowrap"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Activate Domain
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => copyLicenseKey(license.licenseKey)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Key
                </Button>
              </div>
            </div>
          </div>
        ))}
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
        <div className="space-y-4">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Enter the domain name you want to activate for <strong>{selectedLicense?.productName}</strong>
          </p>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Domain Name
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="example.com"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                darkMode 
                  ? 'bg-[#1A2C4A] border-white/10 text-white placeholder-gray-400 focus:border-cyan-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
              }`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter domain without http:// or https://
            </p>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                  Domain Usage: {selectedLicense?.activatedDomains.length || 0} / {selectedLicense?.maxDomains || 0}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  You can activate {(selectedLicense?.maxDomains || 0) - (selectedLicense?.activatedDomains.length || 0)} more domains
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
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
