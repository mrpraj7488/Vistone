import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function BlogDetail({ darkMode }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
      incrementViews();
    }
  }, [post]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    setPost(data);
    setLoading(false);
  };

  const fetchRelatedPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', post.category)
      .neq('id', post.id)
      .limit(3);

    setRelatedPosts(data || []);
  };

  const incrementViews = async () => {
    await supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin text-6xl">⚙️</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <Link to="/blog" className="inline-block px-6 py-3 rounded-xl font-bold btn-gradient">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <Link to="/blog" className="hover:text-cyan-500">Blog</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-3/4">
            <div className={`mb-6 px-4 py-2 rounded-full inline-block ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
              <span className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {post.category}
              </span>
            </div>

            <h1 className={`text-4xl md:text-5xl font-black mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </h1>

            <div className={`flex items-center gap-6 mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>⏱️ {post.read_time} min read</span>
              <span>•</span>
              <span>👁️ {post.views || 0} views</span>
            </div>

            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            <div className={`prose max-w-none mb-12 ${darkMode ? 'prose-invert' : ''}`}>
              <div className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.content}
              </div>
            </div>

            {post.tags && JSON.parse(post.tags || '[]').length > 0 && (
              <div className="mb-12">
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {JSON.parse(post.tags).map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-gray-800 text-cyan-400' : 'bg-gray-100 text-gray-700'}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={`flex items-center justify-between py-6 border-t border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Share this article
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                  LinkedIn
                </button>
              </div>
            </div>
          </article>

          <aside className="lg:w-1/4">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className={`block p-4 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <h4 className={`font-bold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {relatedPost.title}
                    </h4>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(relatedPost.published_at).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
