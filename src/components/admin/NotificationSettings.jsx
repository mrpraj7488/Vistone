import React, { useState, useEffect } from 'react';
import { Bell, Save, RotateCcw } from 'lucide-react';

const NotificationSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    // Email Notifications
    emailNotifications: {
      newOrders: true,
      newTickets: true,
      newUsers: false,
      productReviews: true,
      lowStock: true,
      systemAlerts: true,
      weeklyReports: false,
      monthlyReports: true
    },
    
    // Browser Notifications
    browserNotifications: {
      enabled: true,
      newOrders: true,
      newTickets: true,
      newUsers: false,
      productReviews: false,
      lowStock: true,
      systemAlerts: true
    },
    
    // Notification Frequency
    frequency: {
      realTime: true,
      digest: false,
      digestFrequency: 'daily' // daily, weekly
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };


  const testNotification = (type) => {
    if (settings.browserNotifications.enabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: `This is a test ${type} notification`,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: `This is a test ${type} notification`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    
  };

  const saveSettings = () => {
    localStorage.setItem('admin-notification-settings', JSON.stringify(settings));
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      emailNotifications: {
        newOrders: true,
        newTickets: true,
        newUsers: false,
        productReviews: true,
        lowStock: true,
        systemAlerts: true,
        weeklyReports: false,
        monthlyReports: true
      },
      browserNotifications: {
        enabled: true,
        newOrders: true,
        newTickets: true,
        newUsers: false,
        productReviews: false,
        lowStock: true,
        systemAlerts: true
      },
      frequency: {
        realTime: true,
        digest: false,
        digestFrequency: 'daily'
      }
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notification Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize how you receive notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Email Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Email Notifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.emailNotifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleSettingChange('emailNotifications', key, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Browser Notifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Browser Notifications
                </h3>
                <button
                  onClick={() => testNotification('order')}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Test
                </button>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Browser Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.browserNotifications.enabled}
                    onChange={(e) => handleSettingChange('browserNotifications', 'enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
              
              {settings.browserNotifications.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.browserNotifications).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('browserNotifications', key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>


            {/* Notification Frequency */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Frequency
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="frequency"
                    checked={settings.frequency.realTime}
                    onChange={() => handleSettingChange('frequency', 'realTime', true)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Real-time</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified immediately when events occur</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="frequency"
                    checked={settings.frequency.digest}
                    onChange={() => handleSettingChange('frequency', 'digest', true)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Digest</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive a summary of notifications</p>
                  </div>
                </label>
                
                {settings.frequency.digest && (
                  <div className="ml-7">
                    <select
                      value={settings.frequency.digestFrequency}
                      onChange={(e) => handleSettingChange('frequency', 'digestFrequency', e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
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
              onClick={saveSettings}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
