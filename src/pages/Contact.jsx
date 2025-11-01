import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/useStore';
import Button from '../components/ui/Button';

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

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Contact</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 text-gradient">Get In Touch</h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We'd love to hear from you
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            We typically respond within 24 hours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Send Us a Message
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="mb-6">
                <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="mb-6">
                <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                >
                  <option value="general">General Inquiry</option>
                  <option value="sales">Sales</option>
                  <option value="support">Technical Support</option>
                  <option value="technical">Technical Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="#ORD-123456"
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="mb-6">
                <label className={`block mb-2 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Message * (min 20 characters)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all resize-y ${darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'}`}
                ></textarea>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formData.message.length} / 20 characters minimum
                </p>
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          <div>
            <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="text-3xl mb-2">📧</div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email</h4>
                  <a href="mailto:support@vistone.com" className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}>
                    support@vistone.com
                  </a>
                </div>

                <div>
                  <div className="text-3xl mb-2">📞</div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>+1 (555) 123-4567</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mon-Fri: 9AM - 6PM EST</p>
                </div>

                <div>
                  <div className="text-3xl mb-2">💬</div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Live Chat</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Available 24/7</p>
                  <button className="mt-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
                    Start Chat
                  </button>
                </div>

                <div>
                  <div className="text-3xl mb-2">📍</div>
                  <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Office Address</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    123 Business Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>

                <div>
                  <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Follow Us</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110">
                      f
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110">
                      t
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110">
                      in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
