import { Link } from 'react-router-dom';
import { Container } from './Container';

const footerLinks = {
  Products: [
    { name: 'All Products', path: '/products' },
    { name: 'New Arrivals', path: '/products?filter=new' },
    { name: 'Popular', path: '/products?filter=popular' },
    { name: 'Best Sellers', path: '/products?filter=bestseller' }
  ],
  Services: [
    { name: 'Installation', path: '/services' },
    { name: 'Customization', path: '/services' },
    { name: 'Premium Support', path: '/services' },
    { name: 'Consulting', path: '/contact' }
  ],
  Resources: [
    { name: 'Blog', path: '/blog' },
    { name: 'Documentation', path: '/docs' },
    { name: 'Support Center', path: '/support' },
    { name: 'FAQ', path: '/faq' }
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Refund Policy', path: '/refund' }
  ],
};

export default function Footer({ darkMode }) {
  return (
    <footer className={`pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-white'
        : 'bg-gradient-to-b from-gray-900 to-gray-950 text-white'
    }`}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-14 lg:mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div
                className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold glow-cyan"
                style={{
                  width: 'clamp(2.25rem, 4vw, 2.75rem)', // 36px - 44px
                  height: 'clamp(2.25rem, 4vw, 2.75rem)',
                  fontSize: 'clamp(1.35rem, 2.8vw, 1.6rem)', // 22px - 26px
                }}
              >
                V
              </div>
              <h2
                className="font-black tracking-wide"
                style={{
                  fontSize: 'clamp(1.3rem, 2.6vw, 1.7rem)', // 21px - 27px
                  letterSpacing: '0.08em',
                }}
              >
                VISTONE
              </h2>
            </div>
            <p
              className="text-gray-400 mb-6 sm:mb-8 leading-relaxed"
              style={{
                fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', // 14px - 16px
              }}
            >
              The infinite innovation accelerator. Creating premium SaaS solutions that empower businesses worldwide.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#"
                className="rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold"
                style={{
                  width: 'clamp(2.25rem, 4vw, 2.75rem)',
                  height: 'clamp(2.25rem, 4vw, 2.75rem)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                }}
              >
                𝕏
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold"
                style={{
                  width: 'clamp(2.25rem, 4vw, 2.75rem)',
                  height: 'clamp(2.25rem, 4vw, 2.75rem)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                }}
              >
                in
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold"
                style={{
                  width: 'clamp(2.25rem, 4vw, 2.75rem)',
                  height: 'clamp(2.25rem, 4vw, 2.75rem)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                }}
              >
                ▶
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 font-bold"
                style={{
                  width: 'clamp(2.25rem, 4vw, 2.75rem)',
                  height: 'clamp(2.25rem, 4vw, 2.75rem)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                }}
              >
                ⚲
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="font-black mb-4 sm:mb-5"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)', // 16px - 19px
                }}
              >
                {category}
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                      style={{
                        fontSize: 'clamp(0.85rem, 1.6vw, 0.98rem)', // 13px - 15px
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p
              className="text-gray-400 text-center md:text-left"
              style={{
                fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)', // 13px - 14px
              }}
            >
              © 2025 Vistone Ltd. All rights reserved.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
              <span
                className="text-gray-400"
                style={{
                  fontSize: 'clamp(0.78rem, 1.3vw, 0.9rem)',
                }}
              >
                Secure Payment:
              </span>
              <div className="flex gap-3 sm:gap-4">
                <div
                  className="bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-cyan-500 transition-all cursor-pointer"
                  style={{
                    fontSize: 'clamp(0.78rem, 1.4vw, 0.9rem)',
                  }}
                >
                  💳 Stripe
                </div>
                <div
                  className="bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-cyan-500 transition-all cursor-pointer"
                  style={{
                    fontSize: 'clamp(0.78rem, 1.4vw, 0.9rem)',
                  }}
                >
                  ⚡ Supabase
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
