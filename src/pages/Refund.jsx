import { Link } from 'react-router-dom';

export default function Refund({ darkMode }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Refund Policy</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-gradient">Refund Policy</h1>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-bold text-lg mt-4">
            <span>✓</span> 30-Day Money-Back Guarantee
          </div>
        </div>

        <div className={`rounded-2xl p-8 mb-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className={`p-6 rounded-xl mb-8 ${darkMode ? 'bg-cyan-500/10 border-2 border-cyan-500/30' : 'bg-cyan-50 border-2 border-cyan-500'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Our Promise to You
            </h2>
            <div className="space-y-3 text-lg">
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>No Questions Asked</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>Quick Processing (3-5 business days)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>Full Refund to Original Payment Method</span>
              </div>
            </div>
          </div>

          <div className={`text-lg leading-relaxed space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Refund Eligibility
              </h2>
              <p className="mb-4">You are eligible for a full refund if:</p>
              <ul className="space-y-2 ml-6">
                <li>• You request a refund within 30 days of purchase</li>
                <li>• The product does not work as advertised</li>
                <li>• You are not satisfied with the product for any reason</li>
                <li>• Technical issues prevent you from using the product</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Refund Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-3xl mb-2">📧</div>
                  <div className="font-bold mb-1">Step 1</div>
                  <div className="text-sm">Contact Support</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day 1</div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="font-bold mb-1">Step 2</div>
                  <div className="text-sm">Review Request</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day 1-2</div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-bold mb-1">Step 3</div>
                  <div className="text-sm">Approved</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day 2-3</div>
                </div>
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-bold mb-1">Step 4</div>
                  <div className="text-sm">Refunded</div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day 3-5</div>
                </div>
              </div>
              <p>
                To request a refund, simply contact our support team at support@vistone.com with your
                order number and reason for refund. We will process your request within 3-5 business days.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What Qualifies for Refund
              </h2>
              <ul className="space-y-2 ml-6">
                <li>✓ Product does not match description</li>
                <li>✓ Technical issues we cannot resolve</li>
                <li>✓ Product not compatible with your system</li>
                <li>✓ Any dissatisfaction within 30 days</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Refund Method
              </h2>
              <p>
                All refunds are processed back to your original payment method. If you paid by credit card,
                the refund will appear on your statement within 5-10 business days. PayPal refunds are
                typically processed within 1-3 business days.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Exceptions
              </h2>
              <p className="mb-2">
                While we strive to accommodate all refund requests, the following situations may not qualify:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Requests made after 30 days of purchase</li>
                <li>• Products that have been significantly modified</li>
                <li>• Violation of our terms of service</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-8 mb-8 text-center ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}>
          <h2 className="text-3xl font-black text-white mb-4">
            Need to Request a Refund?
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Contact our support team and we will process your request quickly
          </p>
          <Link to="/contact" className="inline-block px-8 py-4 rounded-xl font-bold bg-white text-blue-600 hover:bg-gray-100 transition-colors">
            Contact Support
          </Link>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/terms" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-105 transition-all`}>
            Terms & Conditions
          </Link>
          <Link to="/privacy" className={`px-6 py-3 rounded-xl font-bold ${darkMode ? 'glass-dark' : 'glass-light'} hover:scale-105 transition-all`}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
