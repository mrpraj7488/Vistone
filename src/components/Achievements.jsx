const clientLogos = [
  'Envato',
  'CodeCanyon',
  'ThemeForest',
  'GraphicRiver',
  'VideoHive',
  'AudioJungle',
  'PhotoDune',
  '3DOcean',
];

export default function Achievements({ darkMode }) {
  return (
    <section className={`py-16 px-4 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-white lg:w-1/4">
            <h2 className="text-3xl md:text-4xl font-black mb-2">Our Remarkable</h2>
            <h2 className="text-3xl md:text-4xl font-black">Achievements</h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 lg:w-1/2">
            {clientLogos.map((logo, idx) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"
              >
                <span className="text-white text-sm font-bold text-center px-2">
                  {logo}
                </span>
              </div>
            ))}
          </div>

          <div className="lg:w-1/4 flex flex-col items-center lg:items-end gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              View Portfolio
            </button>
            <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
              <span className="text-white font-bold">envato market</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
