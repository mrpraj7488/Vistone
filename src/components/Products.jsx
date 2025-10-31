const products = [
  {
    name: 'StoreKing',
    tagline: 'Complete eCommerce Solution',
    description: 'Multi-vendor marketplace platform',
    color: '#10B981',
    icon: '🛒',
  },
  {
    name: 'Shopperzz',
    tagline: 'Online Shopping Made Easy',
    description: 'Single vendor eCommerce system',
    color: '#F97316',
    icon: '🛍️',
  },
  {
    name: 'FoodAppi',
    tagline: 'Food Delivery Solution',
    description: 'Complete restaurant management',
    color: '#EF4444',
    icon: '🍔',
  },
  {
    name: 'PosKing',
    tagline: 'Point of Sale System',
    description: 'Modern POS for retail business',
    color: '#8B5CF6',
    icon: '💳',
  },
  {
    name: 'ShopKing',
    tagline: 'Retail Management',
    description: 'Inventory and sales management',
    color: '#3B82F6',
    icon: '🏪',
  },
  {
    name: 'FoodScan',
    tagline: 'QR Menu Solution',
    description: 'Contactless ordering system',
    color: '#EC4899',
    icon: '📱',
  },
];

export default function Products({ darkMode }) {
  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Software Solutions
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Powerful, scalable solutions designed to transform your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:scale-103 group ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                style={{ backgroundColor: product.color + '30' }}
              >
                {product.icon}
              </div>

              <h3 className={`text-2xl font-bold text-center mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {product.name}
              </h3>

              <p className={`text-center font-semibold mb-3 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {product.tagline}
              </p>

              <p className={`text-center mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {product.description}
              </p>

              <div className={`flex items-center justify-center gap-2 font-semibold transition-all group-hover:gap-4 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                Learn More <span>→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-5 rounded-xl font-bold text-lg btn-gradient animate-shine shadow-2xl">
            Browse All Products →
          </button>
        </div>
      </div>
    </section>
  );
}
