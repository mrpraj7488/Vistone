import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Container } from '../components/layout/Container';
import {
  Calendar, Clock, Eye, Share2, Tag, User, ArrowLeft,
  ChevronRight, Twitter, Facebook, Linkedin, Hash
} from 'lucide-react';

export default function BlogDetail({ darkMode }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
      incrementViews();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
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
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center space-y-4">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Article not found</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const tags = post.tags ? (Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]')) : [];

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-grid ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
      </div>

      {/* Hero Section */}
      <div className={`relative pt-32 pb-16 ${darkMode ? 'bg-slate-900' : 'bg-white border-b border-slate-200'}`}>
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <Link to="/blog" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Blog</Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                {post.category}
              </span>
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {post.title}
            </h1>

            <div className={`flex flex-wrap items-center justify-center gap-6 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <User size={14} />
                </div>
                <span>{post.author || 'Vistone Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.read_time || 5} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{post.view_count || 0} views</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 -mt-12">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-slate-800 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full aspect-[21/9] object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className={`prose prose-lg max-w-none mb-12 ${darkMode ? 'prose-invert prose-p:text-slate-300 prose-headings:text-white' : 'prose-slate prose-p:text-slate-600 prose-headings:text-slate-900'}`}>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={20} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h3 className={`font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Share this article
              </h3>
              <div className="flex justify-center gap-4">
                <button className="p-3 rounded-full bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity">
                  <Twitter size={20} />
                </button>
                <button className="p-3 rounded-full bg-[#4267B2] text-white hover:opacity-90 transition-opacity">
                  <Facebook size={20} />
                </button>
                <button className="p-3 rounded-full bg-[#0077b5] text-white hover:opacity-90 transition-opacity">
                  <Linkedin size={20} />
                </button>
                <button className={`p-3 rounded-full hover:opacity-90 transition-opacity ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Related Posts */}
            <div className={`sticky top-32 p-6 rounded-2xl border backdrop-blur-xl ${darkMode
                ? 'bg-slate-800/80 border-slate-700/50'
                : 'bg-white/80 border-slate-200'
              }`}>
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Related Articles
              </h3>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <h4 className={`font-bold mb-2 line-clamp-2 transition-colors ${darkMode ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                      }`}>
                      {relatedPost.title}
                    </h4>
                    <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Calendar size={12} />
                      <span>{new Date(relatedPost.published_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
                {relatedPosts.length === 0 && (
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No related articles found.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
