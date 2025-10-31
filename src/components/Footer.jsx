const footerLinks = {
  Products: ['StoreKing', 'Shopperzz', 'FoodAppi', 'PosKing', 'ShopKing', 'FoodScan'],
  Services: ['Web Development', 'App Development', 'Installation', 'Customization'],
  Company: ['About Us', 'Blog', 'Careers', 'Contact', 'Privacy', 'Terms'],
};

export default function Footer({ darkMode }) {
  return (
    <footer className={`pt-20 pb-8 px-4 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-white'
        : 'bg-gradient-to-b from-gray-900 to-gray-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl glow-cyan">
                V
              </div>
              <h2 className="text-3xl font-black">VISTONE</h2>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              The infinite innovation accelerator. Creating premium SaaS solutions that empower businesses worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold">
                𝕏
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold">
                in
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold">
                ▶
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold">
                ⚲
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-black mb-6 text-xl">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-base">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400">
              © 2025 Vistone Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-gray-400">Secure Payment:</span>
              <div className="flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg font-bold hover:bg-cyan-500 transition-all cursor-pointer">
                  💳 Stripe
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg font-bold hover:bg-cyan-500 transition-all cursor-pointer">
                  ⚡ Supabase
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
