import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Services({ darkMode }) {
  const services = [
    {
      icon: '⚙️',
      title: 'Installation Service',
      price: '$99',
      description: 'Professional installation and setup of your software',
      features: [
        'Complete software installation',
        'Server configuration',
        'Database setup',
        'Performance optimization',
        'SSL certificate setup',
        'Initial backup configuration',
      ],
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: '🎨',
      title: 'Customization Service',
      price: '$199',
      description: 'Tailored modifications to match your brand',
      features: [
        'Custom design implementation',
        'Brand color integration',
        'Logo and graphics setup',
        'Custom features development',
        'UI/UX modifications',
        'Responsive design adjustments',
      ],
      color: 'from-purple-500 to-purple-700',
    },
    {
      icon: '🛠️',
      title: 'Premium Support',
      price: '$49/mo',
      description: 'Priority support with dedicated assistance',
      features: [
        '24/7 priority support',
        'Direct access to developers',
        'Live chat support',
        'Phone support',
        'Email support within 2 hours',
        'Monthly consultation calls',
      ],
      color: 'from-green-500 to-green-700',
    },
  ];

  const process = [
    { step: '1', title: 'Select Service', description: 'Choose the service package that fits your needs' },
    { step: '2', title: 'Book Consultation', description: 'Schedule a call with our team to discuss requirements' },
    { step: '3', title: 'Get Quote', description: 'Receive a detailed quote and timeline for your project' },
    { step: '4', title: 'Start Project', description: 'Our team begins work on your customization or installation' },
  ];

  const faqs = [
    {
      question: 'How long does installation take?',
      answer: 'Most installations are completed within 24-48 hours, depending on complexity and server configuration.',
    },
    {
      question: 'Can I request custom features?',
      answer: 'Yes! Our customization service includes custom feature development based on your specific requirements.',
    },
    {
      question: 'What is included in premium support?',
      answer: 'Premium support includes priority email, chat, and phone support with guaranteed response times and direct access to our development team.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all our services if you are not satisfied.',
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Services</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 text-gradient">Professional Services</h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Expert installation, customization, and support services to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className={`h-32 bg-gradient-to-br ${service.color} flex items-center justify-center text-6xl`}>
                {service.icon}
              </div>
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                <div className={`text-3xl font-black mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {service.price}
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item, idx) => (
              <div key={idx} className={`rounded-2xl p-6 text-center ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white">
                  {item.step}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: '⚡', title: 'Fast Turnaround', description: 'Most projects completed within 48 hours' },
              { icon: '🎯', title: 'Expert Team', description: '10+ years of combined experience' },
              { icon: '💯', title: 'Quality Guarantee', description: '100% satisfaction or money back' },
              { icon: '🔒', title: 'Secure Process', description: 'Your data is always safe with us' },
            ].map((benefit, idx) => (
              <div key={idx} className={`flex gap-6 p-6 rounded-2xl ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="text-5xl">{benefit.icon}</div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h3>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`rounded-2xl p-6 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-2xl p-12 text-center ${
            darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'
          }`}
        >
          <h2 className="text-4xl font-black text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our expert team help you with installation, customization, or ongoing support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
