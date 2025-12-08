import { useState } from 'react';
import { Edit, Upload, X, User, Mail, Phone, FileText, Bell, Volume2, Globe, Shield } from 'lucide-react';
import { useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import Button from '../ui/Button';

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
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked
          ? 'bg-blue-500'
          : darkMode
            ? 'bg-slate-700'
            : 'bg-slate-300'
        }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-[calc(100%-20px)]' : 'left-1'
          }`}
      />
    </button>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Account Settings
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your profile and preferences
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl p-8 border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <User size={24} />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Profile Information
            </h2>
          </div>
          {!editMode && (
            <Button
              variant="outline"
              onClick={() => setEditMode(true)}
              className="h-10"
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-blue-500/20">
                {userInitials}
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {formData.fullName || 'User'}
                </h3>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {formData.email}
                </p>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  Active Account
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <User size={14} /> Full Name
                </label>
                <p className={`text-lg font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {formData.fullName || 'Not set'}
                </p>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Mail size={14} /> Email Address
                </label>
                <p className={`text-lg font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {formData.email}
                </p>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Phone size={14} /> Phone Number
                </label>
                <p className={`text-lg font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {formData.phone || 'Not set'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className={`flex items-center gap-2 text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <FileText size={14} /> Bio
                </label>
                <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {formData.bio || 'No bio added yet.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl">
                  {userInitials}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Recommended: Square JPG, PNG
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none opacity-60 cursor-not-allowed ${darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Bio
                </label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={200}
                    rows={4}
                    placeholder="Tell us a little about yourself..."
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none resize-none transition-all ${darkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                  />
                  <p className={`text-xs mt-1 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {charCount}/200 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-3xl p-8 border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
            <Bell size={24} />
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Email Notifications
            </h3>

            <div className="space-y-1">
              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Product Updates
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Get notified about new updates and features
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.productUpdates}
                  onChange={() => handleToggle('productUpdates')}
                />
              </div>

              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Order Notifications
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Receive order confirmations and invoices
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.orderNotifications}
                  onChange={() => handleToggle('orderNotifications')}
                />
              </div>

              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Marketing Emails
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Promotional offers, newsletters, and news
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                />
              </div>

              <div className={`flex items-center justify-between py-4`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Support Replies
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Get notified when support team responds to your tickets
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.supportReplies}
                  onChange={() => handleToggle('supportReplies')}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              System Notifications
            </h3>

            <div className="space-y-1">
              <div className={`flex items-center justify-between py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Browser Notifications
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Show desktop notifications when you're online
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.browserNotifications}
                  onChange={() => handleToggle('browserNotifications')}
                />
              </div>

              <div className={`flex items-center justify-between py-4`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Sound Effects
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Play sound for new notifications
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
      </motion.div>
    </div>
  );
}
