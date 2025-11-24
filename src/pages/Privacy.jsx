import { Link } from 'react-router-dom';

export default function Privacy({ darkMode }) {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including name, email address, payment information, and account credentials. We automatically collect device information, IP addresses, browser types, and usage data through cookies and similar technologies.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and updates, respond to your requests, and protect against fraudulent or illegal activity.'
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who perform services on our behalf, when required by law, or to protect our rights and safety.'
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      title: '5. Cookies & Tracking',
      content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.'
    },
    {
      title: '6. Your Rights (GDPR)',
      content: 'Under GDPR, you have the right to access, rectify, erase, restrict processing, object to processing, and data portability. You may also withdraw consent at any time. Contact us to exercise these rights.'
    },
    {
      title: '7. Data Retention',
      content: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and associated data at any time.'
    },
    {
      title: '8. Children\'s Privacy',
      content: 'Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we discover we have collected information from a child, we will delete it immediately.'
    },
    {
      title: '9. International Transfers',
      content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during international transfers.'
    },
    {
      title: '10. Updates to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.'
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Privacy Policy</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">Privacy Policy</h1>
          <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: January 1, 2025
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500">
            <span className="text-green-500 font-bold">✓ GDPR Compliant</span>
          </div>
        </div>

        <div className={`rounded-2xl p-8 mb-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="mb-6">
              At Vistone, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our services.
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

            <div className={`mt-12 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Privacy Rights
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Right to Access</strong> - Request copies of your personal data</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Right to Rectification</strong> - Request correction of inaccurate data</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Right to Erasure</strong> - Request deletion of your data</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Right to Data Portability</strong> - Receive your data in a portable format</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/terms" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-105 transition-all`}>
            Terms & Conditions
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
