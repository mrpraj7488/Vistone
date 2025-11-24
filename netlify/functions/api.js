const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Import services
const { initializeDatabase } = require('../../api/services/database');
const { initializeStorage } = require('../../api/services/storage');
const { initializeEmail } = require('../../api/services/email');
const { initializeAnalytics } = require('../../api/services/analytics');

// Import routes
const authRoutes = require('../../api/routes/auth');
const publicRoutes = require('../../api/routes/public');
const userRoutes = require('../../api/routes/user');
const adminRoutes = require('../../api/routes/admin');
const paymentRoutes = require('../../api/routes/payment');
const licenseRoutes = require('../../api/routes/license');

// Import middleware
const { authenticate, authorize } = require('../../api/middleware/auth');
const { errorHandler } = require('../../api/middleware/errorHandler');

// ============================================
// SERVERLESS APP SETUP
// ============================================

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Netlify handles this
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for Netlify
app.use(cors({
  origin: [
    'https://vistone.netlify.app',
    'https://staging--vistone.netlify.app',
    /https:\/\/deploy-preview-\d+--vistone\.netlify\.app/,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting (more lenient for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for serverless
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// ============================================
// INITIALIZATION
// ============================================

let initialized = false;

async function initializeServices() {
  if (initialized) return;
  
  try {
    console.log('🚀 Initializing serverless services...');
    
    // Initialize all services
    await Promise.all([
      initializeDatabase(),
      initializeStorage(),
      initializeEmail(),
      initializeAnalytics()
    ]);
    
    initialized = true;
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    throw error;
  }
}

// Middleware to ensure services are initialized
app.use(async (req, res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Services are initializing, please try again in a moment'
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'netlify-functions',
    initialized
  });
});

// ============================================
// API ROUTES
// ============================================

// Public routes (no authentication required)
app.use('/', publicRoutes);

// Authentication routes
app.use('/auth', authRoutes);

// Payment routes (special handling for webhooks)
app.use('/payment', paymentRoutes);

// License verification routes (public)
app.use('/license', licenseRoutes);

// Protected user routes
app.use('/user', authenticate, userRoutes);

// Protected admin routes
app.use('/admin', authenticate, authorize(['admin', 'editor', 'support']), adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// SERVERLESS EXPORT
// ============================================

// Create serverless handler
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/zip']
});

// Netlify function handler
exports.handler = async (event, context) => {
  // Set context timeout
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Add request logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', {
        method: event.httpMethod,
        path: event.path,
        headers: event.headers,
        query: event.queryStringParameters
      });
    }
    
    // Handle the request
    const result = await handler(event, context);
    
    // Add CORS headers if not already present
    if (!result.headers) result.headers = {};
    if (!result.headers['Access-Control-Allow-Origin']) {
      result.headers['Access-Control-Allow-Origin'] = '*';
    }
    if (!result.headers['Access-Control-Allow-Methods']) {
      result.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    }
    if (!result.headers['Access-Control-Allow-Headers']) {
      result.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    }
    
    return result;
  } catch (error) {
    console.error('Serverless function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      })
    };
  }
};
