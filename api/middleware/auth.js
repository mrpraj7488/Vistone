const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../services/database');

// ============================================
// JWT TOKEN UTILITIES
// ============================================

const generateTokens = (user) => {
  const payload = {
    user_id: user.id,
    email: user.email,
    role: user.role
  };
  
  const accessToken = jwt.sign(
    { ...payload, token_type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { ...payload, token_type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// ============================================
// PASSWORD UTILITIES
// ============================================

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (decoded.token_type !== 'access') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }
    
    // Get user from database
    const userResult = await query(
      'SELECT id, email, name, role, status FROM users WHERE id = $1',
      [decoded.user_id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }
    
    const user = userResult.rows[0];
    
    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account suspended or deleted'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Access token has expired'
      });
    }
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid access token'
    });
  }
};

// ============================================
// AUTHORIZATION MIDDLEWARE
// ============================================

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// ============================================
// PERMISSION SYSTEM
// ============================================

const permissions = {
  // Admin Panel Access
  'admin.access': ['admin', 'editor', 'support'],
  
  // Product Management
  'products.view': ['admin', 'editor', 'support'],
  'products.create': ['admin', 'editor'],
  'products.edit': ['admin', 'editor'],
  'products.delete': ['admin'],
  'products.publish': ['admin'],
  
  // Category Management
  'categories.view': ['admin', 'editor', 'support'],
  'categories.create': ['admin', 'editor'],
  'categories.edit': ['admin', 'editor'],
  'categories.delete': ['admin'],
  
  // User Management
  'users.view': ['admin'],
  'users.create': ['admin'],
  'users.edit': ['admin'],
  'users.delete': ['admin'],
  'users.suspend': ['admin'],
  
  // Order Management
  'orders.view': ['admin', 'support'],
  'orders.edit': ['admin'],
  'orders.refund': ['admin'],
  'orders.create': ['admin'],
  
  // License Management
  'licenses.view': ['admin', 'support'],
  'licenses.create': ['admin'],
  'licenses.edit': ['admin'],
  'licenses.revoke': ['admin'],
  
  // Support Management
  'support.view': ['admin', 'support'],
  'support.reply': ['admin', 'support'],
  'support.assign': ['admin', 'support'],
  'support.close': ['admin', 'support'],
  
  // Review Management
  'reviews.view': ['admin', 'editor', 'support'],
  'reviews.approve': ['admin', 'editor'],
  'reviews.reject': ['admin', 'editor'],
  'reviews.reply': ['admin', 'editor'],
  'reviews.delete': ['admin'],
  
  // Blog Management
  'blog.view': ['admin', 'editor', 'support'],
  'blog.create': ['admin', 'editor'],
  'blog.edit': ['admin', 'editor'],
  'blog.publish': ['admin'],
  'blog.delete': ['admin'],
  
  // Page Management
  'pages.view': ['admin', 'editor'],
  'pages.create': ['admin', 'editor'],
  'pages.edit': ['admin', 'editor'],
  'pages.delete': ['admin'],
  
  // Coupon Management
  'coupons.view': ['admin', 'editor'],
  'coupons.create': ['admin'],
  'coupons.edit': ['admin'],
  'coupons.delete': ['admin'],
  
  // Analytics
  'analytics.view': ['admin'],
  'analytics.export': ['admin'],
  
  // Settings
  'settings.view': ['admin'],
  'settings.edit': ['admin'],
  
  // System
  'system.backup': ['admin'],
  'system.logs': ['admin'],
  'system.cache': ['admin'],
  
  // Webhooks
  'webhooks.view': ['admin'],
  'webhooks.create': ['admin'],
  'webhooks.edit': ['admin'],
  'webhooks.delete': ['admin']
};

const hasPermission = (userRole, permission) => {
  const allowedRoles = permissions[permission];
  return allowedRoles && allowedRoles.includes(userRole);
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Permission '${permission}' required`
      });
    }
    
    next();
  };
};

// ============================================
// OPTIONAL AUTHENTICATION
// ============================================

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (decoded.token_type !== 'access') {
      return next(); // Continue without authentication
    }
    
    // Get user from database
    const userResult = await query(
      'SELECT id, email, name, role, status FROM users WHERE id = $1',
      [decoded.user_id]
    );
    
    if (userResult.rows.length > 0 && userResult.rows[0].status === 'active') {
      req.user = userResult.rows[0];
      req.token = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication on token errors
    next();
  }
};

// ============================================
// SESSION MANAGEMENT
// ============================================

const createSession = async (userId, token, ipAddress, userAgent) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await query(
    `INSERT INTO user_sessions (user_id, token, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, token, ipAddress, userAgent, expiresAt]
  );
};

const deleteSession = async (token) => {
  await query('DELETE FROM user_sessions WHERE token = $1', [token]);
};

const deleteAllUserSessions = async (userId) => {
  await query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);
};

const cleanupExpiredSessions = async () => {
  await query('DELETE FROM user_sessions WHERE expires_at < NOW()');
};

// ============================================
// RATE LIMITING BY USER
// ============================================

const userRateLimit = new Map();

const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!userRateLimit.has(userId)) {
      userRateLimit.set(userId, []);
    }
    
    const requests = userRateLimit.get(userId);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    userRateLimit.set(userId, validRequests);
    
    next();
  };
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Token utilities
  generateTokens,
  verifyToken,
  
  // Password utilities
  hashPassword,
  comparePassword,
  
  // Middleware
  authenticate,
  authorize,
  optionalAuth,
  requirePermission,
  rateLimitByUser,
  
  // Permission system
  hasPermission,
  permissions,
  
  // Session management
  createSession,
  deleteSession,
  deleteAllUserSessions,
  cleanupExpiredSessions
};
