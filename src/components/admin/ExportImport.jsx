import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileText,
  Database,
  Users,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Info
} from 'lucide-react';

const ExportImport = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportType, setExportType] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const exportOptions = [
    {
      id: 'all',
      title: 'Complete Database',
      description: 'Export all data including products, orders, users, and settings',
      icon: Database,
      size: '~15-50 MB',
      includes: ['Products', 'Orders', 'Users', 'Categories', 'Settings', 'Analytics']
    },
    {
      id: 'products',
      title: 'Products Only',
      description: 'Export all products with categories and metadata',
      icon: Package,
      size: '~2-8 MB',
      includes: ['Product details', 'Categories', 'Images', 'Files', 'Pricing']
    },
    {
      id: 'orders',
      title: 'Orders & Sales',
      description: 'Export order history and transaction data',
      icon: ShoppingBag,
      size: '~1-5 MB',
      includes: ['Order details', 'Customer info', 'Payment data', 'Downloads']
    },
    {
      id: 'users',
      title: 'Users & Customers',
      description: 'Export user accounts and customer data',
      icon: Users,
      size: '~500 KB - 2 MB',
      includes: ['User profiles', 'Purchase history', 'Preferences', 'Activity']
    }
  ];

  const formatOptions = [
    { id: 'csv', label: 'CSV (Excel Compatible)', icon: FileSpreadsheet, description: 'Best for spreadsheet analysis' },
    { id: 'json', label: 'JSON (Developer Friendly)', icon: FileText, description: 'Best for technical integration' },
    { id: 'sql', label: 'SQL Dump', icon: Database, description: 'Best for database migration' }
  ];

  const dateRangeOptions = [
    { id: 'all', label: 'All Time' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: '1year', label: 'Last Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  // Handle export
  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download file
      const filename = `vistone-${exportType}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      const blob = new Blob(['Sample export data'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Export completed successfully!');
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Handle file import
  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate import results
      const results = {
        success: true,
        processed: 1250,
        imported: 1180,
        updated: 45,
        skipped: 25,
        errors: 0,
        warnings: [
          'Some product images could not be imported (missing files)',
          '3 duplicate email addresses were found and skipped'
        ]
      };
      
      setImportResults(results);
    } catch (error) {
      setImportResults({
        success: false,
        error: 'Import failed due to file format error'
      });
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Data Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Export your data or import from external sources
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Download size={16} className="inline mr-2" />
            Export Data
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            Import Data
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {/* Export Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  What would you like to export?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setExportType(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          exportType === option.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            exportType === option.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {option.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {option.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                Size: {option.size}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {option.includes.map((item, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Export Format
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          exportFormat === format.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className={
                            exportFormat === format.id
                              ? 'text-blue-500'
                              : 'text-gray-400'
                          } />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {format.label}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {format.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Date Range
                </h3>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Info size={16} />
                  <span>Export will be downloaded as a file to your computer</span>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Export Data
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Instructions */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                      Import Guidelines
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                      <li>• Supported formats: CSV, JSON, SQL</li>
                      <li>• Maximum file size: 50 MB</li>
                      <li>• Existing data will be updated, not replaced</li>
                      <li>• Always backup your data before importing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select File to Import
                </h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    CSV, JSON, or SQL files up to 50MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.sql"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-300">
                        Importing Data...
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-400">
                        Please wait while we process your file. This may take a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Results */}
              {importResults && (
                <div className={`p-4 rounded-xl border ${
                  importResults.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {importResults.success ? (
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium mb-2 ${
                        importResults.success
                          ? 'text-green-900 dark:text-green-300'
                          : 'text-red-900 dark:text-red-300'
                      }`}>
                        {importResults.success ? 'Import Completed' : 'Import Failed'}
                      </h4>
                      
                      {importResults.success ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-green-800 dark:text-green-400 font-medium">
                                {importResults.processed}
                              </span>
                              <div className="text-green-700 dark:text-green-500">Processed</div>
                            </div>
                            <div>
                              <span className="text-green-800 dark:text-green-400 font-medium">
                                {importResults.imported}
                              </span>
                              <div className="text-green-700 dark:text-green-500">Imported</div>
                            </div>
                            <div>
                              <span className="text-green-800 dark:text-green-400 font-medium">
                                {importResults.updated}
                              </span>
                              <div className="text-green-700 dark:text-green-500">Updated</div>
                            </div>
                            <div>
                              <span className="text-green-800 dark:text-green-400 font-medium">
                                {importResults.skipped}
                              </span>
                              <div className="text-green-700 dark:text-green-500">Skipped</div>
                            </div>
                          </div>
                          
                          {importResults.warnings && importResults.warnings.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                                Warnings:
                              </h5>
                              <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
                                {importResults.warnings.map((warning, index) => (
                                  <li key={index}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-red-800 dark:text-red-400">
                          {importResults.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
