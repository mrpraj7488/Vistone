import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Reply,
  Edit,
  Trash2,
  Flag,
  Award,
  Calendar,
  User,
  Package
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(null);


  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews = data?.map(review => ({
        id: review.id,
        product: {
          name: review.product_name || 'Unknown Product',
          image: '/placeholder.png'
        },
        reviewer: {
          name: review.user_name || 'Anonymous',
          email: review.user_email || 'N/A',
          avatar: null,
          verified: true
        },
        rating: review.rating || 0,
        title: review.title || 'No title',
        content: review.content || 'No content',
        status: review.status || 'pending',
        featured: review.is_featured || false,
        helpful: review.helpful_count || 0,
        createdAt: review.created_at,
        orderId: review.order_id || 'N/A',
        reply: review.admin_reply ? {
          content: review.admin_reply,
          author: 'Support Team',
          createdAt: review.reply_created_at
        } : null
      })) || [];

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'spam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <MessageSquare className="w-4 h-4" />;
      case 'spam':
        return <Flag className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApproveReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'approved' }
        : review
    ));
    toast.success('Review approved');
  };

  const handleRejectReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'rejected' }
        : review
    ));
    toast.success('Review rejected');
  };

  const handleMarkAsSpam = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'spam' }
        : review
    ));
    toast.success('Review marked as spam');
  };

  const handleFeatureReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, featured: !review.featured }
        : review
    ));
    toast.success('Review featured status updated');
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Review deleted');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProduct = selectedProduct === 'all' || review.product.name === selectedProduct;
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    const matchesTab = activeTab === 'all' || review.status === activeTab;
    
    return matchesSearch && matchesProduct && matchesRating && matchesTab;
  });

  // Calculate stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    spam: reviews.filter(r => r.status === 'spam').length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Reviews ({stats.total})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer reviews and feedback
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(Math.round(stats.avgRating))}
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
              {stats.avgRating} average
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Reviews</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-200 dark:bg-yellow-800/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Approved</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-200 dark:bg-red-800/30 rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">Spam</p>
              <p className="text-xl font-bold text-red-900 dark:text-red-100">{stats.spam}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800/30 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Avg Rating</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by customer, product, or content..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Products</option>
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'approved', label: 'Approved', count: stats.approved },
            { key: 'spam', label: 'Spam', count: stats.spam }
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

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50 text-gray-400" />
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={review.product.image}
                    alt={review.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {review.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {review.reviewer.name}
                      </span>
                      {review.reviewer.verified && (
                        <CheckCircle size={14} className="text-green-500" title="Verified Purchase" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.featured && (
                    <Award size={16} className="text-yellow-500" title="Featured Review" />
                  )}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(review.status)}`}>
                    {getStatusIcon(review.status)}
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.title}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.content}
                </p>
              </div>

              {review.reply && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {review.reply.author}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {formatDate(review.reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200">
                    {review.reply.content}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatDate(review.createdAt)}</span>
                  <span>{review.helpful} helpful</span>
                  {review.orderId && (
                    <span>Order #{review.orderId}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReview(review.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowReplyModal(review)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <Reply size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleFeatureReview(review.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Feature Review"
                  >
                    <Award size={16} className={review.featured ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'} />
                  </button>
                  <button
                    onClick={() => handleMarkAsSpam(review.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Mark as Spam"
                  >
                    <Flag size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
