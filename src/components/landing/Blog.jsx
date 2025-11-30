import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: 'Smiles At Joomla Eid Bonus & Vacation Time In Macau',
    date: 'March 15, 2024',
    image: 'https://via.placeholder.com/400x250?text=Blog+Post+1',
    excerpt: 'Discover the latest updates and improvements to our platform.',
  },
  {
    id: 2,
    title: 'Top 10 Features Every E-Commerce Platform Should Have',
    date: 'March 10, 2024',
    image: 'https://via.placeholder.com/400x250?text=Blog+Post+2',
    excerpt: 'Essential features that make an e-commerce platform successful.',
  },
  {
    id: 3,
    title: 'How to Choose the Right Software Solution for Your Business',
    date: 'March 5, 2024',
    image: 'https://via.placeholder.com/400x250?text=Blog+Post+3',
    excerpt: 'A comprehensive guide to selecting the perfect software solution.',
  },
];

export default function Blog({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className={`section-padding relative overflow-hidden ${darkMode
      ? 'bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-5 ${darkMode ? 'bg-primary-500/20' : 'bg-primary-500/10'
          }`} />
      </div>

      <Container>
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2
            className={`font-black mb-4 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'
              }`}
            style={{
              fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            Latest From the <span className="text-gradient-gamified">Blog</span>
          </h2>
        </div>

        {/* Blog Posts Grid - Premium 2-column mobile layout */}
        <div
          ref={ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-12 transition-all duration-1000 delay-300 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} darkMode={darkMode} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center relative z-10">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={20} />}
            className={`px-6 sm:px-8 font-semibold ${darkMode
              ? ''
              : '!bg-primary-600 !hover:bg-primary-700 !text-white !shadow-lg hover:!shadow-xl focus:!ring-primary-500'
              }`}
            style={!darkMode ? {
              background: '#2563eb',
              color: '#ffffff',
              fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            } : {
              fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)',
            }}
            aria-label="View All Blog"
            asChild
          >
            <Link to="/blog">
              View All Blog
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

function BlogPostCard({ post, index, darkMode }) {
  return (
    <div
      className={`overflow-hidden futuristic-card h-full flex flex-col rounded-xl transition-all duration-300 group ${darkMode
        ? 'bg-slate-800/95 border border-slate-700/60 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/20'
        : 'bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1'
        }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className={`flex items-center gap-2 text-xs sm:text-sm mb-3 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
          <Calendar size={14} className="sm:w-4 sm:h-4" />
          <span>{post.date}</span>
        </div>

        <h3
          className={`font-black mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1 ${darkMode ? 'text-white' : 'text-slate-900'
            }`}
          style={{
            fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.25rem)', // 16px - 20px
          }}
        >
          {post.title}
        </h3>

        <p
          className={`leading-relaxed mb-4 line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          style={{
            fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
            lineHeight: '1.6',
          }}
        >
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.id}`}
          className={`inline-flex items-center gap-2 font-bold text-sm sm:text-base mt-auto transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
        >
          Read more
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
