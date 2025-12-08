import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, Globe, Server, Cookie, Scale, Mail, ArrowLeft } from 'lucide-react';

export default function Privacy({ darkMode }) {
  const lastUpdated = 'January 1, 2025';

  const sections = [
    {
      id: 'collection',
      icon: FileText,
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including name, email address, payment information, and account credentials. We automatically collect device information, IP addresses, browser types, and usage data through cookies and similar technologies.'
    },
    {
      id: 'usage',
      icon: Eye,
      title: '2. How We Use Your Information',
      content: 'We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and updates, respond to your requests, and protect against fraudulent or illegal activity.'
    },
    {
      id: 'sharing',
      icon: Globe,
      title: '3. Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who perform services on our behalf, when required by law, or to protect our rights and safety.'
    },
    {
      id: 'security',
      icon: Lock,
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: '5. Cookies & Tracking',
      content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.'
    },
    {
      id: 'rights',
      icon: Scale,
      title: '6. Your Rights (GDPR)',
      content: 'Under GDPR, you have the right to access, rectify, erase, restrict processing, object to processing, and data portability. You may also withdraw consent at any time. Contact us to exercise these rights.'
    },
    {
      id: 'retention',
      icon: Server,
      title: '7. Data Retention',
      content: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and associated data at any time.'
    },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-20 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`relative py-16 mb-12 border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Shield size={32} />
            </div>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Privacy Policy
            </h1>
            <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-12">
          <Link
            to="/"
            className={`flex items-center gap-1 transition-colors ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32">
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block text-sm py-1 transition-colors ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className={`mt-8 p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Have questions?
                </h4>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Our support team is here to help with any privacy concerns.
                </p>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <Mail size={16} /> Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`rounded-3xl p-8 md:p-12 border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                <p className={`text-lg leading-relaxed mb-12 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  At Vistone, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our services. By using our service,
                  you agree to the collection and use of information in accordance with this policy.
                </p>

                <div className="space-y-12">
                  {sections.map((section, idx) => (
                    <div key={section.id} id={section.id} className="scroll-mt-32">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          <section.icon size={24} />
                        </div>
                        <h2 className={`text-2xl font-bold m-0 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {section.title}
                        </h2>
                      </div>
                      <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`mt-12 p-6 rounded-2xl border-l-4 ${darkMode ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-500'}`}>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Your Privacy Rights
                  </h3>
                  <ul className={`space-y-2 m-0 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Right to Access
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Right to Rectification
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Right to Erasure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Right to Data Portability
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
