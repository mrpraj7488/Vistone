const glanceData = [
  { value: '20+', label: 'Team Members', color: 'from-orange-500 to-orange-600', icon: '👥' },
  { value: '30+', label: 'Amazing Products', color: 'from-purple-500 to-purple-600', icon: '🚀' },
  { value: '9K+', label: 'Happy Clients', color: 'from-green-500 to-green-600', icon: '😊' },
  { value: '80+', label: 'Countries Served', color: 'from-blue-500 to-blue-600', icon: '🌎' },
];

export default function CompanyGlance({ darkMode }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Vistone At A Glance
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Numbers that speak for our excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {glanceData.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:rotate-2 bg-gradient-to-br ${item.color} cursor-pointer`}
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-6 animate-float">{item.icon}</div>
                <div className="text-5xl font-black mb-3">{item.value}</div>
                <div className="text-xl font-bold opacity-95">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
