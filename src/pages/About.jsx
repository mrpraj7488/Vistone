import { Link } from 'react-router-dom';

export default function About({ darkMode }) {
  const team = [
    { name: 'John Smith', role: 'CEO & Founder', avatar: '👨' },
    { name: 'Sarah Johnson', role: 'CTO', avatar: '👩' },
    { name: 'Michael Chen', role: 'Lead Developer', avatar: '👨' },
    { name: 'Emily Davis', role: 'Product Manager', avatar: '👩' },
  ];

  const values = [
    { icon: '🚀', title: 'Innovation', description: 'Constantly pushing boundaries with cutting-edge technology' },
    { icon: '✨', title: 'Quality', description: 'Delivering excellence in every product we create' },
    { icon: '🤝', title: 'Support', description: '24/7 dedicated support for all our customers' },
    { icon: '🎯', title: 'Results', description: 'Focused on delivering measurable business outcomes' },
  ];

  const stats = [
    { value: '10+', label: 'Years in Business' },
    { value: '9000+', label: 'Happy Customers' },
    { value: '30+', label: 'Products' },
    { value: '80+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>About</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 text-gradient">About Vistone</h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The infinite innovation accelerator. We are the makers of premium SaaS tools,
            empowering thousands of businesses worldwide since 2015.
          </p>
        </div>

        <div className={`rounded-2xl p-12 mb-16 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Story
              </h2>
              <div className={`space-y-4 text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  Founded in 2015, Vistone started with a simple mission: to create powerful,
                  intuitive software that helps businesses thrive in the digital age.
                </p>
                <p>
                  What began as a small team of passionate developers has grown into a
                  global company serving over 9,000 customers in 80+ countries.
                </p>
                <p>
                  Today, we continue to innovate and push boundaries, delivering world-class
                  SaaS solutions that drive real business results.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-4xl font-black text-gradient mb-2">{stat.value}</div>
                  <div className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Mission
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To empower businesses with innovative software solutions that drive growth,
                efficiency, and success in the digital economy.
              </p>
            </div>
            <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <div className="text-5xl mb-4">👁️</div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Vision
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To become the world's leading provider of SaaS solutions, known for quality,
                innovation, and exceptional customer service.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className={`rounded-2xl p-6 text-center transition-all hover:-translate-y-2 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {value.title}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-black text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className={`rounded-2xl p-6 text-center transition-all hover:-translate-y-2 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-5xl mb-4">
                  {member.avatar}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {member.name}
                </h3>
                <p className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}>
          <h2 className="text-4xl font-black text-white mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of something amazing. Explore our products and see how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-4 rounded-xl font-bold bg-white text-blue-600 hover:bg-gray-100 transition-colors">
              View Products
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-xl font-bold border-2 border-white text-white hover:bg-white/20 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
