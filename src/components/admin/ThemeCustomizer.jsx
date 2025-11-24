import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Paintbrush,
  Eye,
  RotateCcw,
  Save,
  X
} from 'lucide-react';

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [themeMode, setThemeMode] = useState('system');
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  });
  const [fontSize, setFontSize] = useState('base');
  const [borderRadius, setBorderRadius] = useState('medium');
  const [spacing, setSpacing] = useState('normal');

  useEffect(() => {
    // Load saved theme preferences
    const savedTheme = localStorage.getItem('themeCustomization');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setThemeMode(theme.mode || 'system');
      setCustomColors(theme.colors || customColors);
      setFontSize(theme.fontSize || 'base');
      setBorderRadius(theme.borderRadius || 'medium');
      setSpacing(theme.spacing || 'normal');
    }
  }, []);

  const handleSaveTheme = () => {
    const themeConfig = {
      mode: themeMode,
      colors: customColors,
      fontSize,
      borderRadius,
      spacing
    };
    
    localStorage.setItem('themeCustomization', JSON.stringify(themeConfig));
    
    // Apply theme to document
    applyTheme(themeConfig);
    
    onClose();
  };

  const applyTheme = (config) => {
    const root = document.documentElement;
    
    // Apply custom colors
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-warning', config.colors.warning);
    root.style.setProperty('--color-danger', config.colors.danger);
    
    // Apply font size
    const fontSizes = {
      small: '14px',
      base: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size-base', fontSizes[config.fontSize]);
    
    // Apply border radius
    const radiusValues = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '12px',
      xl: '16px'
    };
    root.style.setProperty('--border-radius', radiusValues[config.borderRadius]);
    
    // Apply spacing
    const spacingValues = {
      compact: '0.75',
      normal: '1',
      comfortable: '1.25'
    };
    root.style.setProperty('--spacing-multiplier', spacingValues[config.spacing]);
  };

  const resetToDefaults = () => {
    setThemeMode('system');
    setCustomColors({
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    });
    setFontSize('base');
    setBorderRadius('medium');
    setSpacing('normal');
  };

  const presetThemes = [
    {
      name: 'Default Blue',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Ocean',
      colors: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Forest',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Sunset',
      colors: {
        primary: '#F97316',
        secondary: '#EF4444',
        accent: '#F59E0B',
        warning: '#FBBF24',
        danger: '#DC2626'
      }
    },
    {
      name: 'Purple',
      colors: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customizer</h2>
              <p className="text-gray-600 dark:text-gray-400">Customize the appearance of your admin panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('colors')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'colors'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Palette size={18} />
                Colors
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'typography'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Paintbrush size={18} />
                Typography
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'layout'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Monitor size={18} />
                Layout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Scheme</h3>
                  
                  {/* Theme Mode */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'system', icon: Monitor, label: 'System' }
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setThemeMode(value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            themeMode === value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <Icon size={24} />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Custom Colors
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(customColors).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                            {key}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preset Themes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preset Themes
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {presetThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => setCustomColors(theme.colors)}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="font-medium">{theme.name}</span>
                          <div className="flex gap-1">
                            {Object.values(theme.colors).slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'small', label: 'Small (14px)' },
                      { value: 'base', label: 'Base (16px)' },
                      { value: 'large', label: 'Large (18px)' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setFontSize(value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          fontSize === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Border Radius
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'none', label: 'None' },
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setBorderRadius(value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          borderRadius === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compact' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'comfortable', label: 'Comfortable' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSpacing(value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          spacing === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTheme}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Save size={16} />
              Save Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
