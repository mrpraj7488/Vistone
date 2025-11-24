import { useState, useEffect } from 'react';
import { Send, Upload, X, MessageSquare, FileText, Phone, Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

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
      icon: <FileText className="w-12 h-12" />,
      title: 'Docs',
      description: 'Browse our documentation',
      action: 'View Docs',
      link: '/docs',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      icon: <Mail className="w-12 h-12" />,
      title: 'Email',
      description: 'Send us an email',
      action: 'Email Us',
      link: 'mailto:support@vistone.com',
      gradient: 'from-green-500 to-green-700',
    },
  ];

  const statusColors = {
    open: 'bg-green-500',
    progress: 'bg-yellow-500',
    closed: 'bg-gray-500',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Support
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get help when you need it
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickHelpCards.map((card, index) => (
          <a
            key={index}
            href={card.link || '#'}
            className={`rounded-2xl p-8 border text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
              {card.icon}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {card.title}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.description}
            </p>
            <button
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                darkMode
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {card.action}
            </button>
          </a>
        ))}
      </div>

      <div
        className={`rounded-2xl p-8 border ${
          darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Submit a Support Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                darkMode
                  ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
              }`}
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
                }`}
              >
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Priority
              </label>
              <div className="flex gap-6 items-center h-[50px]">
                {['low', 'medium', 'high'].map((priority) => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.priority === priority
                          ? 'border-cyan-500 bg-cyan-500'
                          : darkMode
                          ? 'border-gray-600 group-hover:border-cyan-500'
                          : 'border-gray-300 group-hover:border-cyan-500'
                      }`}
                    >
                      {formData.priority === priority && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`capitalize text-sm ${
                        formData.priority === priority
                          ? darkMode
                            ? 'text-cyan-400 font-bold'
                            : 'text-cyan-600 font-bold'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Description * (min 20 characters)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={500}
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none resize-none transition-all ${
                darkMode
                  ? 'bg-gray-800 border-white/10 text-white focus:border-cyan-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-cyan-500'
              }`}
              placeholder="Please describe your issue in detail..."
            />
            <p className={`text-sm mt-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {charCount}/500 characters {charCount < 20 && `(${20 - charCount} more required)`}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Attachments (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                darkMode
                  ? 'border-white/10 hover:border-cyan-500 hover:bg-white/5'
                  : 'border-gray-300 hover:border-cyan-500 hover:bg-cyan-50'
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
                className="cursor-pointer"
              >
                <Paperclip className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Choose files or drag & drop
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Max 3 files, 10MB each (Images, PDFs, Documents)
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-cyan-500" />
                      <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {file.name}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || charCount < 20}
            className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>

      <div
        className={`rounded-2xl p-8 border ${
          darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Support Tickets
          </h2>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
              Open: 2
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'}`}>
              Closed: 5
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-6 rounded-xl border-l-4 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                ticket.status === 'open'
                  ? 'border-green-500'
                  : ticket.status === 'progress'
                  ? 'border-yellow-500'
                  : 'border-gray-500'
              } ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ticket.status === 'open'
                        ? 'bg-green-500'
                        : ticket.status === 'progress'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    #{ticket.id} - {ticket.title}
                  </h3>
                </div>
              </div>
              <div className={`flex items-center gap-4 text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>
                  Status:{' '}
                  <span className="capitalize font-medium">
                    {ticket.status === 'progress' ? 'In Progress' : ticket.status}
                  </span>
                </span>
                <span>|</span>
                <span>
                  Priority: <span className="capitalize font-medium">{ticket.priority}</span>
                </span>
              </div>
              <div className={`flex items-center justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="text-sm">Last updated: {ticket.updated}</span>
                <button className="text-cyan-500 hover:text-cyan-600 font-bold text-sm flex items-center gap-1 group">
                  View Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`w-full mt-6 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:scale-105 ${
            darkMode
              ? 'border-white/10 text-gray-300 hover:bg-white/5'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Load More
        </button>
      </div>

      <div
        className={`rounded-2xl p-8 border text-center ${
          darkMode ? 'bg-[#1A2C4A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Need More Help?
        </h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Our support team is available 24/7 to assist you
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div
            className={`px-6 py-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold mb-1">Email</div>
            <a href="mailto:support@vistone.com" className="text-cyan-500 hover:underline">
              support@vistone.com
            </a>
          </div>
          <div
            className={`px-6 py-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold mb-1">Phone</div>
            <a href="tel:+15551234567" className="text-cyan-500 hover:underline">
              +1 (555) 123-4567
            </a>
          </div>
          <div
            className={`px-6 py-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <div className="text-sm font-bold mb-1">Hours</div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
