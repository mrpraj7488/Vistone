import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Globe,
  Clock,
  BookOpen,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';
import BlogEditor from '../../components/admin/BlogEditor';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const categories = ['Tutorial', 'Design', 'Development', 'News', 'Tips'];
  const authors = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Writer' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPosts = data?.map(post => ({
        id: post.id,
        title: post.title || 'Untitled',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featuredImage: post.featured_image || '/placeholder.png',
        category: post.category || 'Uncategorized',
        tags: post.tags || [],
        status: post.status || 'draft',
        author: {
          id: post.author_id || 1,
          name: 'Admin',
          email: 'admin@example.com'
        },
        publishedAt: post.published_at,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        views: post.view_count || 0,
        likes: post.like_count || 0,
        comments: post.comment_count || 0,
        readTime: post.read_time || 5,
        seo: {
          metaTitle: post.meta_title || '',
          metaDescription: post.meta_description || '',
          keywords: post.keywords || ''
        }
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return '✅';
      case 'draft':
        return '📝';
      case 'archived':
        return '📦';
      default:
        return '⚪';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not published';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        setPosts(prev => prev.filter(p => p.id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error(`Failed to delete post: ${error.message}`);
      }
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: postData.title,
            slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
            content: postData.content,
            excerpt: postData.excerpt,
            featured_image: postData.featuredImage,
            status: postData.status,
            category: postData.category,
            tags: postData.tags,
            meta_title: postData.seo?.metaTitle || postData.title,
            meta_description: postData.seo?.metaDescription || postData.excerpt,
            keywords: postData.seo?.keywords || '',
            allow_comments: postData.settings?.allowComments !== false,
            featured: postData.settings?.featured || false,
            published_at: postData.status === 'published' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);

        if (error) throw error;

        // Update local state
        setPosts(prev => prev.map(p => 
          p.id === editingPost.id 
            ? { ...p, ...postData, updatedAt: new Date() }
            : p
        ));
        toast.success('Post updated successfully');
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: postData.title,
            slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
            content: postData.content,
            excerpt: postData.excerpt,
            featured_image: postData.featuredImage,
            status: postData.status,
            category: postData.category,
            tags: postData.tags,
            meta_title: postData.seo?.metaTitle || postData.title,
            meta_description: postData.seo?.metaDescription || postData.excerpt,
            keywords: postData.seo?.keywords || '',
            author_id: 1, // You might want to get this from current user
            view_count: 0,
            like_count: 0,
            comment_count: 0,
            allow_comments: postData.settings?.allowComments !== false,
            featured: postData.settings?.featured || false,
            published_at: postData.status === 'published' ? new Date().toISOString() : null
          }])
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        const newPost = {
          ...postData,
          id: data.id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          views: 0,
          likes: 0,
          comments: 0
        };
        setPosts(prev => [newPost, ...prev]);
        toast.success('Post created successfully');
      }
      setShowEditor(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message}`);
    }
  };

  const filteredAndSortedPosts = () => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
      const matchesAuthor = filterAuthor === 'all' || post.author.name === filterAuthor;
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'published' && post.status === 'published') ||
                        (activeTab === 'draft' && post.status === 'draft');
      
      return matchesSearch && matchesCategory && matchesStatus && matchesAuthor && matchesTab;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  };

  const filteredPosts = filteredAndSortedPosts();

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0)
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
        categories={categories}
        authors={authors}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Posts ({stats.total})
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog content and articles
          </p>
        </div>
        <button
          onClick={handleCreatePost}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={16} />
          Create New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Posts</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Published</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-200 dark:bg-yellow-800/30 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Drafts</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800/30 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Views</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{formatViews(stats.totalViews)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-200 dark:bg-pink-800/30 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">Total Likes</p>
              <p className="text-xl font-bold text-pink-900 dark:text-pink-100">{stats.totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="all">All Authors</option>
            {authors.map(author => (
              <option key={author.id} value={author.name}>{author.name}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'published', label: 'Published', count: stats.published },
            { key: 'draft', label: 'Draft', count: stats.draft }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading posts...</span>
                  </div>
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No posts found</p>
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {String(post.id).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {post.featuredImage ? (
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <ImageIcon size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          By: {post.author.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {formatViews(post.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {getStatusIcon(post.status)} {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="Edit post"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Delete post"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
