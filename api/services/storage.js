const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { query } = require('./database');

// ============================================
// FIREBASE STORAGE SERVICE
// ============================================

class FirebaseStorageService {
  constructor() {
    this.bucket = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
      }

      // Get storage bucket
      this.bucket = getStorage().bucket();
      
      this.initialized = true;
      console.log('✅ Firebase Storage initialized');
      
    } catch (error) {
      console.error('❌ Firebase Storage initialization failed:', error);
      throw error;
    }
  }

  // ============================================
  // FILE UPLOAD METHODS
  // ============================================

  async uploadFile(filePath, destination, options = {}) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const {
        makePublic = false,
        metadata = {},
        gzip = false
      } = options;

      const uploadOptions = {
        destination,
        metadata: {
          metadata: {
            uploadedAt: new Date().toISOString(),
            ...metadata
          }
        },
        gzip
      };

      const [file] = await this.bucket.upload(filePath, uploadOptions);

      if (makePublic) {
        await file.makePublic();
      }

      const publicUrl = makePublic 
        ? `https://storage.googleapis.com/${this.bucket.name}/${destination}`
        : null;

      // Log file upload to database
      await this.logFileUpload({
        file_name: path.basename(destination),
        original_name: path.basename(filePath),
        file_path: destination,
        file_size_bytes: (await fs.stat(filePath)).size,
        mime_type: this.getMimeType(filePath),
        storage_provider: 'firebase',
        is_public: makePublic,
        public_url: publicUrl
      });

      return {
        success: true,
        file_path: destination,
        public_url: publicUrl,
        file_name: file.name
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadBuffer(buffer, destination, options = {}) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const {
        makePublic = false,
        metadata = {},
        contentType = 'application/octet-stream'
      } = options;

      const file = this.bucket.file(destination);
      
      await file.save(buffer, {
        metadata: {
          contentType,
          metadata: {
            uploadedAt: new Date().toISOString(),
            ...metadata
          }
        }
      });

      if (makePublic) {
        await file.makePublic();
      }

      const publicUrl = makePublic 
        ? `https://storage.googleapis.com/${this.bucket.name}/${destination}`
        : null;

      // Log file upload to database
      await this.logFileUpload({
        file_name: path.basename(destination),
        original_name: path.basename(destination),
        file_path: destination,
        file_size_bytes: buffer.length,
        mime_type: contentType,
        storage_provider: 'firebase',
        is_public: makePublic,
        public_url: publicUrl
      });

      return {
        success: true,
        file_path: destination,
        public_url: publicUrl,
        file_name: file.name
      };

    } catch (error) {
      console.error('Error uploading buffer:', error);
      throw error;
    }
  }

  // ============================================
  // FILE MANAGEMENT METHODS
  // ============================================

  async deleteFile(filePath) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const file = this.bucket.file(filePath);
      await file.delete();

      // Update database record
      await query(`
        UPDATE files SET deleted_at = NOW() WHERE file_path = $1
      `, [filePath]);

      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileMetadata(filePath) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const file = this.bucket.file(filePath);
      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  async generateSignedUrl(filePath, options = {}) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const {
        action = 'read',
        expires = Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        contentType
      } = options;

      const file = this.bucket.file(filePath);
      
      const signedUrlOptions = {
        version: 'v4',
        action,
        expires
      };

      if (contentType) {
        signedUrlOptions.contentType = contentType;
      }

      const [url] = await file.getSignedUrl(signedUrlOptions);
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async copyFile(sourcePath, destinationPath) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const sourceFile = this.bucket.file(sourcePath);
      const [copiedFile] = await sourceFile.copy(destinationPath);
      
      return {
        success: true,
        source_path: sourcePath,
        destination_path: destinationPath,
        file_name: copiedFile.name
      };
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  async moveFile(sourcePath, destinationPath) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      const sourceFile = this.bucket.file(sourcePath);
      const [movedFile] = await sourceFile.move(destinationPath);
      
      // Update database record
      await query(`
        UPDATE files SET file_path = $1 WHERE file_path = $2
      `, [destinationPath, sourcePath]);

      return {
        success: true,
        old_path: sourcePath,
        new_path: destinationPath,
        file_name: movedFile.name
      };
    } catch (error) {
      console.error('Error moving file:', error);
      throw error;
    }
  }

  // ============================================
  // SPECIALIZED UPLOAD METHODS
  // ============================================

  async uploadProductFile(file, productId, licenseType = 'regular') {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const destination = `products/${productId}/${licenseType}/${fileName}`;

    const result = await this.uploadBuffer(file.buffer, destination, {
      makePublic: false,
      contentType: file.mimetype,
      metadata: {
        productId,
        licenseType,
        originalName: file.originalname,
        uploadedBy: 'admin'
      }
    });

    return result;
  }

  async uploadProductImage(file, productId, imageType = 'gallery') {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const destination = `products/${productId}/images/${imageType}/${fileName}`;

    const result = await this.uploadBuffer(file.buffer, destination, {
      makePublic: true,
      contentType: file.mimetype,
      metadata: {
        productId,
        imageType,
        originalName: file.originalname
      }
    });

    return result;
  }

  async uploadUserAvatar(file, userId) {
    const fileName = `${userId}-${Date.now()}.${this.getFileExtension(file.originalname)}`;
    const destination = `users/avatars/${fileName}`;

    const result = await this.uploadBuffer(file.buffer, destination, {
      makePublic: true,
      contentType: file.mimetype,
      metadata: {
        userId,
        type: 'avatar',
        originalName: file.originalname
      }
    });

    return result;
  }

  async uploadTicketAttachment(file, ticketId, userId) {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const destination = `support/tickets/${ticketId}/attachments/${fileName}`;

    const result = await this.uploadBuffer(file.buffer, destination, {
      makePublic: false,
      contentType: file.mimetype,
      metadata: {
        ticketId,
        userId,
        originalName: file.originalname,
        type: 'ticket_attachment'
      }
    });

    return result;
  }

  async uploadBlogImage(file, postId) {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const destination = `blog/${postId}/images/${fileName}`;

    const result = await this.uploadBuffer(file.buffer, destination, {
      makePublic: true,
      contentType: file.mimetype,
      metadata: {
        postId,
        type: 'blog_image',
        originalName: file.originalname
      }
    });

    return result;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  getFileExtension(filename) {
    return path.extname(filename).substring(1);
  }

  generateUniqueFileName(originalName) {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${name}-${timestamp}-${random}${ext}`;
  }

  async logFileUpload(fileData) {
    try {
      await query(`
        INSERT INTO files (
          file_name, original_name, file_path, file_size_bytes,
          mime_type, storage_provider, is_public, public_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        fileData.file_name,
        fileData.original_name,
        fileData.file_path,
        fileData.file_size_bytes,
        fileData.mime_type,
        fileData.storage_provider,
        fileData.is_public,
        fileData.public_url
      ]);
    } catch (error) {
      console.error('Error logging file upload:', error);
    }
  }

  // ============================================
  // MULTER CONFIGURATION
  // ============================================

  getMulterConfig(options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fieldName = 'file'
    } = options;

    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: maxSize
      },
      fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} not allowed`), false);
        }
      }
    });
  }

  // Product file upload config
  getProductFileUpload() {
    return this.getMulterConfig({
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/pdf'
      ]
    });
  }

  // Image upload config
  getImageUpload() {
    return this.getMulterConfig({
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ]
    });
  }

  // Document upload config
  getDocumentUpload() {
    return this.getMulterConfig({
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
    });
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  async healthCheck() {
    try {
      if (!this.initialized) {
        return { status: 'unhealthy', error: 'Not initialized' };
      }

      // Test bucket access
      const [files] = await this.bucket.getFiles({ maxResults: 1 });
      
      return {
        status: 'healthy',
        bucket_name: this.bucket.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

// ============================================
// DOWNLOAD SERVICE
// ============================================

class DownloadService {
  constructor(storageService) {
    this.storage = storageService;
    this.downloadTokens = new Map();
  }

  generateDownloadToken(filePath, userId, expiresIn = 24 * 60 * 60 * 1000) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + expiresIn;
    
    this.downloadTokens.set(token, {
      filePath,
      userId,
      expiresAt,
      used: false
    });

    // Clean up expired tokens
    setTimeout(() => {
      this.downloadTokens.delete(token);
    }, expiresIn);

    return token;
  }

  async validateDownloadToken(token) {
    const tokenData = this.downloadTokens.get(token);
    
    if (!tokenData) {
      throw new Error('Invalid download token');
    }

    if (Date.now() > tokenData.expiresAt) {
      this.downloadTokens.delete(token);
      throw new Error('Download token expired');
    }

    if (tokenData.used) {
      throw new Error('Download token already used');
    }

    return tokenData;
  }

  async generateSecureDownloadUrl(filePath, userId, expiresIn = 24 * 60 * 60 * 1000) {
    try {
      // Generate signed URL from Firebase
      const signedUrl = await this.storage.generateSignedUrl(filePath, {
        action: 'read',
        expires: Date.now() + expiresIn
      });

      // Log download request
      await query(`
        INSERT INTO downloads (user_id, file_path, download_method, download_token, token_expires_at)
        VALUES ($1, $2, 'link', $3, $4)
      `, [
        userId,
        filePath,
        crypto.randomBytes(16).toString('hex'),
        new Date(Date.now() + expiresIn)
      ]);

      return signedUrl;
    } catch (error) {
      console.error('Error generating secure download URL:', error);
      throw error;
    }
  }
}

// ============================================
// INITIALIZE AND EXPORT
// ============================================

const storageService = new FirebaseStorageService();
const downloadService = new DownloadService(storageService);

module.exports = {
  storageService,
  downloadService,
  initializeStorage: () => storageService.initialize(),
  uploadFile: (filePath, destination, options) => storageService.uploadFile(filePath, destination, options),
  uploadBuffer: (buffer, destination, options) => storageService.uploadBuffer(buffer, destination, options),
  deleteFile: (filePath) => storageService.deleteFile(filePath),
  generateSignedUrl: (filePath, options) => storageService.generateSignedUrl(filePath, options),
  generateDownloadToken: (filePath, userId) => downloadService.generateDownloadToken(filePath, userId),
  validateDownloadToken: (token) => downloadService.validateDownloadToken(token)
};
