const express = require('express');
const router = express.Router();
const { query } = require('../services/database');
const { rateLimitByUser } = require('../middleware/auth');
const { generateDownloadToken, validateDownloadToken } = require('../services/downloads');
const { sendEmail } = require('../services/email');
const { trackEvent } = require('../services/analytics');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ============================================
// USER PROFILE MANAGEMENT
// ============================================

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userResult = await query(`
      SELECT 
        id, email, name, avatar, phone, country, 
        email_verified, two_factor_enabled, created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'completed') as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1 AND status = 'completed') as total_spent,
        (SELECT COUNT(*) FROM support_tickets WHERE user_id = $1) as total_tickets
      FROM users 
      WHERE id = $1
    `, [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    delete user.password_hash; // Ensure no sensitive data

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, country } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    const updateResult = await query(`
      UPDATE users 
      SET name = $1, phone = $2, country = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, name, phone, country, avatar, created_at
    `, [name.trim(), phone, country, userId]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Track profile update
    await trackEvent('profile_updated', userId, req.sessionID, {
      fields_updated: ['name', 'phone', 'country']
    }, req);

    res.json({ 
      message: 'Profile updated successfully',
      user: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Here you would upload to S3 or your storage service
    // For now, we'll simulate the upload
    const avatarUrl = `/uploads/avatars/${req.user.id}-${Date.now()}.${req.file.originalname.split('.').pop()}`;

    await query(`
      UPDATE users SET avatar = $1, updated_at = NOW() WHERE id = $2
    `, [avatarUrl, req.user.id]);

    res.json({ 
      message: 'Avatar updated successfully',
      avatar_url: avatarUrl
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Change password
router.put('/password', rateLimitByUser(5), async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current password hash
    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const { comparePassword, hashPassword } = require('../middleware/auth');
    const isValidPassword = await comparePassword(current_password, userResult.rows[0].password_hash);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(new_password);

    // Update password
    await query(`
      UPDATE users 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `, [newPasswordHash, userId]);

    // Send email notification
    await sendEmail({
      to: req.user.email,
      subject: 'Password Changed',
      template: 'password_changed',
      data: {
        name: req.user.name,
        timestamp: new Date().toISOString(),
        ip: req.ip
      }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/statistics', async (req, res) => {
  try {
    const userId = req.user.id;

    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM orders WHERE user_id = $1) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status = 'completed') as completed_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = $1 AND status = 'completed') as total_spent,
        (SELECT COUNT(*) FROM downloads WHERE user_id = $1) as total_downloads,
        (SELECT COUNT(*) FROM licenses WHERE user_id = $1) as total_licenses,
        (SELECT COUNT(*) FROM support_tickets WHERE user_id = $1) as total_tickets,
        (SELECT COUNT(*) FROM reviews WHERE user_id = $1) as total_reviews,
        (SELECT COUNT(*) FROM wishlists WHERE user_id = $1) as wishlist_items
    `, [userId]);

    res.json({ statistics: statsResult.rows[0] });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ORDER MANAGEMENT
// ============================================

// Get user orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    let whereCondition = 'user_id = $1';
    let queryParams = [userId, limit, offset];
    let paramCount = 3;

    if (status) {
      paramCount++;
      whereCondition += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    const ordersResult = await query(`
      SELECT 
        o.id, o.order_number, o.product_name, o.license_type,
        o.subtotal, o.discount_amount, o.tax_amount, o.total_amount,
        o.payment_method, o.payment_status, o.status,
        o.license_key, o.download_count, o.created_at, o.paid_at,
        p.name as current_product_name, p.slug as product_slug,
        p.featured_image as product_image
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE ${whereCondition}
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `, queryParams);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM orders WHERE ${whereCondition}
    `, [userId, ...(status ? [status] : [])]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      orders: ordersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderResult = await query(`
      SELECT 
        o.*,
        p.name as current_product_name, p.slug as product_slug,
        p.featured_image as product_image, p.version as current_version
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
    `, [id, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: orderResult.rows[0] });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download invoice
router.get('/orders/:id/invoice', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify order belongs to user
    const orderResult = await query(`
      SELECT * FROM orders WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate PDF invoice (you would implement PDF generation here)
    // For now, return order data
    res.json({ 
      message: 'Invoice generation not implemented yet',
      order: orderResult.rows[0]
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// DOWNLOADS MANAGEMENT
// ============================================

// Get user downloads
router.get('/downloads', async (req, res) => {
  try {
    const userId = req.user.id;

    const downloadsResult = await query(`
      SELECT DISTINCT
        p.id as product_id, p.name, p.slug, p.version, p.featured_image,
        o.id as order_id, o.order_number, o.license_type, o.license_key,
        o.download_count, o.created_at as purchased_at,
        l.download_limit, l.expires_at as license_expires_at,
        CASE 
          WHEN l.download_limit IS NULL THEN true
          WHEN o.download_count < l.download_limit THEN true
          ELSE false
        END as can_download
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN licenses l ON o.license_key = l.license_key
      WHERE o.user_id = $1 AND o.status = 'completed'
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({ downloads: downloadsResult.rows });
  } catch (error) {
    console.error('Error fetching user downloads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get download details
router.get('/downloads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const downloadResult = await query(`
      SELECT 
        p.*, o.license_type, o.license_key, o.download_count,
        l.download_limit, l.expires_at as license_expires_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN licenses l ON o.license_key = l.license_key
      WHERE p.id = $1 AND o.user_id = $2 AND o.status = 'completed'
    `, [id, userId]);

    if (downloadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Download not found' });
    }

    res.json({ download: downloadResult.rows[0] });
  } catch (error) {
    console.error('Error fetching download details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate download link
router.post('/downloads/:id/generate', rateLimitByUser(10), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify user can download this product
    const orderResult = await query(`
      SELECT 
        o.*, p.file_regular, p.file_extended,
        l.download_limit, l.expires_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN licenses l ON o.license_key = l.license_key
      WHERE p.id = $1 AND o.user_id = $2 AND o.status = 'completed'
    `, [id, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or not purchased' });
    }

    const order = orderResult.rows[0];

    // Check download limits
    if (order.download_limit && order.download_count >= order.download_limit) {
      return res.status(403).json({ error: 'Download limit exceeded' });
    }

    // Check license expiry
    if (order.expires_at && new Date(order.expires_at) < new Date()) {
      return res.status(403).json({ error: 'License has expired' });
    }

    // Generate secure download token
    const fileUrl = order.license_type === 'extended' ? order.file_extended : order.file_regular;
    const downloadToken = generateDownloadToken(fileUrl, userId);

    // Update download count
    await query(`
      UPDATE orders SET download_count = download_count + 1 WHERE id = $1
    `, [order.id]);

    // Log download
    await query(`
      INSERT INTO downloads (user_id, product_id, order_id, license_key, file_type, file_name, download_method, download_token, token_expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, 'link', $7, $8, $9, $10)
    `, [
      userId, id, order.id, order.license_key, order.license_type,
      fileUrl.split('/').pop(), downloadToken, 
      new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      req.ip, req.get('User-Agent')
    ]);

    res.json({
      download_url: `/api/downloads/secure/${downloadToken}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      remaining_downloads: order.download_limit ? order.download_limit - order.download_count - 1 : null
    });

  } catch (error) {
    console.error('Error generating download link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get version history
router.get('/downloads/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify user owns this product
    const ownershipResult = await query(`
      SELECT 1 FROM orders o
      WHERE o.product_id = $1 AND o.user_id = $2 AND o.status = 'completed'
    `, [id, userId]);

    if (ownershipResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or not purchased' });
    }

    // Get version history (this would be more complex in a real system)
    const versionsResult = await query(`
      SELECT version, updated_at as release_date
      FROM products 
      WHERE id = $1
      ORDER BY updated_at DESC
    `, [id]);

    res.json({ versions: versionsResult.rows });
  } catch (error) {
    console.error('Error fetching version history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// LICENSE MANAGEMENT
// ============================================

// Get user licenses
router.get('/licenses', async (req, res) => {
  try {
    const userId = req.user.id;

    const licensesResult = await query(`
      SELECT 
        l.*, p.name as product_name, p.slug as product_slug,
        o.order_number, o.created_at as purchased_at
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      JOIN orders o ON l.order_id = o.id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC
    `, [userId]);

    res.json({ licenses: licensesResult.rows });
  } catch (error) {
    console.error('Error fetching user licenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get license details
router.get('/licenses/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const userId = req.user.id;

    const licenseResult = await query(`
      SELECT 
        l.*, p.name as product_name, p.slug as product_slug,
        o.order_number, o.created_at as purchased_at
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      JOIN orders o ON l.order_id = o.id
      WHERE l.license_key = $1 AND l.user_id = $2
    `, [key, userId]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Get activation history
    const activationsResult = await query(`
      SELECT domain, activated_at, last_verified_at, is_active
      FROM license_activations
      WHERE license_id = $1
      ORDER BY activated_at DESC
    `, [licenseResult.rows[0].id]);

    const license = licenseResult.rows[0];
    license.activations = activationsResult.rows;

    res.json({ license });
  } catch (error) {
    console.error('Error fetching license details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Activate license on domain
router.post('/licenses/:key/activate', async (req, res) => {
  try {
    const { key } = req.params;
    const { domain } = req.body;
    const userId = req.user.id;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Get license
    const licenseResult = await query(`
      SELECT * FROM licenses WHERE license_key = $1 AND user_id = $2
    `, [key, userId]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    const license = licenseResult.rows[0];

    if (license.status !== 'active') {
      return res.status(400).json({ error: 'License is not active' });
    }

    // Check activation limit
    if (license.activation_count >= license.activation_limit) {
      return res.status(400).json({ error: 'Activation limit reached' });
    }

    // Check if domain already activated
    const existingActivation = await query(`
      SELECT id FROM license_activations 
      WHERE license_id = $1 AND domain = $2 AND is_active = true
    `, [license.id, domain]);

    if (existingActivation.rows.length > 0) {
      return res.status(400).json({ error: 'Domain already activated' });
    }

    // Activate license
    await query(`
      INSERT INTO license_activations (license_id, domain, ip_address)
      VALUES ($1, $2, $3)
    `, [license.id, domain, req.ip]);

    // Update activation count
    await query(`
      UPDATE licenses 
      SET activation_count = activation_count + 1, last_checked_at = NOW()
      WHERE id = $1
    `, [license.id]);

    res.json({ message: 'License activated successfully' });
  } catch (error) {
    console.error('Error activating license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate license from domain
router.post('/licenses/:key/deactivate', async (req, res) => {
  try {
    const { key } = req.params;
    const { domain } = req.body;
    const userId = req.user.id;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Get license
    const licenseResult = await query(`
      SELECT * FROM licenses WHERE license_key = $1 AND user_id = $2
    `, [key, userId]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    const license = licenseResult.rows[0];

    // Deactivate domain
    const deactivateResult = await query(`
      UPDATE license_activations 
      SET is_active = false 
      WHERE license_id = $1 AND domain = $2 AND is_active = true
      RETURNING id
    `, [license.id, domain]);

    if (deactivateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Active domain not found' });
    }

    // Update activation count
    await query(`
      UPDATE licenses 
      SET activation_count = activation_count - 1, last_checked_at = NOW()
      WHERE id = $1
    `, [license.id]);

    res.json({ message: 'License deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating license:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
