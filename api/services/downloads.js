// Download Service for managing file downloads and license verification
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class DownloadService {
  constructor() {
    this.downloadTokens = new Map();
    this.downloadStats = new Map();
    this.rateLimits = new Map();
  }

  // Generate secure download token
  generateDownloadToken(userId, productId, licenseKey, expiresIn = 3600) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    const tokenData = {
      token,
      userId,
      productId,
      licenseKey,
      expiresAt,
      createdAt: Date.now()
    };
    
    this.downloadTokens.set(token, tokenData);
    
    // Clean up expired tokens periodically
    this.cleanupExpiredTokens();
    
    return {
      token,
      expiresAt,
      downloadUrl: `/api/downloads/${token}`
    };
  }

  // Validate download token
  validateDownloadToken(token) {
    const tokenData = this.downloadTokens.get(token);
    
    if (!tokenData) {
      return { valid: false, error: 'Invalid download token' };
    }
    
    if (Date.now() > tokenData.expiresAt) {
      this.downloadTokens.delete(token);
      return { valid: false, error: 'Download token expired' };
    }
    
    return { valid: true, data: tokenData };
  }

  // Check download rate limits
  checkRateLimit(userId, limit = 10, window = 3600000) {
    const now = Date.now();
    const userLimits = this.rateLimits.get(userId) || [];
    
    // Filter out old entries outside the window
    const recentDownloads = userLimits.filter(
      timestamp => now - timestamp < window
    );
    
    if (recentDownloads.length >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: recentDownloads[0] + window
      };
    }
    
    // Add current download timestamp
    recentDownloads.push(now);
    this.rateLimits.set(userId, recentDownloads);
    
    return {
      allowed: true,
      remaining: limit - recentDownloads.length,
      resetAt: recentDownloads[0] + window
    };
  }

  // Track download statistics
  trackDownload(userId, productId, licenseKey, metadata = {}) {
    const downloadId = crypto.randomBytes(16).toString('hex');
    
    const downloadRecord = {
      id: downloadId,
      userId,
      productId,
      licenseKey,
      timestamp: Date.now(),
      ip: metadata.ip || null,
      userAgent: metadata.userAgent || null,
      country: metadata.country || null,
      referrer: metadata.referrer || null
    };
    
    // Store in memory (in production, save to database)
    const productStats = this.downloadStats.get(productId) || [];
    productStats.push(downloadRecord);
    this.downloadStats.set(productId, productStats);
    
    return downloadRecord;
  }

  // Get download statistics for a product
  getDownloadStats(productId, options = {}) {
    const stats = this.downloadStats.get(productId) || [];
    const { startDate, endDate, userId } = options;
    
    let filtered = stats;
    
    if (startDate) {
      filtered = filtered.filter(s => s.timestamp >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(s => s.timestamp <= endDate);
    }
    
    if (userId) {
      filtered = filtered.filter(s => s.userId === userId);
    }
    
    return {
      total: filtered.length,
      downloads: filtered,
      uniqueUsers: new Set(filtered.map(s => s.userId)).size,
      countries: this.aggregateByCountry(filtered),
      daily: this.aggregateByDay(filtered)
    };
  }

  // Prepare file for download
  async prepareDownload(filePath, options = {}) {
    try {
      const { encrypt = false, watermark = false, userId } = options;
      
      // Check if file exists
      await fs.access(filePath);
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      let finalPath = filePath;
      let cleanup = null;
      
      // Apply watermark if requested
      if (watermark && userId) {
        finalPath = await this.applyWatermark(filePath, userId);
        cleanup = () => fs.unlink(finalPath).catch(() => {});
      }
      
      // Encrypt file if requested
      if (encrypt) {
        const encryptedPath = await this.encryptFile(finalPath);
        if (cleanup) {
          const prevCleanup = cleanup;
          cleanup = () => {
            prevCleanup();
            fs.unlink(encryptedPath).catch(() => {});
          };
        } else {
          cleanup = () => fs.unlink(encryptedPath).catch(() => {});
        }
        finalPath = encryptedPath;
      }
      
      return {
        path: finalPath,
        size: stats.size,
        mimeType: this.getMimeType(filePath),
        filename: path.basename(filePath),
        cleanup
      };
    } catch (error) {
      throw new Error(`Failed to prepare download: ${error.message}`);
    }
  }

  // Apply watermark to file (placeholder - implement based on file type)
  async applyWatermark(filePath, userId) {
    // This is a placeholder - actual implementation would depend on file type
    // For PDFs, use pdf-lib; for images, use sharp; etc.
    const ext = path.extname(filePath);
    const watermarkedPath = filePath.replace(ext, `-watermarked-${userId}${ext}`);
    
    // For now, just copy the file
    await fs.copyFile(filePath, watermarkedPath);
    
    return watermarkedPath;
  }

  // Encrypt file for secure download
  async encryptFile(filePath) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    const encryptedPath = `${filePath}.encrypted`;
    
    // In production, implement actual encryption
    // For now, just copy the file
    await fs.copyFile(filePath, encryptedPath);
    
    return encryptedPath;
  }

  // Get MIME type from file extension
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.exe': 'application/x-msdownload',
      '.dmg': 'application/x-apple-diskimage',
      '.pkg': 'application/x-newton-compatible-pkg',
      '.deb': 'application/x-debian-package',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.xml': 'application/xml'
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }

  // Clean up expired tokens
  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of this.downloadTokens.entries()) {
      if (now > data.expiresAt) {
        this.downloadTokens.delete(token);
      }
    }
  }

  // Aggregate downloads by country
  aggregateByCountry(downloads) {
    const countries = {};
    downloads.forEach(d => {
      const country = d.country || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
    });
    return countries;
  }

  // Aggregate downloads by day
  aggregateByDay(downloads) {
    const daily = {};
    downloads.forEach(d => {
      const date = new Date(d.timestamp).toISOString().split('T')[0];
      daily[date] = (daily[date] || 0) + 1;
    });
    return daily;
  }

  // Generate signed URL for S3/cloud storage
  generateSignedUrl(bucket, key, expiresIn = 3600) {
    // Placeholder for S3 signed URL generation
    // In production, use AWS SDK or your cloud storage SDK
    const signedUrl = `https://${bucket}.s3.amazonaws.com/${key}?token=${crypto.randomBytes(16).toString('hex')}`;
    return {
      url: signedUrl,
      expiresAt: Date.now() + (expiresIn * 1000)
    };
  }

  // Verify license before download
  async verifyLicense(licenseKey, productId) {
    // Placeholder - in production, check against database
    // For now, return true if license key exists
    if (!licenseKey || !productId) {
      return {
        valid: false,
        error: 'License key and product ID required'
      };
    }
    
    // Simulate license verification
    return {
      valid: true,
      remainingDownloads: 5,
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    };
  }

  // Stream large file download
  createDownloadStream(filePath, options = {}) {
    const { start, end } = options;
    const streamOptions = {};
    
    if (start !== undefined) {
      streamOptions.start = start;
    }
    
    if (end !== undefined) {
      streamOptions.end = end;
    }
    
    // Return readable stream configuration
    return {
      path: filePath,
      options: streamOptions
    };
  }

  // Get download history for user
  getUserDownloadHistory(userId, limit = 50) {
    const allDownloads = [];
    
    for (const [productId, downloads] of this.downloadStats.entries()) {
      const userDownloads = downloads
        .filter(d => d.userId === userId)
        .map(d => ({ ...d, productId }));
      allDownloads.push(...userDownloads);
    }
    
    // Sort by timestamp descending and limit
    return allDownloads
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

// Create singleton instance
const downloadService = new DownloadService();

// Export both the service instance and individual methods
module.exports = downloadService;
module.exports.generateDownloadToken = downloadService.generateDownloadToken.bind(downloadService);
module.exports.validateDownloadToken = downloadService.validateDownloadToken.bind(downloadService);
module.exports.checkRateLimit = downloadService.checkRateLimit.bind(downloadService);
module.exports.trackDownload = downloadService.trackDownload.bind(downloadService);
module.exports.prepareDownload = downloadService.prepareDownload.bind(downloadService);
module.exports.verifyLicense = downloadService.verifyLicense.bind(downloadService);
module.exports.getUserDownloadHistory = downloadService.getUserDownloadHistory.bind(downloadService);
