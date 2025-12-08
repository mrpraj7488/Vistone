import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';

export default function Contact({ darkMode }) {
  const showToast = useUIStore((state) => state.showToast);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    orderNumber: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast('Message sent successfully! We will get back to you soon.', 'success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'general',
        orderNumber: '',
        message: '',
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@vistone.com',
      subtext: 'We reply within 24 hours',
      action: 'mailto:support@vistone.com',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      subtext: 'Mon-Fri from 9am to 6pm EST',
      action: 'tel:+15551234567',
      color: 'emerald'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      content: 'Start a conversation',
      subtext: 'Available 24/7 for urgent issues',
      action: '#chat',
      color: 'purple'
    }
  ];

  return (
    <div className={`min-h-screen pt-20 pb-20 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              Contact Support
            </span>
            <h1 className={`text-5xl md:text-6xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Touch</span>
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Have a question or need assistance? We're here to help! Choose the best way to reach us below.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, idx) => (
            <motion.a
              key={idx}
              href={info.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
            >
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 ${info.color === 'blue' ? (darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                  info.color === 'emerald' ? (darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                    (darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600')
                }`}>
                <info.icon size={28} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {info.title}
              </h3>
              <p className={`font-medium mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {info.content}
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {info.subtext}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`lg:col-span-8 p-8 md:p-10 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Send size={24} />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Send us a Message
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all cursor-pointer ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${darkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    placeholder="#ORD-123456"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${darkMode
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                  placeholder="How can we help you today?"
                ></textarea>
                <p className={`text-xs mt-2 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formData.message.length} / 20 characters minimum
                </p>
              </div>

              <Button type="submit" loading={loading} className="w-full h-14 text-lg">
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Map Placeholder */}
            <div className={`rounded-3xl overflow-hidden h-64 relative ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className={`mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>New York, USA</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Global Headquarters</p>
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Office Location
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <MapPin className={`shrink-0 mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>Vistone HQ</p>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      123 Business Avenue, Suite 400<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className={`shrink-0 mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>Business Hours</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Mon - Fri: 9:00 AM - 6:00 PM EST<br />
                      Weekend: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white'}`}>
                    <Twitter size={18} />
                  </a>
                  <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white'}`}>
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
