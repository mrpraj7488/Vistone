export default function EliteAuthor({ darkMode }) {
  return (
    <section className={`py-16 px-4 ${
      darkMode
        ? 'bg-gradient-to-r from-teal-900 to-teal-800'
        : 'bg-gradient-to-r from-teal-600 to-teal-700'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-5xl shadow-2xl animate-float">
              ⭐
            </div>
            <div>
              <h3 className="text-3xl font-black mb-3">
                Elite Author in CodeCanyon
              </h3>
              <p className="text-teal-100 text-lg">
                10+ Years | 900+ Businesses | Premium Quality Products
              </p>
            </div>
          </div>

          <button className="bg-white text-teal-700 px-10 py-5 rounded-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 hover:-translate-y-1">
            View Portfolio →
          </button>
        </div>
      </div>
    </section>
  );
}
