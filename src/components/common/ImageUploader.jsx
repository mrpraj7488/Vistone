/**
 * ImageUploader Component
 * 
 * A beautiful, reusable image upload component with:
 * - Drag and drop support
 * - Image preview before and after upload
 * - Context-aware upload (products, blogs, avatars, etc.)
 * - Progress indication
 * - Error handling with user-friendly messages
 * - Copy-to-clipboard for CDN URL
 * - Responsive design with dark mode support
 */

import React, { useState, useCallback, useRef } from 'react';
import {
    uploadImage,
    validateImageFile,
    createPreviewUrl,
    revokePreviewUrl,
    UPLOAD_CONTEXTS,
    getContextConfig
} from '../../utils/imageUpload';

const ImageUploader = ({
    onUploadComplete,
    onError,
    className = '',
    context = 'uploads', // products, blogs, avatars, categories, etc.
    prefix = '',
    customPath = '',
    showPreview = true,
    showUrlOnSuccess = true,
    showContextInfo = false,
    label = 'Upload Image',
    compact = false,
    existingImageUrl = null,
    disabled = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(existingImageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef(null);
    const config = getContextConfig(context);

    // Handle file selection
    const handleFileSelect = useCallback((file) => {
        if (disabled) return;

        setError(null);
        setUploadResult(null);
        setCopied(false);

        // Validate file with context
        const validation = validateImageFile(file, context);
        if (!validation.isValid) {
            setError(validation.error.message);
            onError?.(validation.error);
            return;
        }

        // Clean up previous preview
        if (previewUrl && previewUrl !== existingImageUrl) {
            revokePreviewUrl(previewUrl);
        }

        // Set new file and preview
        setSelectedFile(file);
        const preview = createPreviewUrl(file);
        setPreviewUrl(preview);
    }, [previewUrl, existingImageUrl, onError, context, disabled]);

    // Handle drag events
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect, disabled]);

    // Handle input change
    const handleInputChange = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    // Handle upload
    const handleUpload = useCallback(async () => {
        if (!selectedFile || disabled) {
            setError('Please select an image first');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const result = await uploadImage(selectedFile, { context, prefix, customPath });

            if (result.success) {
                setUploadResult(result.data);
                onUploadComplete?.(result.data);
            } else {
                setError(result.error.message);
                onError?.(result.error);
            }
        } catch (err) {
            const errorMessage = err.message || 'Upload failed. Please try again.';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, context, prefix, customPath, onUploadComplete, onError, disabled]);

    // Copy URL to clipboard
    const handleCopyUrl = useCallback(async () => {
        if (uploadResult?.publicUrl) {
            try {
                await navigator.clipboard.writeText(uploadResult.publicUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }, [uploadResult]);

    // Reset the uploader
    const handleReset = useCallback(() => {
        if (previewUrl && previewUrl !== existingImageUrl) {
            revokePreviewUrl(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(existingImageUrl);
        setUploadResult(null);
        setError(null);
        setCopied(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [previewUrl, existingImageUrl]);

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // Get accepted file types string
    const acceptedTypes = config.allowedTypes
        .map(t => '.' + t.split('/')[1])
        .join(',');

    const maxSizeMB = config.maxSize / (1024 * 1024);

    // Compact mode for inline use
    if (compact) {
        return (
            <div className={`${className}`}>
                <div
                    className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
            ${isDragging
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                    onDrag={handleDrag}
                    onDragStart={handleDrag}
                    onDragEnd={handleDragOut}
                    onDragOver={handleDragIn}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedTypes}
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={disabled}
                    />

                    {previewUrl ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={uploadResult?.publicUrl || previewUrl}
                                alt="Preview"
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 text-left">
                                {selectedFile && !uploadResult && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{selectedFile.name}</p>
                                )}
                                {uploadResult && (
                                    <span className="text-sm text-green-500">✓ Uploaded</span>
                                )}
                            </div>
                            {uploadResult && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                        </div>
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                )}

                {selectedFile && !uploadResult && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={isUploading || disabled}
                            className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg disabled:opacity-50"
                        >
                            Upload
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReset(); }}
                            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Full mode
    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {showContextInfo && (
                        <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                            ({config.recommended?.width}×{config.recommended?.height}px, max {maxSizeMB}MB)
                        </span>
                    )}
                </label>
            )}

            {/* Upload Area */}
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
          ${isDragging
                        ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'}
          ${error ? 'border-red-500/50' : ''}
          ${uploadResult ? 'border-green-500/50 bg-green-500/5' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                onDrag={handleDrag}
                onDragStart={handleDrag}
                onDragEnd={handleDragOut}
                onDragOver={handleDragIn}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={disabled}
                />

                {/* Preview Image */}
                {showPreview && (previewUrl || uploadResult?.publicUrl) && (
                    <div className="mb-4">
                        <div className="relative inline-block">
                            <img
                                src={uploadResult?.publicUrl || previewUrl}
                                alt="Preview"
                                className="max-h-48 max-w-full rounded-xl shadow-lg object-contain mx-auto"
                            />
                            {uploadResult && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload Icon */}
                {!previewUrl && !uploadResult && (
                    <div className="mb-3">
                        <div className={`
              inline-flex items-center justify-center w-12 h-12 rounded-full 
              ${isDragging ? 'bg-blue-500/20' : 'bg-gray-200 dark:bg-gray-700'}
              transition-colors duration-300
            `}>
                            <svg
                                className={`w-6 h-6 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Text Content */}
                {!uploadResult ? (
                    <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {isDragging ? 'Drop your image here!' : 'Drag and drop or'} <span className="text-blue-500">browse</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            {acceptedTypes.replace(/,/g, ', ')} • Max {maxSizeMB}MB
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-green-500 font-medium">✓ Uploaded successfully</p>
                )}

                {/* Selected File Info */}
                {selectedFile && !uploadResult && (
                    <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                )}

                {/* Loading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-gray-900/70 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-white text-sm">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {/* Success URL Display */}
            {showUrlOnSuccess && uploadResult && (
                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1 font-mono">
                            {uploadResult.publicUrl}
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopyUrl(); }}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {copied ? '✓' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
                {selectedFile && !uploadResult && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                        disabled={isUploading || disabled}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                )}

                {(selectedFile || uploadResult) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        disabled={disabled}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                    >
                        {uploadResult ? 'Replace' : 'Clear'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
