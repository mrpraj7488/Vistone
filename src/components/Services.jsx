const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies',
    icon: '💻',
    color: 'from-purple-500 to-purple-700',
    iconBg: 'bg-purple-500'
  },
  {
    title: 'App Development',
    description: 'Native and cross-platform mobile applications',
    icon: '📱',
    color: 'from-blue-500 to-blue-700',
    iconBg: 'bg-blue-500'
  },
  {
    title: 'Installation',
    description: 'Professional setup and deployment services',
    icon: '⚙️',
    color: 'from-orange-500 to-orange-700',
    iconBg: 'bg-orange-500'
  },
  {
    title: 'Customization',
    description: 'Tailored solutions to meet your unique needs',
    icon: '🎨',
    color: 'from-green-500 to-green-700',
    iconBg: 'bg-green-500'
  }
];

export default function Services({ darkMode }) {
  return (
    <section id="services" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full glow-cyan"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl group ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl ${service.iconBg} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                {service.icon}
              </div>

              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {service.title}
              </h3>

              <p className={`text-base leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.description}
              </p>

              <div className={`mt-6 inline-block font-semibold transition-all group-hover:translate-x-2 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                Learn More →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
