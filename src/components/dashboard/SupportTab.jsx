import { useState, useEffect } from 'react';
import { Send, Upload, X, MessageSquare, FileText, Phone, Mail, Clock, AlertCircle, CheckCircle, Paperclip, HelpCircle, MessageCircle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../ui/Button';

export default function SupportTab({ darkMode }) {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const { user } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  // Fetch real tickets from database
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // Handle case where table doesn't exist
          if (error.code === '42P01') {
            console.warn('Support tickets table does not exist. Using mock data.');
            setTickets([]);
            return;
          }
          throw error;
        }

        if (data) {
          setTickets(data.map(ticket => ({
            id: ticket.ticket_number || ticket.id,
            title: ticket.subject,
            status: ticket.status === 'in_progress' ? 'progress' : ticket.status,
            priority: ticket.priority,
            updated: new Date(ticket.updated_at).toLocaleString()
          })));
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') {
      setCharCount(value.length);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3 - files.length);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      showToast('Description must be at least 20 characters', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Support request submitted successfully!', 'success');
      setFormData({
        subject: '',
        category: 'technical',
        priority: 'medium',
        description: '',
      });
      setFiles([]);
      setCharCount(0);
    }, 2000);
  };

  const quickHelpCards = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Documentation',
      description: 'Browse our detailed guides and API docs',
      action: 'View Docs',
      link: '/docs',
      color: 'blue',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      color: 'purple',
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Get help via email for complex issues',
      action: 'Email Us',
      link: 'mailto:support@vistone.com',
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Support Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We're here to help you succeed
          </p>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickHelpCards.map((card, index) => (
          <motion.a
            key={index}
            href={card.link || '#'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-3xl p-6 border transition-all hover:shadow-lg ${darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-white border-slate-200 shadow-sm'
              }`}
          >
            <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.color === 'blue' ? (darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600') :
                card.color === 'purple' ? (darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600') :
                  (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
              }`}>
              {card.icon}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {card.title}
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {card.description}
            </p>
            <span className={`inline-flex items-center text-sm font-bold ${card.color === 'blue' ? 'text-blue-500' :
                card.color === 'purple' ? 'text-purple-500' :
                  'text-emerald-500'
              }`}>
              {card.action} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 rounded-3xl p-8 border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Send size={24} />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Submit a Request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                  }`}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none appearance-none transition-all cursor-pointer ${darkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="account">Account Management</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                  <HelpCircle className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Priority
                </label>
                <div className={`flex p-1 rounded-xl border-2 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${formData.priority === priority
                          ? priority === 'high'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                            : priority === 'medium'
                              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                              : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : darkMode
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={20}
                  maxLength={500}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none resize-none transition-all ${darkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                  placeholder="Please describe your issue in detail..."
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {charCount}/500
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Attachments
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${darkMode
                    ? 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/50'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={files.length >= 3}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    <Upload size={24} />
                  </div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Max 3 files (Images, PDF, Doc)
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip size={16} className="text-blue-500" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {file.name}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting || charCount < 20}
              className="w-full justify-center h-12 text-base"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}
          >
            <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Your Recent Tickets
            </h3>
            <div className="space-y-3">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded-xl border-l-4 transition-all hover:translate-x-1 cursor-pointer ${ticket.status === 'open'
                        ? 'border-emerald-500'
                        : ticket.status === 'progress'
                          ? 'border-amber-500'
                          : 'border-slate-500'
                      } ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-mono opacity-70 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        #{ticket.id}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ticket.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : ticket.status === 'progress'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-slate-500/10 text-slate-500'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className={`font-medium text-sm mb-2 line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {ticket.title}
                    </h4>
                    <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Updated {ticket.updated}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent tickets</p>
                </div>
              )}
            </div>
            {tickets.length > 0 && (
              <Button variant="outline" className="w-full mt-4 text-sm">
                View All Tickets
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-3xl p-6 border text-center ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}
          >
            <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Contact Info
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Direct channels for urgent matters
            </p>

            <div className="space-y-4">
              <div className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                  <Mail size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Email</p>
                  <a href="mailto:support@vistone.com" className={`text-sm font-medium hover:underline ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    support@vistone.com
                  </a>
                </div>
              </div>

              <div className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-purple-400' : 'bg-white text-purple-600 shadow-sm'}`}>
                  <Phone size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Phone</p>
                  <a href="tel:+15551234567" className={`text-sm font-medium hover:underline ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}>
                  <Clock size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hours</p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    24/7 Support
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
