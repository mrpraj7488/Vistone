import React, { useState } from 'react';
import {
  Info,
  Upload,
  X,
  Plus,
  Check,
  Move,
  Trash2,
  File,
  FolderOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Video,
  ExternalLink,
  Tag,
  Settings,
  Download,
  Clock,
  Shield,
  FileText,
  ChevronDown,
  Eye
} from 'lucide-react';

// Product Features Section Component
export const ProductFeaturesSection = ({ features, onAddFeature, onUpdateFeature, onRemoveFeature }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        ✨ Product Features
      </h2>
    </div>
    <div className="p-6 space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
          <Check className="w-4 h-4 text-green-500" />
          <input
            type="text"
            value={feature}
            onChange={(e) => onUpdateFeature(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter feature description"
          />
          <button
            onClick={() => onRemoveFeature(index)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={onAddFeature}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Feature
      </button>
    </div>
  </div>
);

// Product Files Section with Drag & Drop
export const ProductFilesSection = ({ formData, onFileChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange('mainFile', e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Product Files
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Main Product File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Main Product File (Regular License) *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              ZIP files up to 500MB
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => onFileChange('mainFile', e.target.files[0])}
              className="hidden"
            />
          </div>
          {formData.mainFile && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <File className="w-4 h-4" />
              {formData.mainFile.name}
              <button
                onClick={() => onFileChange('mainFile', null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Extended License File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Extended License File
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => onFileChange('extendedFile', e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>

        {/* Documentation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Documentation (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload PDF or ZIP documentation
            </p>
            <input
              type="file"
              accept=".pdf,.zip"
              onChange={(e) => onFileChange('documentation', e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Images Section
export const ProductImagesSection = ({ formData, onImageChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        Product Images
      </h2>
    </div>
    <div className="p-6 space-y-6">
      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Featured Image *
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer">
              Click to upload
            </span>{' '}
            featured image
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Recommended: 1200×800px, JPG or PNG
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange('featured', e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gallery Images (Max 10)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.galleryImages?.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Gallery ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => onImageChange('gallery', null, index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Add Image</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onImageChange('gallery', Array.from(e.target.files))}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Technical Specifications Section
export const TechnicalSpecsSection = ({ formData, onInputChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Technical Specifications
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            value={formData.version || ''}
            onChange={(e) => onInputChange('version', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2.5.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            File Size
          </label>
          <input
            type="text"
            value={formData.fileSize || ''}
            onChange={(e) => onInputChange('fileSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 24.5 MB"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Technology Stack
        </label>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'Material-UI'].map((tech) => (
            <label key={tech} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.techStack?.includes(tech) || false}
                onChange={(e) => {
                  const current = formData.techStack || [];
                  const updated = e.target.checked
                    ? [...current, tech]
                    : current.filter(t => t !== tech);
                  onInputChange('techStack', updated);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{tech}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Demo & Preview Section
export const DemoPreviewSection = ({ formData, onInputChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <ExternalLink className="w-5 h-5" />
        Demo & Preview
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Live Preview URL
        </label>
        <input
          type="url"
          value={formData.demoUrl || ''}
          onChange={(e) => onInputChange('demoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://demo.yoursite.com/product"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video Preview (YouTube/Vimeo)
        </label>
        <input
          type="url"
          value={formData.videoUrl || ''}
          onChange={(e) => onInputChange('videoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPreviewButton"
          checked={formData.showPreviewButton || false}
          onChange={(e) => onInputChange('showPreviewButton', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showPreviewButton" className="text-sm text-gray-700 dark:text-gray-300">
          Show preview button on product card
        </label>
      </div>
    </div>
  </div>
);

// License Terms Section
export const LicenseTermsSection = ({ formData, onInputChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Shield className="w-5 h-5" />
        License Terms
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Regular License Terms
        </label>
        <textarea
          value={formData.regularLicenseTerms || ''}
          onChange={(e) => onInputChange('regularLicenseTerms', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter regular license terms..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Extended License Terms
        </label>
        <textarea
          value={formData.extendedLicenseTerms || ''}
          onChange={(e) => onInputChange('extendedLicenseTerms', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter extended license terms..."
        />
      </div>
    </div>
  </div>
);

// Download Settings Section
export const DownloadSettingsSection = ({ formData, onInputChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Download className="w-5 h-5" />
        Download Settings
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Downloads per Purchase
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="downloadLimit"
              checked={formData.downloadLimit === 'unlimited'}
              onChange={() => onInputChange('downloadLimit', 'unlimited')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="downloadLimit"
              checked={formData.downloadLimit === 'limited'}
              onChange={() => onInputChange('downloadLimit', 'limited')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Limited to</span>
            <input
              type="number"
              value={formData.downloadCount || 5}
              onChange={(e) => onInputChange('downloadCount', parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">downloads</span>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Download Expiration
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="downloadExpiry"
              checked={formData.downloadExpiry === 'never'}
              onChange={() => onInputChange('downloadExpiry', 'never')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Never expires</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="downloadExpiry"
              checked={formData.downloadExpiry === 'expires'}
              onChange={() => onInputChange('downloadExpiry', 'expires')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Expires after</span>
            <input
              type="number"
              value={formData.expiryDays || 30}
              onChange={(e) => onInputChange('expiryDays', parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">days</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

// SEO Settings Section
export const SEOSettingsSection = ({ formData, onInputChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Tag className="w-5 h-5" />
        SEO Settings
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={formData.metaTitle || ''}
          onChange={(e) => onInputChange('metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="SEO title for search engines"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {(formData.metaTitle || '').length}/60 characters
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.metaDescription || ''}
          onChange={(e) => onInputChange('metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description for search results"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {(formData.metaDescription || '').length}/160 characters
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Focus Keyword
        </label>
        <input
          type="text"
          value={formData.focusKeyword || ''}
          onChange={(e) => onInputChange('focusKeyword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Primary keyword for SEO"
        />
      </div>
    </div>
  </div>
);

// Product Statistics Section (for edit mode)
export const ProductStatisticsSection = ({ stats }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Eye className="w-5 h-5" />
        Product Statistics
      </h2>
    </div>
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.sales || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.revenue || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.views || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.rating || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
        </div>
      </div>
    </div>
  </div>
);
