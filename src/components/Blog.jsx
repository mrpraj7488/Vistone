const blogPosts = [
  {
    title: 'Smiles All Around: Eid Bonus Brings Joy to Team',
    date: '04 Jun, 2025',
    image: '🎉',
    category: 'Company News',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Celebrating a Decade of Innovation and Excellence',
    date: '15 May, 2025',
    image: '🎊',
    category: 'Milestone',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    title: 'New Product Launch: Revolutionary POS System',
    date: '28 Apr, 2025',
    image: '🚀',
    category: 'Product',
    gradient: 'from-cyan-500 to-blue-600'
  },
];

export default function Blog({ darkMode }) {
  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Latest From the Blog
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay updated with our latest news and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, idx) => (
            <div
              key={idx}
              className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-xl group cursor-pointer ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}
            >
              <div className={`h-56 bg-gradient-to-br ${post.gradient} flex items-center justify-center text-8xl group-hover:scale-110 transition-all duration-500 overflow-hidden`}>
                {post.image}
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-bold ${
                    darkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {post.date}
                  </span>
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.category}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-6 leading-snug ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.title}
                </h3>
                <div className={`flex items-center gap-2 font-bold transition-all group-hover:gap-4 ${
                  darkMode ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  Read More <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-5 rounded-xl font-bold text-lg btn-gradient animate-shine shadow-2xl">
            View All Posts →
          </button>
        </div>
      </div>
    </section>
  );
}
