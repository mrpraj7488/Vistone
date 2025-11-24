const { query } = require('./database');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

// ============================================
// ANALYTICS SERVICE
// ============================================

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.eventQueue = [];
    this.batchSize = 100;
    this.flushInterval = 30000; // 30 seconds
  }

  initialize() {
    this.initialized = true;
    
    // Start batch processing
    setInterval(() => {
      this.processBatch();
    }, this.flushInterval);
    
    console.log('✅ Analytics service initialized');
  }

  // ============================================
  // EVENT TRACKING
  // ============================================

  async trackEvent(eventType, userId, sessionId, properties = {}, req = null) {
    const event = {
      event_type: eventType,
      user_id: userId,
      session_id: sessionId,
      properties: properties,
      page_url: req?.originalUrl || null,
      referrer_url: req?.get('Referer') || null,
      ip_address: this.getClientIP(req),
      user_agent: req?.get('User-Agent') || null,
      timestamp: new Date()
    };

    // Add device and location info
    if (req) {
      const deviceInfo = this.parseUserAgent(req.get('User-Agent'));
      const locationInfo = this.getLocationFromIP(this.getClientIP(req));
      
      event.device_type = deviceInfo.device;
      event.browser = deviceInfo.browser;
      event.os = deviceInfo.os;
      event.country = locationInfo.country;
      event.city = locationInfo.city;
    }

    // Add to queue for batch processing
    this.eventQueue.push(event);

    // If queue is full, process immediately
    if (this.eventQueue.length >= this.batchSize) {
      await this.processBatch();
    }

    return event;
  }

  async processBatch() {
    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0, this.batchSize);
    
    try {
      // Batch insert events
      const values = events.map((event, index) => {
        const baseIndex = index * 12;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12})`;
      }).join(', ');

      const params = events.flatMap(event => [
        event.event_type,
        event.user_id,
        event.session_id,
        JSON.stringify(event.properties),
        event.page_url,
        event.referrer_url,
        event.device_type,
        event.browser,
        event.os,
        event.ip_address,
        event.country,
        event.city
      ]);

      await query(`
        INSERT INTO analytics_events (
          event_type, user_id, session_id, properties, page_url, referrer_url,
          device_type, browser, os, ip_address, country, city
        ) VALUES ${values}
      `, params);

      console.log(`📊 Processed ${events.length} analytics events`);
    } catch (error) {
      console.error('Error processing analytics batch:', error);
      // Re-add failed events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  // ============================================
  // PRODUCT ANALYTICS
  // ============================================

  async trackProductView(productId, userId, sessionId, ipAddress, referrer) {
    try {
      // Insert product view
      await query(`
        INSERT INTO product_views (product_id, user_id, session_id, referrer_url, ip_address)
        VALUES ($1, $2, $3, $4, $5)
      `, [productId, userId, sessionId, referrer, ipAddress]);

      // Update product view count
      await query(`
        UPDATE products SET views_count = views_count + 1 WHERE id = $1
      `, [productId]);

      // Track as analytics event
      await this.trackEvent('product_view', userId, sessionId, {
        product_id: productId,
        referrer
      });

    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }

  async trackProductPurchase(productId, userId, orderId, amount, licenseType) {
    try {
      await this.trackEvent('product_purchase', userId, null, {
        product_id: productId,
        order_id: orderId,
        amount,
        license_type
      });

      // Update product sales count
      await query(`
        UPDATE products SET sales_count = sales_count + 1 WHERE id = $1
      `, [productId]);

    } catch (error) {
      console.error('Error tracking product purchase:', error);
    }
  }

  async trackDownload(productId, userId, orderId, fileType) {
    try {
      await this.trackEvent('file_download', userId, null, {
        product_id: productId,
        order_id: orderId,
        file_type: fileType
      });

    } catch (error) {
      console.error('Error tracking download:', error);
    }
  }

  // ============================================
  // USER ANALYTICS
  // ============================================

  async trackUserRegistration(userId, source = 'direct') {
    try {
      await this.trackEvent('user_registration', userId, null, {
        source,
        registration_date: new Date()
      });

    } catch (error) {
      console.error('Error tracking user registration:', error);
    }
  }

  async trackUserLogin(userId, sessionId, req) {
    try {
      await this.trackEvent('user_login', userId, sessionId, {
        login_method: 'email',
        login_date: new Date()
      }, req);

      // Update user login stats
      await query(`
        UPDATE users 
        SET last_login_at = NOW(), login_count = login_count + 1, last_login_ip = $1
        WHERE id = $2
      `, [this.getClientIP(req), userId]);

    } catch (error) {
      console.error('Error tracking user login:', error);
    }
  }

  async trackUserActivity(userId, activity, metadata = {}) {
    try {
      await this.trackEvent('user_activity', userId, null, {
        activity,
        ...metadata
      });

    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }

  // ============================================
  // BUSINESS ANALYTICS
  // ============================================

  async getRevenueAnalytics(startDate, endDate) {
    try {
      const result = await query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders_count,
          SUM(total_amount) as revenue,
          AVG(total_amount) as avg_order_value,
          COUNT(DISTINCT user_id) as unique_customers
        FROM orders 
        WHERE status = 'completed' 
          AND created_at >= $1 
          AND created_at <= $2
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [startDate, endDate]);

      return result.rows;
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw error;
    }
  }

  async getProductAnalytics(startDate, endDate, limit = 10) {
    try {
      const result = await query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          COUNT(o.id) as sales_count,
          SUM(o.total_amount) as revenue,
          AVG(o.total_amount) as avg_price,
          p.views_count,
          ROUND((COUNT(o.id)::decimal / NULLIF(p.views_count, 0)) * 100, 2) as conversion_rate
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id 
          AND o.status = 'completed'
          AND o.created_at >= $1 
          AND o.created_at <= $2
        WHERE p.status = 'published'
        GROUP BY p.id, p.name, p.slug, p.views_count
        ORDER BY revenue DESC NULLS LAST
        LIMIT $3
      `, [startDate, endDate, limit]);

      return result.rows;
    } catch (error) {
      console.error('Error getting product analytics:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(startDate, endDate) {
    try {
      const result = await query(`
        SELECT 
          COUNT(DISTINCT u.id) as total_customers,
          COUNT(DISTINCT CASE WHEN u.created_at >= $1 THEN u.id END) as new_customers,
          COUNT(DISTINCT o.user_id) as paying_customers,
          AVG(customer_stats.total_spent) as avg_customer_value,
          AVG(customer_stats.order_count) as avg_orders_per_customer
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
        LEFT JOIN (
          SELECT 
            user_id,
            SUM(total_amount) as total_spent,
            COUNT(*) as order_count
          FROM orders 
          WHERE status = 'completed'
          GROUP BY user_id
        ) customer_stats ON u.id = customer_stats.user_id
        WHERE u.role = 'customer'
      `, [startDate]);

      return result.rows[0];
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  async getTrafficAnalytics(startDate, endDate) {
    try {
      const result = await query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as page_views,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT ip_address) as unique_visitors
        FROM analytics_events 
        WHERE event_type IN ('page_view', 'product_view')
          AND created_at >= $1 
          AND created_at <= $2
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [startDate, endDate]);

      return result.rows;
    } catch (error) {
      console.error('Error getting traffic analytics:', error);
      throw error;
    }
  }

  async getTopReferrers(startDate, endDate, limit = 10) {
    try {
      const result = await query(`
        SELECT 
          CASE 
            WHEN referrer_url IS NULL OR referrer_url = '' THEN 'Direct'
            ELSE regexp_replace(referrer_url, '^https?://([^/]+).*', '\\1')
          END as referrer,
          COUNT(*) as visits,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(DISTINCT user_id) as unique_users
        FROM analytics_events 
        WHERE event_type = 'page_view'
          AND created_at >= $1 
          AND created_at <= $2
        GROUP BY referrer
        ORDER BY visits DESC
        LIMIT $3
      `, [startDate, endDate, limit]);

      return result.rows;
    } catch (error) {
      console.error('Error getting top referrers:', error);
      throw error;
    }
  }

  async getDeviceAnalytics(startDate, endDate) {
    try {
      const result = await query(`
        SELECT 
          device_type,
          browser,
          os,
          COUNT(*) as sessions,
          COUNT(DISTINCT user_id) as unique_users
        FROM analytics_events 
        WHERE event_type = 'page_view'
          AND created_at >= $1 
          AND created_at <= $2
        GROUP BY device_type, browser, os
        ORDER BY sessions DESC
      `, [startDate, endDate]);

      return result.rows;
    } catch (error) {
      console.error('Error getting device analytics:', error);
      throw error;
    }
  }

  async getGeographicAnalytics(startDate, endDate) {
    try {
      const result = await query(`
        SELECT 
          country,
          city,
          COUNT(*) as sessions,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT ip_address) as unique_visitors
        FROM analytics_events 
        WHERE event_type = 'page_view'
          AND created_at >= $1 
          AND created_at <= $2
          AND country IS NOT NULL
        GROUP BY country, city
        ORDER BY sessions DESC
        LIMIT 50
      `, [startDate, endDate]);

      return result.rows;
    } catch (error) {
      console.error('Error getting geographic analytics:', error);
      throw error;
    }
  }

  // ============================================
  // DASHBOARD METRICS
  // ============================================

  async getDashboardStats(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        revenueStats,
        orderStats,
        userStats,
        productStats,
        trafficStats
      ] = await Promise.all([
        this.getRevenueStats(startDate),
        this.getOrderStats(startDate),
        this.getUserStats(startDate),
        this.getProductStats(startDate),
        this.getTrafficStats(startDate)
      ]);

      return {
        revenue: revenueStats,
        orders: orderStats,
        users: userStats,
        products: productStats,
        traffic: trafficStats,
        period,
        generated_at: new Date()
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  async getRevenueStats(startDate) {
    const result = await query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as total_orders,
        COALESCE(AVG(total_amount), 0) as avg_order_value,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders 
      WHERE status = 'completed' AND created_at >= $1
    `, [startDate]);

    return result.rows[0];
  }

  async getOrderStats(startDate) {
    const result = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_orders,
        ROUND(
          (COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / NULLIF(COUNT(*), 0)) * 100, 
          2
        ) as completion_rate
      FROM orders 
      WHERE created_at >= $1
    `, [startDate]);

    return result.rows[0];
  }

  async getUserStats(startDate) {
    const result = await query(`
      SELECT 
        COUNT(*) as new_users,
        COUNT(DISTINCT o.user_id) as paying_users,
        ROUND(
          (COUNT(DISTINCT o.user_id)::decimal / NULLIF(COUNT(u.id), 0)) * 100, 
          2
        ) as conversion_rate
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
      WHERE u.created_at >= $1 AND u.role = 'customer'
    `, [startDate]);

    return result.rows[0];
  }

  async getProductStats(startDate) {
    const result = await query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT o.product_id) as products_sold,
        SUM(p.views_count) as total_views,
        COUNT(o.id) as total_sales
      FROM products p
      LEFT JOIN orders o ON p.id = o.product_id 
        AND o.status = 'completed' 
        AND o.created_at >= $1
      WHERE p.status = 'published'
    `, [startDate]);

    return result.rows[0];
  }

  async getTrafficStats(startDate) {
    const result = await query(`
      SELECT 
        COUNT(*) as page_views,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM analytics_events 
      WHERE event_type IN ('page_view', 'product_view') 
        AND created_at >= $1
    `, [startDate]);

    return result.rows[0];
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  getClientIP(req) {
    if (!req) return null;
    
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'];
  }

  parseUserAgent(userAgent) {
    if (!userAgent) return { device: 'unknown', browser: 'unknown', os: 'unknown' };
    
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    return {
      device: result.device.type || 'desktop',
      browser: `${result.browser.name || 'unknown'} ${result.browser.version || ''}`.trim(),
      os: `${result.os.name || 'unknown'} ${result.os.version || ''}`.trim()
    };
  }

  getLocationFromIP(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return { country: 'Unknown', city: 'Unknown' };
    }
    
    const geo = geoip.lookup(ip);
    return {
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown'
    };
  }

  getStartDate(period) {
    const now = new Date();
    switch (period) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // ============================================
  // EXPORT METHODS
  // ============================================

  async exportAnalyticsData(startDate, endDate, format = 'json') {
    try {
      const [
        revenue,
        products,
        customers,
        traffic,
        referrers,
        devices,
        geographic
      ] = await Promise.all([
        this.getRevenueAnalytics(startDate, endDate),
        this.getProductAnalytics(startDate, endDate, 50),
        this.getCustomerAnalytics(startDate, endDate),
        this.getTrafficAnalytics(startDate, endDate),
        this.getTopReferrers(startDate, endDate, 20),
        this.getDeviceAnalytics(startDate, endDate),
        this.getGeographicAnalytics(startDate, endDate)
      ]);

      const data = {
        period: { start: startDate, end: endDate },
        revenue,
        products,
        customers,
        traffic,
        referrers,
        devices,
        geographic,
        exported_at: new Date()
      };

      if (format === 'csv') {
        return this.convertToCSV(data);
      }

      return data;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }

  convertToCSV(data) {
    // Simple CSV conversion - you might want to use a proper CSV library
    const csvSections = [];
    
    // Revenue data
    if (data.revenue.length > 0) {
      const headers = Object.keys(data.revenue[0]).join(',');
      const rows = data.revenue.map(row => Object.values(row).join(',')).join('\n');
      csvSections.push(`Revenue Analytics\n${headers}\n${rows}`);
    }
    
    return csvSections.join('\n\n');
  }
}

// ============================================
// INITIALIZE AND EXPORT
// ============================================

const analyticsService = new AnalyticsService();

module.exports = {
  analyticsService,
  initializeAnalytics: () => analyticsService.initialize(),
  trackEvent: (eventType, userId, sessionId, properties, req) => 
    analyticsService.trackEvent(eventType, userId, sessionId, properties, req),
  trackProductView: (productId, userId, sessionId, ipAddress, referrer) =>
    analyticsService.trackProductView(productId, userId, sessionId, ipAddress, referrer),
  trackProductPurchase: (productId, userId, orderId, amount, licenseType) =>
    analyticsService.trackProductPurchase(productId, userId, orderId, amount, licenseType),
  getDashboardStats: (period) => analyticsService.getDashboardStats(period),
  getRevenueAnalytics: (startDate, endDate) => analyticsService.getRevenueAnalytics(startDate, endDate),
  exportAnalyticsData: (startDate, endDate, format) => analyticsService.exportAnalyticsData(startDate, endDate, format)
};
