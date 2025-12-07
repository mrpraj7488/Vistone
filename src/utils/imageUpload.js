/**
 * Image Upload Utility for Supabase Storage
 * 
 * Features:
 * - Validates file type (jpg, jpeg, png, webp)
 * - Generates unique filenames using Date.now()
 * - Uploads to different folders based on context (products, blogs, avatars, etc.)
 * - Returns clean public CDN URL
 * - Handles errors gracefully
 * 
 * @module imageUpload
 */

import { supabase } from '../lib/supabase';

// ============================================
// CONFIGURATION
// ============================================

const BUCKET_NAME = 'Vistone-images';

// Upload context configurations
export const UPLOAD_CONTEXTS = {
    // General uploads
    uploads: {
        folder: 'uploads',
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1200, height: 800 }
    },

    // Product images
    products: {
        folder: 'products',
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1200, height: 800 },
        description: 'Product featured and gallery images'
    },

    // Product featured images
    productFeatured: {
        folder: 'products/featured',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1200, height: 800 },
        description: 'Product main/featured image'
    },

    // Product gallery images
    productGallery: {
        folder: 'products/gallery',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1200, height: 800 },
        description: 'Product gallery/preview images'
    },

    // Blog post images
    blogs: {
        folder: 'blogs',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1200, height: 630 },
        description: 'Blog featured images'
    },

    // Blog content images (inline)
    blogContent: {
        folder: 'blogs/content',
        maxSize: 3 * 1024 * 1024, // 3MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        recommended: { width: 800, height: 600 },
        description: 'Blog inline content images'
    },

    // Category icons/images
    categories: {
        folder: 'categories',
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
        recommended: { width: 400, height: 400 },
        description: 'Category icons and thumbnails'
    },

    // User avatars
    avatars: {
        folder: 'avatars',
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 256, height: 256 },
        description: 'User profile pictures'
    },

    // Testimonial images
    testimonials: {
        folder: 'testimonials',
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 256, height: 256 },
        description: 'Testimonial author photos'
    },

    // Team member photos
    team: {
        folder: 'team',
        maxSize: 3 * 1024 * 1024, // 3MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 400, height: 400 },
        description: 'Team member photos'
    },

    // Site branding (logos, icons)
    branding: {
        folder: 'branding',
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
        recommended: { width: 512, height: 512 },
        description: 'Site logos and branding'
    },

    // Banner/hero images
    banners: {
        folder: 'banners',
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        recommended: { width: 1920, height: 1080 },
        description: 'Hero banners and promotional images'
    },

    // OG/Social images
    social: {
        folder: 'social',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        recommended: { width: 1200, height: 630 },
        description: 'Open Graph and social media images'
    }
};

// Allowed extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Custom error class for upload-related errors
 */
export class ImageUploadError extends Error {
    constructor(message, code, details = null) {
        super(message);
        this.name = 'ImageUploadError';
        this.code = code;
        this.details = details;
    }
}

/**
 * Error codes for image upload operations
 */
export const UPLOAD_ERROR_CODES = {
    NO_FILE: 'NO_FILE',
    INVALID_TYPE: 'INVALID_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    UPLOAD_FAILED: 'UPLOAD_FAILED',
    URL_GENERATION_FAILED: 'URL_GENERATION_FAILED',
    INVALID_CONTEXT: 'INVALID_CONTEXT'
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Gets the configuration for a specific upload context
 * @param {string} context - Upload context key
 * @returns {Object} Context configuration
 */
export function getContextConfig(context = 'uploads') {
    const config = UPLOAD_CONTEXTS[context];
    if (!config) {
        console.warn(`Unknown upload context: ${context}, using default 'uploads'`);
        return UPLOAD_CONTEXTS.uploads;
    }
    return config;
}

/**
 * Validates the file before upload
 * @param {File} file - The file to validate
 * @param {string} context - Upload context (products, blogs, avatars, etc.)
 * @returns {{ isValid: boolean, error?: ImageUploadError }}
 */
export function validateImageFile(file, context = 'uploads') {
    const config = getContextConfig(context);

    // Check if file exists
    if (!file) {
        return {
            isValid: false,
            error: new ImageUploadError(
                'No file selected. Please choose an image to upload.',
                UPLOAD_ERROR_CODES.NO_FILE
            )
        };
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!config.allowedTypes.includes(fileType) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
        const allowedExtensions = config.allowedTypes.map(t => '.' + t.split('/')[1]).join(', ');
        return {
            isValid: false,
            error: new ImageUploadError(
                `Invalid file type. Allowed types: ${allowedExtensions}`,
                UPLOAD_ERROR_CODES.INVALID_TYPE,
                { providedType: fileType, allowedTypes: config.allowedTypes }
            )
        };
    }

    // Check file size
    if (file.size > config.maxSize) {
        const maxSizeMB = config.maxSize / (1024 * 1024);
        return {
            isValid: false,
            error: new ImageUploadError(
                `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`,
                UPLOAD_ERROR_CODES.FILE_TOO_LARGE,
                { fileSize: file.size, maxSize: config.maxSize }
            )
        };
    }

    return { isValid: true };
}

// ============================================
// FILENAME GENERATION
// ============================================

/**
 * Generates a unique filename for the uploaded image
 * @param {File} file - The file being uploaded
 * @param {string} prefix - Optional prefix for the filename
 * @returns {string} - Unique filename with timestamp
 */
export function generateUniqueFilename(file, prefix = '') {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop().toLowerCase();
    const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscore
        .substring(0, 30); // Limit length

    const prefixStr = prefix ? `${prefix}_` : '';
    return `${prefixStr}${sanitizedName}_${timestamp}_${randomStr}.${extension}`;
}

// ============================================
// CORE UPLOAD FUNCTIONS
// ============================================

/**
 * Uploads an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @param {string} options.context - Upload context (products, blogs, avatars, etc.)
 * @param {string} options.prefix - Optional filename prefix
 * @param {string} options.customPath - Custom path within the context folder
 * @param {Function} options.onProgress - Progress callback (optional)
 * @returns {Promise<{ success: boolean, data?: Object, error?: ImageUploadError }>}
 */
export async function uploadImage(file, options = {}) {
    const { context = 'uploads', prefix = '', customPath = '' } = options;

    // Get context configuration
    const config = getContextConfig(context);

    // Validate the file with context-specific rules
    const validation = validateImageFile(file, context);
    if (!validation.isValid) {
        return { success: false, error: validation.error };
    }

    try {
        // Generate unique filename
        const filename = generateUniqueFilename(file, prefix);

        // Construct the full path
        const basePath = customPath ? `${config.folder}/${customPath}` : config.folder;
        const filePath = `${basePath}/${filename}`;

        console.log('📤 Uploading image:', { context, filename, filePath, size: file.size });

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false, // Don't overwrite existing files
                contentType: file.type
            });

        if (error) {
            console.error('❌ Supabase upload error:', error);
            return {
                success: false,
                error: new ImageUploadError(
                    `Upload failed: ${error.message}`,
                    UPLOAD_ERROR_CODES.UPLOAD_FAILED,
                    error
                )
            };
        }

        console.log('✅ Upload successful:', data);

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
            return {
                success: false,
                error: new ImageUploadError(
                    'Failed to generate public URL for the uploaded image.',
                    UPLOAD_ERROR_CODES.URL_GENERATION_FAILED
                )
            };
        }

        console.log('🔗 Public URL:', urlData.publicUrl);

        return {
            success: true,
            data: {
                publicUrl: urlData.publicUrl,
                path: data.path,
                filename: filename,
                fullPath: data.fullPath || `${BUCKET_NAME}/${filePath}`,
                size: file.size,
                type: file.type,
                context: context,
                recommended: config.recommended
            }
        };

    } catch (err) {
        console.error('❌ Unexpected upload error:', err);
        return {
            success: false,
            error: new ImageUploadError(
                `An unexpected error occurred: ${err.message}`,
                UPLOAD_ERROR_CODES.UPLOAD_FAILED,
                err
            )
        };
    }
}

/**
 * Uploads multiple images to Supabase Storage
 * @param {FileList|File[]} files - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<{ successful: Array, failed: Array }>}
 */
export async function uploadMultipleImages(files, options = {}) {
    const results = {
        successful: [],
        failed: []
    };

    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const result = await uploadImage(file, { ...options, prefix: options.prefix || `img${i + 1}` });
        if (result.success) {
            results.successful.push({ file: file.name, ...result.data });
        } else {
            results.failed.push({ file: file.name, error: result.error });
        }
    }

    return results;
}

// ============================================
// CONTEXT-SPECIFIC UPLOAD FUNCTIONS
// ============================================

/**
 * Upload a product featured image
 * @param {File} file - Image file
 * @param {string} productId - Product ID for organization
 * @returns {Promise<Object>}
 */
export async function uploadProductImage(file, productId = '') {
    return uploadImage(file, {
        context: 'productFeatured',
        prefix: 'product',
        customPath: productId || ''
    });
}

/**
 * Upload multiple product gallery images
 * @param {FileList|File[]} files - Image files
 * @param {string} productId - Product ID for organization
 * @returns {Promise<Object>}
 */
export async function uploadProductGalleryImages(files, productId = '') {
    return uploadMultipleImages(files, {
        context: 'productGallery',
        prefix: 'gallery',
        customPath: productId || ''
    });
}

/**
 * Upload a blog featured image
 * @param {File} file - Image file
 * @param {string} postSlug - Post slug for organization
 * @returns {Promise<Object>}
 */
export async function uploadBlogImage(file, postSlug = '') {
    return uploadImage(file, {
        context: 'blogs',
        prefix: 'blog',
        customPath: postSlug || ''
    });
}

/**
 * Upload a blog content image
 * @param {File} file - Image file
 * @returns {Promise<Object>}
 */
export async function uploadBlogContentImage(file) {
    return uploadImage(file, {
        context: 'blogContent',
        prefix: 'content'
    });
}

/**
 * Upload a category image
 * @param {File} file - Image file
 * @param {string} categorySlug - Category slug
 * @returns {Promise<Object>}
 */
export async function uploadCategoryImage(file, categorySlug = '') {
    return uploadImage(file, {
        context: 'categories',
        prefix: 'cat',
        customPath: categorySlug || ''
    });
}

/**
 * Upload a user avatar
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
export async function uploadAvatar(file, userId = '') {
    return uploadImage(file, {
        context: 'avatars',
        prefix: 'avatar',
        customPath: userId || ''
    });
}

/**
 * Upload a testimonial image
 * @param {File} file - Image file
 * @returns {Promise<Object>}
 */
export async function uploadTestimonialImage(file) {
    return uploadImage(file, {
        context: 'testimonials',
        prefix: 'testimonial'
    });
}

/**
 * Upload a team member photo
 * @param {File} file - Image file
 * @returns {Promise<Object>}
 */
export async function uploadTeamPhoto(file) {
    return uploadImage(file, {
        context: 'team',
        prefix: 'team'
    });
}

/**
 * Upload a banner/hero image
 * @param {File} file - Image file
 * @param {string} section - Section name
 * @returns {Promise<Object>}
 */
export async function uploadBannerImage(file, section = '') {
    return uploadImage(file, {
        context: 'banners',
        prefix: 'banner',
        customPath: section || ''
    });
}

/**
 * Upload a branding image (logo, icon)
 * @param {File} file - Image file
 * @param {string} type - Type of branding (logo, icon, favicon)
 * @returns {Promise<Object>}
 */
export async function uploadBrandingImage(file, type = 'logo') {
    return uploadImage(file, {
        context: 'branding',
        prefix: type
    });
}

// ============================================
// DELETE & LIST FUNCTIONS
// ============================================

/**
 * Deletes an image from Supabase Storage
 * @param {string} path - The path of the image in storage
 * @returns {Promise<{ success: boolean, error?: Error }>}
 */
export async function deleteImage(path) {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (error) {
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err };
    }
}

/**
 * Lists images in a specific folder
 * @param {string} context - Upload context
 * @param {Object} options - List options
 * @returns {Promise<{ success: boolean, data?: Array, error?: Error }>}
 */
export async function listImages(context = 'uploads', options = {}) {
    const { limit = 100, offset = 0 } = options;
    const config = getContextConfig(context);

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(config.folder, {
                limit,
                offset,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            return { success: false, error };
        }

        // Add public URLs to each file
        const filesWithUrls = data.map(file => {
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(`${config.folder}/${file.name}`);

            return {
                ...file,
                publicUrl: urlData?.publicUrl
            };
        });

        return { success: true, data: filesWithUrls };
    } catch (err) {
        return { success: false, error: err };
    }
}

/**
 * Lists all uploaded images in the uploads folder (legacy support)
 * @param {Object} options - List options
 * @returns {Promise<{ success: boolean, data?: Array, error?: Error }>}
 */
export async function listUploadedImages(options = {}) {
    return listImages('uploads', options);
}

// ============================================
// PREVIEW UTILITIES
// ============================================

/**
 * Creates a preview URL for a file before upload
 * @param {File} file - The file to preview
 * @returns {string} - Object URL for preview
 */
export function createPreviewUrl(file) {
    return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free up memory
 * @param {string} url - The preview URL to revoke
 */
export function revokePreviewUrl(url) {
    URL.revokeObjectURL(url);
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    // Core functions
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    listImages,
    listUploadedImages,
    validateImageFile,
    generateUniqueFilename,
    getContextConfig,

    // Context-specific uploads
    uploadProductImage,
    uploadProductGalleryImages,
    uploadBlogImage,
    uploadBlogContentImage,
    uploadCategoryImage,
    uploadAvatar,
    uploadTestimonialImage,
    uploadTeamPhoto,
    uploadBannerImage,
    uploadBrandingImage,

    // Preview utilities
    createPreviewUrl,
    revokePreviewUrl,

    // Constants
    UPLOAD_CONTEXTS,
    UPLOAD_ERROR_CODES,
    ImageUploadError,
    BUCKET_NAME
};
