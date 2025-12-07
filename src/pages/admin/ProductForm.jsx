import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Info,
  Check,
  Video,
  ExternalLink,
  Code,
  FolderOpen,
  Calendar,
  Shield,
  Download,
  Search,
  Star,
  Users,
  Activity,
  Settings,
  Globe,
  Tag,
  Package,
  Zap,
  HelpCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from '../../utils/notifications';
import { supabase } from '../../lib/supabase';
import {
  ProductFilesSection,
  TechnicalSpecsSection,
  DemoPreviewSection,
  LicenseTermsSection,
  DownloadSettingsSection,
  SEOSettingsSection,
  ProductStatisticsSection
} from '../../components/admin/ProductFormComponents';

const ProductFormFixed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [productStats, setProductStats] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    categories: [],
    tags: [],
    regularPrice: '',
    extendedPrice: '',
    enablePromo: false,
    salePrice: '',
    promoStartDate: '',
    promoEndDate: '',
    status: 'draft',
    visibility: 'public',
    publishDate: new Date().toISOString().split('T')[0],
    schedulePublish: false,
    featured: false,
    newArrival: false,
    onSale: false,
    trending: false,
    features: ['Fully Responsive Design', '50+ Pre-built Pages', 'Dark Mode Support', 'Lifetime Updates'],
    techStack: [],
    version: '2.5.1',
    compatibility: [],
    fileSize: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    requirements: '',
    livePreviewUrl: '',
    videoPreviewUrl: '',
    showPreviewButton: true,
    regularLicenseTerms: 'Standard license terms for single end product...',
    extendedLicenseTerms: 'Extended license terms for products offered for sale...',
    additionalTerms: '',
    supportPeriod: '6months',
    updatePeriod: '6months',
    documentationIncluded: true,
    downloadLimit: 'unlimited',
    downloadLimitCount: 5,
    downloadExpiry: 'never',
    downloadExpiryDays: 30,
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    mainFile: null,
    extendedFile: null,
    documentationFile: null,
    demoFiles: []
  });

  const categories = ['Dashboards', 'Templates', 'Plugins', 'Themes', 'Mobile Apps', 'UI Kits'];

  // Fetch product data and statistics when editing
  useEffect(() => {
    if (isEditing && id) {
      fetchProductData();
    }
  }, [id, isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProductData = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      if (product) {
        // Populate form with product data
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          shortDescription: product.short_description || '',
          fullDescription: product.full_description || '',
          category: product.category || '',
          categories: product.categories || [],
          tags: product.tags || [],
          regularPrice: product.regular_price || '',
          extendedPrice: product.extended_price || '',
          features: product.features || [],
          techStack: product.tech_stack || [],
          compatibility: product.compatibility || [],
          demoUrl: product.demo_url || '',
          previewUrl: product.preview_url || '',
          videoUrl: product.video_url || '',
          documentationUrl: product.documentation_url || '',
          supportUrl: product.support_url || '',
          licenseType: product.license_type || 'regular',
          licenseTerms: product.license_terms || '',
          downloadLimit: product.download_limit || 5,
          downloadExpiry: product.download_expiry || 30,
          requireLicense: product.require_license || false,
          autoUpdate: product.auto_update || false,
          version: product.version || '1.0.0',
          fileSize: product.file_size || '',
          lastUpdate: product.last_update || '',
          seoTitle: product.seo_title || '',
          seoDescription: product.seo_description || '',
          focusKeyword: product.focus_keyword || '',
          mainFile: null,
          extendedFile: null,
          documentationFile: null,
          demoFiles: []
        });

        // Fetch product statistics
        const { data: stats, error: statsError } = await supabase
          .from('product_stats')
          .select('*')
          .eq('product_id', id)
          .single();

        if (!statsError && stats) {
          setProductStats({
            sales: stats.sales_count || 0,
            revenue: stats.total_revenue || 0,
            views: stats.view_count || 0,
            favorites: stats.favorite_count || 0,
            rating: stats.average_rating || 0,
            reviews: stats.review_count || 0
          });
        } else {
          // If no stats exist, fetch from related tables
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('quantity, price')
            .eq('product_id', id);

          const { data: reviews } = await supabase
            .from('product_reviews')
            .select('rating')
            .eq('product_id', id);

          const sales = orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          const revenue = orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
          const avgRating = reviews?.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          setProductStats({
            sales,
            revenue,
            views: product.view_count || 0,
            favorites: product.favorite_count || 0,
            rating: avgRating,
            reviews: reviews?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'name' && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    if (field === 'shortDescription') {
      setCharacterCount(value.length);
    }
  };

  const handleAddFeature = () => {
    const newFeature = prompt('Enter new feature:');
    if (newFeature) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature]
      }));
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAttributeToggle = (attribute) => {
    setFormData(prev => ({
      ...prev,
      [attribute]: !prev[attribute]
    }));
  };

  const handleFileChange = (fileType, file) => {
    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleTechStackToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleCompatibilityToggle = (item) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(item)
        ? prev.compatibility.filter(c => c !== item)
        : [...prev.compatibility, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a unique slug
      const baseSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now()}`;

      // Start with only the REQUIRED columns from your schema
      const productData = {
        name: formData.name,
        slug: uniqueSlug,
        regular_price: parseFloat(formData.regularPrice) || 0
      };

      // Add optional text fields one by one
      if (formData.shortDescription) {
        productData.short_description = formData.shortDescription;
      }
      if (formData.fullDescription) {
        productData.description = formData.fullDescription;
      }

      // Status must be one of: draft, active, inactive, archived
      const validStatuses = ['draft', 'active', 'inactive', 'archived'];
      let status = formData.status?.toLowerCase() || 'draft';
      // Map common alternatives to valid values
      if (status === 'published') status = 'active';
      if (status === 'pending') status = 'draft';
      if (!validStatuses.includes(status)) status = 'draft';
      productData.status = status;

      if (formData.extendedPrice) {
        productData.extended_price = parseFloat(formData.extendedPrice);
      }

      // Boolean fields
      productData.is_featured = formData.featured === true;
      productData.is_digital = true;

      console.log('📦 Submitting product data:', JSON.stringify(productData, null, 2));

      if (isEditing) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)
          .select();

        if (error) {
          console.error('❌ Update error:', JSON.stringify(error, null, 2));
          throw error;
        }
        console.log('✅ Product updated:', data);
        toast.success('Product updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) {
          console.error('❌ Insert error:', JSON.stringify(error, null, 2));
          throw error;
        }
        console.log('✅ Product created:', data);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Full error object:', error);
      const errorMsg = error.details || error.message || error.code || 'Unknown error';
      const errorHint = error.hint || '';
      toast.error(`Failed: ${errorMsg}${errorHint ? ` - ${errorHint}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Product saved as draft!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isEditing ? 'Update your product information and settings' : 'Create a new digital product for your store'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Draft
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Product Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Product Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Basic product details and descriptions</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="React Dashboard Pro"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="react-dashboard-pro"
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('slug', generateSlug(formData.name))}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Auto-generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Description *
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Brief description for search results (2-3 sentences)"
                      rows={3}
                      maxLength={250}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{characterCount}/250 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                      placeholder="Detailed product description..."
                      rows={8}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign size={20} />
                    Pricing
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Regular License Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.regularPrice}
                          onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                          placeholder="49.00"
                          className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info size={12} />
                        For single end product (not for resale)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Extended License Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.extendedPrice}
                          onChange={(e) => handleInputChange('extendedPrice', e.target.value)}
                          placeholder="199.00"
                          className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info size={12} />
                        For end products offered for sale
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.enablePromo}
                        onChange={(e) => handleInputChange('enablePromo', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Promotional Pricing
                      </span>
                    </label>

                    {formData.enablePromo && (
                      <div className="mt-4 space-y-4 pl-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sale Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.salePrice}
                              onChange={(e) => handleInputChange('salePrice', e.target.value)}
                              placeholder="29.00"
                              className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={formData.promoStartDate}
                              onChange={(e) => handleInputChange('promoStartDate', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={formData.promoEndDate}
                              onChange={(e) => handleInputChange('promoEndDate', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Features */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ✨ Product Features
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
                      <Check className="w-5 h-5 text-green-500" />
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Add Another Feature
                  </button>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ImageIcon size={20} />
                    Product Images
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload Area - 1200×800px recommended
                      </p>
                      <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                        Choose Image
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gallery Images (Max 10)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors h-32">
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Images</span>
                        <input type="file" className="hidden" accept="image/*" multiple />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Files Section */}
              <ProductFilesSection
                formData={formData}
                onFileChange={handleFileChange}
              />

              {/* Technical Specifications */}
              <TechnicalSpecsSection
                formData={formData}
                techStackOptions={['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Node.js', 'Express']}
                compatibilityOptions={['Chrome', 'Firefox', 'Safari', 'Edge', 'Windows', 'macOS', 'Linux', 'iOS', 'Android']}
                onToggleTech={handleTechStackToggle}
                onToggleCompat={handleCompatibilityToggle}
                onInputChange={handleInputChange}
              />

              {/* Demo & Preview */}
              <DemoPreviewSection
                formData={formData}
                onInputChange={handleInputChange}
              />

              {/* License Terms */}
              <LicenseTermsSection
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:col-span-1 space-y-6">

              {/* Publish Box */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📤 Publish
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Mark as Featured Product
                    </span>
                  </label>

                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Eye className="inline w-4 h-4 mr-2" />
                      Preview
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Publishing...' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-blue-500">🏷️</span>
                    Categories
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-green-500">🏷️</span>
                    Tags
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddTag(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Product Attributes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-purple-500">⭐</span>
                    Product Attributes
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { key: 'featured', label: 'Featured Product', desc: 'Show in featured section' },
                    { key: 'newArrival', label: 'New Arrival', desc: 'Mark as new arrival' },
                    { key: 'onSale', label: 'On Sale', desc: 'Show sale badge' },
                    { key: 'trending', label: 'Trending', desc: 'Mark as trending' }
                  ].map(attr => (
                    <label key={attr.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData[attr.key]}
                        onChange={() => handleAttributeToggle(attr.key)}
                        className="mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{attr.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{attr.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Download Settings */}
              <DownloadSettingsSection
                formData={formData}
                onInputChange={handleInputChange}
              />

              {/* SEO Settings */}
              <SEOSettingsSection
                formData={formData}
                onInputChange={handleInputChange}
              />

              {/* Product Statistics (Edit Mode Only) */}
              {isEditing && productStats && (
                <ProductStatisticsSection
                  stats={{
                    sales: productStats.sales || 0,
                    revenue: productStats.revenue || 0,
                    views: productStats.views || 0,
                    favorites: productStats.favorites || 0,
                    rating: productStats.rating || 0,
                    reviews: productStats.reviews || 0
                  }}
                />
              )}

              {/* Quick Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tips</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Use high-quality images (1200×800px)</li>
                  <li>• Write clear, descriptive titles</li>
                  <li>• Set competitive pricing</li>
                  <li>• Add detailed product features</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormFixed;
