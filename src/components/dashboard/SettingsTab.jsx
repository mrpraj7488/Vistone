import { useState } from 'react';
import { Edit, Upload, X } from 'lucide-react';
import { useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

export default function SettingsTab({ darkMode, user }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(formData.bio.length);
  const showToast = useUIStore((state) => state.showToast);

  const [notifications, setNotifications] = useState({
    productUpdates: true,
    orderNotifications: true,
    marketingEmails: false,
    supportReplies: true,
    browserNotifications: true,
    soundEffects: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'bio') {
      setCharCount(value.length);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
      },
    });

    setSaving(false);
    if (error) {
      showToast('Failed to update profile', 'error');
    } else {
      showToast('Profile updated successfully!', 'success');
      setEditMode(false);
    }
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Preferences updated', 'success');
  };

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-[26px] rounded-full transition-all duration-300 ${
        checked
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
          : darkMode
          ? 'bg-[#475569]'
          : 'bg-[#CBD5E1]'
      }`}
    >
      <div
        className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${
          checked ? 'left-[calc(100%-23px)]' : 'left-[3px]'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your account preferences
        </p>
      </div>

      <div
        className={`rounded-2xl p-8 border ${
          darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Profile Information
            </h2>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border-2 transition-all hover:scale-105 ${
                darkMode
                  ? 'border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl">
                {userInitials}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Full Name
                </label>
                <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.fullName || 'Not set'}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email Address
                </label>
                <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.email}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Phone Number
                </label>
                <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.phone || 'Not set'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Bio
                </label>
                <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.bio || 'No bio added'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl">
                {userInitials}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 ${
                    darkMode
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload New Photo
                </button>
                <button
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    darkMode
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none opacity-60 cursor-not-allowed ${
                    darkMode
                      ? 'bg-gray-800 border-white/10 text-white'
                      : 'bg-gray-100 border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                    darkMode
                      ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none resize-none transition-all ${
                    darkMode
                      ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
                  }`}
                />
                <p className={`text-sm mt-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {charCount}/200 characters
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setEditMode(false)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold border-2 transition-all ${
                  darkMode
                    ? 'border-white/10 text-gray-300 hover:bg-white/5'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`rounded-2xl p-8 border ${
          darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🔔</span>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Email Notifications
            </h3>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Product Updates
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get notified about new updates
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.productUpdates}
                  onChange={() => handleToggle('productUpdates')}
                />
              </div>

              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Order Notifications
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive order confirmations
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.orderNotifications}
                  onChange={() => handleToggle('orderNotifications')}
                />
              </div>

              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Marketing Emails
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Promotional offers and news
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                />
              </div>

              <div className={`flex items-center justify-between py-4 ${darkMode ? '' : ''}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Support Replies
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    When support team responds
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.supportReplies}
                  onChange={() => handleToggle('supportReplies')}
                />
              </div>
            </div>
          </div>

          <div className={`pt-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Push Notifications
            </h3>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Browser Notifications
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Show desktop notifications
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.browserNotifications}
                  onChange={() => handleToggle('browserNotifications')}
                />
              </div>

              <div className={`flex items-center justify-between py-4`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sound Effects
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Play sound for notifications
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.soundEffects}
                  onChange={() => handleToggle('soundEffects')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
