import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, CheckCircle, AlertCircle, Shield, CreditCard, RefreshCw, Scale, Users, HelpCircle, ArrowLeft } from 'lucide-react';

export default function Terms({ darkMode }) {
  const lastUpdated = 'January 1, 2025';

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Vistone services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      id: 'license',
      icon: FileText,
      title: '2. Use License',
      content: 'Permission is granted to temporarily download one copy of the materials (software or services) on Vistone\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
    },
    {
      id: 'usage',
      icon: Shield,
      title: '3. Product Usage',
      content: 'Our products are provided under specific license agreements. Single-site licenses permit use on one domain or subdomain. Multi-site licenses allow unlimited domains. You may not redistribute, resell, or share license keys.'
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: '4. Payment Terms',
      content: 'All payments are processed securely through our payment partners. Monthly subscriptions are billed in advance. Annual subscriptions provide a discount and are billed once per year. Prices are subject to change with notice.'
    },
    {
      id: 'refund',
      icon: RefreshCw,
      title: '5. Refund Policy',
      content: 'We offer a 30-day money-back guarantee on all products. If you are not satisfied with your purchase, contact our support team within 30 days for a full refund. See our Refund Policy for details.'
    },
    {
      id: 'intellectual',
      icon: Scale,
      title: '6. Intellectual Property',
      content: 'All content, features, and functionality are owned by Vistone and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
    },
    {
      id: 'conduct',
      icon: Users,
      title: '7. User Conduct',
      content: 'You agree not to use our services for any unlawful purpose, to spam, distribute malware, attempt unauthorized access, or engage in any activity that interferes with or disrupts the services.'
    },
    {
      id: 'liability',
      icon: AlertCircle,
      title: '8. Limitation of Liability',
      content: 'Vistone shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
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
              <FileText size={32} />
            </div>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Terms & Conditions
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
                  Need Clarification?
                </h4>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  If you have any questions about our terms, please contact us.
                </p>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <HelpCircle size={16} /> Contact Legal Team
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
                  Welcome to Vistone. These Terms and Conditions govern your use of our website and services.
                  Please read these terms carefully before using our services. By accessing or using any part of the site,
                  you agree to be bound by these Terms of Service.
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

                <div className={`mt-12 p-6 rounded-2xl border-l-4 ${darkMode ? 'bg-amber-500/10 border-amber-500' : 'bg-amber-50 border-amber-500'}`}>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Important Notice
                  </h3>
                  <p className={`m-0 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    We reserve the right to modify these terms at any time. We will notify users of any material changes.
                    Continued use of services after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
