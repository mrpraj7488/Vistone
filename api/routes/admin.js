const express = require('express');
const router = express.Router();
const { query } = require('../services/database');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadFile } = require('../services/storage');
const { sendEmail } = require('../services/email');
const { trackEvent } = require('../services/analytics');

// Middleware: Admin only routes
router.use(authenticate);
router.use(authorize(['admin', 'editor', 'support']));

// ============================================
// DASHBOARD STATS
// ============================================

router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get various stats
    const [orders, users, products, revenue] = await Promise.all([
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = "completed" THEN 1 END) as completed FROM orders WHERE created_at >= NOW() - INTERVAL 30 DAY'),
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 1 END) as new FROM users WHERE role = "customer"'),
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = "published" THEN 1 END) as published FROM products'),
      query('SELECT SUM(total_amount) as total, AVG(total_amount) as average FROM orders WHERE status = "completed" AND created_at >= NOW() - INTERVAL 30 DAY')
    ]);

    res.json({
      orders: orders.rows[0],
      users: users.rows[0],
      products: products.rows[0],
      revenue: revenue.rows[0]
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PRODUCT MANAGEMENT
// ============================================

// Get all products with filters
router.get('/products', async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryStr = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    
    if (status) {
      queryStr += ' AND p.status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (category) {
      queryStr += ' AND p.category_id = $' + (params.length + 1);
      params.push(category);
    }
    
    if (search) {
      queryStr += ' AND (p.name ILIKE $' + (params.length + 1) + ' OR p.description ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    queryStr += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryStr, params);
    
    res.json({
      products: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    const result = await query(`
      INSERT INTO products (
        name, slug, description, short_description, category_id,
        regular_price, extended_price, sale_price, sale_start_date, sale_end_date,
        featured_image, images, download_url, demo_url, documentation_url,
        version, download_limit, features, requirements, tags,
        status, is_featured, is_trending
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `, [
      productData.name, productData.slug, productData.description, productData.short_description,
      productData.category_id, productData.regular_price, productData.extended_price,
      productData.sale_price, productData.sale_start_date, productData.sale_end_date,
      productData.featured_image, JSON.stringify(productData.images), productData.download_url,
      productData.demo_url, productData.documentation_url, productData.version,
      productData.download_limit, JSON.stringify(productData.features),
      JSON.stringify(productData.requirements), JSON.stringify(productData.tags),
      productData.status, productData.is_featured, productData.is_trending
    ]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await query(
      `UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryStr = 'SELECT id, email, name, role, status, created_at, last_login_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      queryStr += ' AND role = $' + (params.length + 1);
      params.push(role);
    }
    
    if (status) {
      queryStr += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (search) {
      queryStr += ' AND (name ILIKE $' + (params.length + 1) + ' OR email ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    queryStr += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryStr, params);
    
    res.json({
      users: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    
    const result = await query(
      'UPDATE users SET role = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [role, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ORDER MANAGEMENT
// ============================================

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryStr = `
      SELECT o.*, u.name as customer_name, u.email as customer_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (status) {
      queryStr += ' AND o.status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (search) {
      queryStr += ' AND (o.order_number ILIKE $' + (params.length + 1) + ' OR u.name ILIKE $' + (params.length + 1) + ' OR u.email ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    queryStr += ' ORDER BY o.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryStr, params);
    
    res.json({
      orders: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Send email notification to customer
    const order = result.rows[0];
    const userResult = await query('SELECT * FROM users WHERE id = $1', [order.user_id]);
    
    if (userResult.rows.length > 0) {
      await sendEmail({
        to: userResult.rows[0].email,
        subject: `Order ${order.order_number} Status Updated`,
        template: 'order_status_update',
        data: {
          order_number: order.order_number,
          status: status,
          user_name: userResult.rows[0].name
        }
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process refund
router.post('/orders/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    
    // Update order status
    const result = await query(
      'UPDATE orders SET status = "refunded", refund_amount = $1, refund_reason = $2, refunded_at = NOW() WHERE id = $3 RETURNING *',
      [amount, reason, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // TODO: Process actual refund through payment gateway
    
    res.json({ message: 'Refund processed successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SUPPORT TICKET MANAGEMENT
// ============================================

// Get all support tickets
router.get('/support-tickets', async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryStr = `
      SELECT t.*, u.name as customer_name, u.email as customer_email 
      FROM support_tickets t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (status) {
      queryStr += ' AND t.status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (priority) {
      queryStr += ' AND t.priority = $' + (params.length + 1);
      params.push(priority);
    }
    
    queryStr += ' ORDER BY t.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryStr, params);
    
    res.json({
      tickets: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reply to support ticket
router.post('/support-tickets/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const adminId = req.user.id;
    
    // Add reply
    const replyResult = await query(`
      INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin_reply)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `, [id, adminId, message]);
    
    // Update ticket status
    await query(
      'UPDATE support_tickets SET status = "in_progress", updated_at = NOW() WHERE id = $1',
      [id]
    );
    
    // Get ticket and customer info
    const ticketResult = await query(`
      SELECT t.*, u.name as customer_name, u.email as customer_email
      FROM support_tickets t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);
    
    if (ticketResult.rows.length > 0) {
      const ticket = ticketResult.rows[0];
      
      // Send email to customer
      await sendEmail({
        to: ticket.customer_email,
        subject: `Support Ticket #${ticket.ticket_number} - New Reply`,
        template: 'support_reply',
        data: {
          customer_name: ticket.customer_name,
          ticket_number: ticket.ticket_number,
          message: message
        }
      });
    }
    
    res.json(replyResult.rows[0]);
  } catch (error) {
    console.error('Error replying to ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ANALYTICS
// ============================================

router.get('/analytics/overview', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch(period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get analytics data
    const [revenue, orders, customers, products] = await Promise.all([
      query(`
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as orders
        FROM orders 
        WHERE status = 'completed' 
          AND created_at >= $1 AND created_at <= $2
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [startDate, endDate]),
      
      query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded
        FROM orders
        WHERE created_at >= $1 AND created_at <= $2
      `, [startDate, endDate]),
      
      query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new
        FROM users
        WHERE role = 'customer'
      `, [startDate]),
      
      query(`
        SELECT 
          p.id, p.name, p.sales_count, p.views_count,
          COUNT(o.id) as recent_sales,
          SUM(o.total_amount) as revenue
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id 
          AND o.status = 'completed'
          AND o.created_at >= $1 AND o.created_at <= $2
        WHERE p.status = 'published'
        GROUP BY p.id
        ORDER BY recent_sales DESC
        LIMIT 10
      `, [startDate, endDate])
    ]);
    
    res.json({
      period,
      revenue: revenue.rows,
      orders: orders.rows[0],
      customers: customers.rows[0],
      topProducts: products.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SETTINGS MANAGEMENT
// ============================================

// Get all settings
router.get('/settings', async (req, res) => {
  try {
    const result = await query('SELECT * FROM settings');
    
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update settings
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
        [key, value]
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
