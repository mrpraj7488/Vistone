import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  FileText,
  Globe,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Settings,
  Code,
  Image as ImageIcon,
  Link,
  Menu,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';
import PageEditor from '../../components/admin/PageEditor';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState(null);


  const templates = [
    { value: 'default', label: 'Default Template' },
    { value: 'legal', label: 'Legal Page Template' },
    { value: 'contact', label: 'Contact Page Template' },
    { value: 'faq', label: 'FAQ Template' },
    { value: 'landing', label: 'Landing Page Template' }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPages = data?.map(page => ({
        id: page.id,
        title: page.title || 'Untitled',
        slug: page.slug || '',
        content: page.content || '',
        template: page.template || 'default',
        status: page.status || 'draft',
        showInMenu: page.show_in_menu || false,
        menuOrder: page.menu_order || 0,
        featuredImage: page.featured_image,
        seo: {
          metaTitle: page.meta_title || '',
          metaDescription: page.meta_description || '',
          keywords: page.keywords || ''
        },
        customCSS: page.custom_css || '',
        customJS: page.custom_js || '',
        createdAt: page.created_at,
        updatedAt: page.updated_at,
        publishedAt: page.published_at,
        views: page.view_count || 0
      })) || [];

      setPages(transformedPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages');
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCreatePage = () => {
    setEditingPage(null);
    setShowEditor(true);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const handleDeletePage = (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(prev => prev.filter(p => p.id !== pageId));
      toast.success('Page deleted successfully');
    }
  };

  const handleSavePage = (pageData) => {
    if (editingPage) {
      // Update existing page
      setPages(prev => prev.map(p => 
        p.id === editingPage.id 
          ? { ...p, ...pageData, updatedAt: new Date().toISOString() }
          : p
      ));
      toast.success('Page updated successfully');
    } else {
      // Create new page
      const newPage = {
        ...pageData,
        id: Math.max(...pages.map(p => p.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: pageData.status === 'published' ? new Date().toISOString() : null,
        views: 0
      };
      setPages(prev => [newPage, ...prev]);
      toast.success('Page created successfully');
    }
    setShowEditor(false);
    setEditingPage(null);
  };

  const handleToggleStatus = (pageId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { 
            ...page, 
            status: newStatus,
            publishedAt: newStatus === 'published' ? new Date().toISOString() : null
          }
        : page
    ));
    toast.success(`Page ${newStatus === 'published' ? 'published' : 'unpublished'}`);
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    const matchesTemplate = selectedTemplate === 'all' || page.template === selectedTemplate;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  // Calculate stats
  const stats = {
    total: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    inMenu: pages.filter(p => p.showInMenu).length,
    totalViews: pages.reduce((sum, p) => sum + p.views, 0)
  };

  if (showEditor) {
    return (
      <PageEditor
        page={editingPage}
        onSave={handleSavePage}
        onCancel={() => {
          setShowEditor(false);
          setEditingPage(null);
        }}
        templates={templates}
      />
    );
  }

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
            Static Pages ({stats.total})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your website pages and content
          </p>
        </div>
        <button
          onClick={handleCreatePage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Pages</p>
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
              <Menu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">In Menu</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.inMenu}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-200 dark:bg-pink-800/30 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">Total Views</p>
              <p className="text-xl font-bold text-pink-900 dark:text-pink-100">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages by title, slug, or content..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Templates</option>
              {templates.map(template => (
                <option key={template.value} value={template.value}>{template.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Page Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No pages found</p>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {page.featuredImage && (
                          <img
                            src={page.featuredImage}
                            alt={page.title}
                            className="w-12 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {page.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {page.showInMenu && (
                              <Menu size={12} className="text-purple-500" title="Shown in menu" />
                            )}
                            {page.customCSS && (
                              <Code size={12} className="text-blue-500" title="Has custom CSS" />
                            )}
                            {page.customJS && (
                              <Settings size={12} className="text-orange-500" title="Has custom JS" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link size={14} className="text-gray-400" />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          /{page.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {templates.find(t => t.value === page.template)?.label || page.template}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(page.status)}`}>
                        {getStatusIcon(page.status)} {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Eye size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {page.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleEditPage(page)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(page.id, page.status)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {page.status === 'published' ? (
                            <XCircle size={16} className="text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
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
    </div>
  );
};

export default Pages;
