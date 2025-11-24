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
  Check,
  Sparkles,
  Zap,
  Settings,
  Download,
  Upload
} from 'lucide-react';

const Theme = () => {
  const [activeTab, setActiveTab] = useState('appearance');
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
  const [savedThemes, setSavedThemes] = useState([]);

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

    // Load saved custom themes
    const saved = localStorage.getItem('savedThemes');
    if (saved) {
      setSavedThemes(JSON.parse(saved));
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
    applyTheme(themeConfig);
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = 'Theme saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
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

  const saveCustomTheme = () => {
    const themeName = prompt('Enter a name for your custom theme:');
    if (themeName) {
      const newTheme = {
        id: Date.now(),
        name: themeName,
        colors: customColors,
        fontSize,
        borderRadius,
        spacing,
        createdAt: new Date().toISOString()
      };
      
      const updated = [...savedThemes, newTheme];
      setSavedThemes(updated);
      localStorage.setItem('savedThemes', JSON.stringify(updated));
    }
  };

  const loadCustomTheme = (theme) => {
    setCustomColors(theme.colors);
    setFontSize(theme.fontSize);
    setBorderRadius(theme.borderRadius);
    setSpacing(theme.spacing);
  };

  const deleteCustomTheme = (themeId) => {
    const updated = savedThemes.filter(t => t.id !== themeId);
    setSavedThemes(updated);
    localStorage.setItem('savedThemes', JSON.stringify(updated));
  };

  const presetThemes = [
    {
      name: 'Default Blue',
      description: 'Clean and professional blue theme',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Ocean Breeze',
      description: 'Refreshing ocean-inspired colors',
      colors: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Forest Green',
      description: 'Natural and calming green palette',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Sunset Orange',
      description: 'Warm and energetic sunset colors',
      colors: {
        primary: '#F97316',
        secondary: '#EF4444',
        accent: '#F59E0B',
        warning: '#FBBF24',
        danger: '#DC2626'
      }
    },
    {
      name: 'Royal Purple',
      description: 'Elegant and sophisticated purple theme',
      colors: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    {
      name: 'Midnight Dark',
      description: 'Deep and mysterious dark theme',
      colors: {
        primary: '#1E293B',
        secondary: '#334155',
        accent: '#64748B',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  ];

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'colors', label: 'Colors', icon: Paintbrush },
    { id: 'layout', label: 'Layout', icon: Settings },
    { id: 'presets', label: 'Presets', icon: Sparkles },
    { id: 'custom', label: 'My Themes', icon: Zap }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customization</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize the appearance and feel of your admin panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border-l-3 border-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'light', icon: Sun, label: 'Light Mode', desc: 'Clean and bright interface' },
                      { value: 'dark', icon: Moon, label: 'Dark Mode', desc: 'Easy on the eyes' },
                      { value: 'system', icon: Monitor, label: 'System', desc: 'Follow system preference' }
                    ].map(({ value, icon: Icon, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setThemeMode(value)}
                        className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                          themeMode === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        {themeMode === value && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-3">
                          <div className={`p-3 rounded-lg ${themeMode === value ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Icon size={24} className={themeMode === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'small', label: 'Small', desc: '14px base size' },
                      { value: 'base', label: 'Medium', desc: '16px base size' },
                      { value: 'large', label: 'Large', desc: '18px base size' }
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setFontSize(value)}
                        className={`p-4 rounded-lg border-2 transition-colors text-left ${
                          fontSize === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key} Color
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-16 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <div 
                              className="absolute inset-1 rounded-md pointer-events-none"
                              style={{ backgroundColor: value }}
                            />
                          </div>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Preview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-600 mb-2"
                          style={{ backgroundColor: value }}
                        />
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{key}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Border Radius</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'none', label: 'None', preview: '0px' },
                      { value: 'small', label: 'Small', preview: '4px' },
                      { value: 'medium', label: 'Medium', preview: '8px' },
                      { value: 'large', label: 'Large', preview: '12px' }
                    ].map(({ value, label, preview }) => (
                      <button
                        key={value}
                        onClick={() => setBorderRadius(value)}
                        className={`p-4 border-2 transition-colors ${
                          borderRadius === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        style={{ borderRadius: preview }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{preview}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spacing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'compact', label: 'Compact', desc: 'Tight spacing for more content' },
                      { value: 'normal', label: 'Normal', desc: 'Balanced spacing' },
                      { value: 'comfortable', label: 'Comfortable', desc: 'Loose spacing for readability' }
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setSpacing(value)}
                        className={`p-4 rounded-lg border-2 transition-colors text-left ${
                          spacing === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preset Themes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presetThemes.map((theme) => (
                      <div
                        key={theme.name}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{theme.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{theme.description}</p>
                          </div>
                          <button
                            onClick={() => setCustomColors(theme.colors)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        <div className="flex gap-2">
                          {Object.values(theme.colors).slice(0, 5).map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Themes Tab */}
            {activeTab === 'custom' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Custom Themes</h3>
                  <button
                    onClick={saveCustomTheme}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Save Current as Custom
                  </button>
                </div>

                {savedThemes.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Custom Themes Yet</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first custom theme by saving your current settings</p>
                    <button
                      onClick={saveCustomTheme}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Current Theme
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{theme.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Created {new Date(theme.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => loadCustomTheme(theme)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Load
                            </button>
                            <button
                              onClick={() => deleteCustomTheme(theme.id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {Object.values(theme.colors).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;
