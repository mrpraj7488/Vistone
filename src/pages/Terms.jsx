import { Link } from 'react-router-dom';

export default function Terms({ darkMode }) {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Vistone services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily download one copy of the materials (software or services) on Vistone\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
    },
    {
      title: '3. Product Usage',
      content: 'Our products are provided under specific license agreements. Single-site licenses permit use on one domain or subdomain. Multi-site licenses allow unlimited domains. You may not redistribute, resell, or share license keys.'
    },
    {
      title: '4. Payment Terms',
      content: 'All payments are processed securely through our payment partners. Monthly subscriptions are billed in advance. Annual subscriptions provide a discount and are billed once per year. Prices are subject to change with notice.'
    },
    {
      title: '5. Refund Policy',
      content: 'We offer a 30-day money-back guarantee on all products. If you are not satisfied with your purchase, contact our support team within 30 days for a full refund. See our Refund Policy for details.'
    },
    {
      title: '6. Intellectual Property',
      content: 'All content, features, and functionality are owned by Vistone and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
    },
    {
      title: '7. User Conduct',
      content: 'You agree not to use our services for any unlawful purpose, to spam, distribute malware, attempt unauthorized access, or engage in any activity that interferes with or disrupts the services.'
    },
    {
      title: '8. Limitation of Liability',
      content: 'Vistone shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
    },
    {
      title: '9. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of services after changes constitutes acceptance of the new terms.'
    },
    {
      title: '10. Contact Information',
      content: 'For questions about these Terms, please contact us at legal@vistone.com or through our contact page.'
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Terms & Conditions</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">Terms & Conditions</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: January 1, 2025
          </p>
        </div>

        <div className={`rounded-2xl p-8 mb-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="mb-6">
              Welcome to Vistone. These Terms and Conditions govern your use of our website and services.
              Please read these terms carefully before using our services.
            </p>

            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                  <p className="leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            <div className={`mt-12 p-6 rounded-xl border-2 ${darkMode ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-cyan-500 bg-cyan-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Important Notice
              </h3>
              <p>
                By accessing our website and using our services, you agree to be bound by these terms and conditions.
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/privacy" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-105 transition-all`}>
            Privacy Policy
          </Link>
          <Link to="/refund" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-105 transition-all`}>
            Refund Policy
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-xl font-bold btn-gradient hover:scale-105 transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
