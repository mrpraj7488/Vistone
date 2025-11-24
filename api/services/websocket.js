const jwt = require('jsonwebtoken');
const { query } = require('./database');

// ============================================
// WEBSOCKET SERVICE
// ============================================

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map();
    this.adminClients = new Set();
    this.userClients = new Map(); // userId -> socket
  }

  initialize(io) {
    this.io = io;
    this.setupEventHandlers();
    console.log('✅ WebSocket service initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Handle authentication
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Get user details
          const userResult = await query(
            'SELECT id, email, name, role, status FROM users WHERE id = $1',
            [decoded.user_id]
          );
          
          if (userResult.rows.length === 0 || userResult.rows[0].status !== 'active') {
            socket.emit('authentication_error', { error: 'Invalid user' });
            return;
          }
          
          const user = userResult.rows[0];
          
          // Store user info in socket
          socket.userId = user.id;
          socket.userRole = user.role;
          socket.userEmail = user.email;
          socket.userName = user.name;
          
          // Add to connected clients
          this.connectedClients.set(socket.id, {
            socket,
            userId: user.id,
            role: user.role,
            connectedAt: new Date()
          });
          
          // Add to role-specific collections
          if (user.role === 'admin' || user.role === 'support' || user.role === 'editor') {
            this.adminClients.add(socket);
            socket.join('admin');
          }
          
          // Add to user-specific collection
          this.userClients.set(user.id, socket);
          socket.join(`user:${user.id}`);
          
          // Join role-based rooms
          socket.join(`role:${user.role}`);
          
          socket.emit('authenticated', { 
            success: true, 
            user: {
              id: user.id,
              name: user.name,
              role: user.role
            }
          });
          
          // Update last seen
          await this.updateUserLastSeen(user.id);
          
          console.log(`User authenticated: ${user.name} (${user.role})`);
          
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('authentication_error', { error: 'Invalid token' });
        }
      });
      
      // Handle user-specific events
      socket.on('join_room', (room) => {
        if (socket.userId) {
          socket.join(room);
          console.log(`User ${socket.userId} joined room: ${room}`);
        }
      });
      
      socket.on('leave_room', (room) => {
        if (socket.userId) {
          socket.leave(room);
          console.log(`User ${socket.userId} left room: ${room}`);
        }
      });
      
      // Handle admin-specific events
      socket.on('admin_broadcast', (data) => {
        if (socket.userRole === 'admin') {
          this.broadcastToAdmins('admin_message', data);
        }
      });
      
      // Handle support ticket events
      socket.on('join_ticket', (ticketId) => {
        if (socket.userRole === 'admin' || socket.userRole === 'support') {
          socket.join(`ticket:${ticketId}`);
        }
      });
      
      socket.on('ticket_typing', (data) => {
        if (socket.userId) {
          socket.to(`ticket:${data.ticketId}`).emit('user_typing', {
            userId: socket.userId,
            userName: socket.userName,
            isTyping: data.isTyping
          });
        }
      });
      
      // Handle order events
      socket.on('track_order', (orderId) => {
        if (socket.userId) {
          socket.join(`order:${orderId}`);
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);
        
        if (socket.userId) {
          // Remove from collections
          this.connectedClients.delete(socket.id);
          this.userClients.delete(socket.userId);
          this.adminClients.delete(socket);
          
          // Update last seen
          await this.updateUserLastSeen(socket.userId);
          
          console.log(`User disconnected: ${socket.userId}`);
        }
      });
      
      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // ============================================
  // NOTIFICATION METHODS
  // ============================================

  // Send notification to specific user
  async notifyUser(userId, event, data) {
    const socket = this.userClients.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
    
    // Also store notification in database
    await this.storeNotification(userId, event, data);
  }

  // Send notification to all admin users
  broadcastToAdmins(event, data) {
    this.io.to('admin').emit(event, data);
  }

  // Send notification to users with specific role
  broadcastToRole(role, event, data) {
    this.io.to(`role:${role}`).emit(event, data);
  }

  // Send notification to all connected users
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  // ============================================
  // ORDER EVENTS
  // ============================================

  async notifyNewOrder(order) {
    // Notify admins
    this.broadcastToAdmins('order:new', {
      order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      product_name: order.product_name,
      total_amount: order.total_amount,
      created_at: order.created_at
    });

    // Notify customer
    await this.notifyUser(order.user_id, 'order:placed', {
      order_id: order.id,
      order_number: order.order_number,
      product_name: order.product_name,
      total_amount: order.total_amount,
      status: order.status
    });
  }

  async notifyOrderStatusChange(order, oldStatus) {
    // Notify customer
    await this.notifyUser(order.user_id, 'order:status_changed', {
      order_id: order.id,
      order_number: order.order_number,
      old_status: oldStatus,
      new_status: order.status,
      product_name: order.product_name
    });

    // Notify admins if significant status change
    if (['completed', 'refunded', 'cancelled'].includes(order.status)) {
      this.broadcastToAdmins('order:updated', {
        order_id: order.id,
        order_number: order.order_number,
        status: order.status,
        customer_name: order.customer_name
      });
    }
  }

  async notifyOrderRefund(order) {
    // Notify customer
    await this.notifyUser(order.user_id, 'order:refunded', {
      order_id: order.id,
      order_number: order.order_number,
      product_name: order.product_name,
      refund_amount: order.refund_amount,
      refund_reason: order.refund_reason
    });

    // Notify admins
    this.broadcastToAdmins('order:refunded', {
      order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      refund_amount: order.refund_amount
    });
  }

  // ============================================
  // SUPPORT EVENTS
  // ============================================

  async notifyNewTicket(ticket, user) {
    // Notify support team
    this.broadcastToRole('support', 'ticket:new', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      subject: ticket.subject,
      priority: ticket.priority,
      category: ticket.category,
      customer_name: user.name,
      customer_email: user.email,
      created_at: ticket.created_at
    });

    // Notify admins
    this.broadcastToAdmins('ticket:new', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      subject: ticket.subject,
      priority: ticket.priority,
      customer_name: user.name
    });
  }

  async notifyTicketReply(ticket, message, isFromSupport = false) {
    if (isFromSupport) {
      // Notify customer
      await this.notifyUser(ticket.user_id, 'support:reply', {
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        message: message.message,
        replied_at: message.created_at
      });
    } else {
      // Notify support team
      this.broadcastToRole('support', 'ticket:customer_reply', {
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        customer_name: ticket.customer_name,
        message: message.message
      });
    }

    // Notify users in ticket room
    this.io.to(`ticket:${ticket.id}`).emit('ticket:message', {
      ticket_id: ticket.id,
      message: {
        id: message.id,
        message: message.message,
        user_name: message.user_name,
        is_customer_message: message.is_customer_message,
        created_at: message.created_at
      }
    });
  }

  async notifyTicketStatusChange(ticket, oldStatus) {
    // Notify customer
    await this.notifyUser(ticket.user_id, 'ticket:status_changed', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      old_status: oldStatus,
      new_status: ticket.status,
      subject: ticket.subject
    });

    // Notify support team
    this.broadcastToRole('support', 'ticket:status_updated', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      status: ticket.status,
      customer_name: ticket.customer_name
    });
  }

  // ============================================
  // PRODUCT EVENTS
  // ============================================

  async notifyProductSold(product, order) {
    // Notify admins
    this.broadcastToAdmins('product:sold', {
      product_id: product.id,
      product_name: product.name,
      order_id: order.id,
      customer_name: order.customer_name,
      license_type: order.license_type,
      amount: order.total_amount
    });
  }

  async notifyProductUpdate(product, affectedUsers) {
    // Notify all users who purchased this product
    for (const user of affectedUsers) {
      await this.notifyUser(user.id, 'product:updated', {
        product_id: product.id,
        product_name: product.name,
        version: product.version,
        changelog: product.changelog || 'Bug fixes and improvements'
      });
    }
  }

  // ============================================
  // REVIEW EVENTS
  // ============================================

  async notifyNewReview(review, product, user) {
    // Notify admins
    this.broadcastToAdmins('review:new', {
      review_id: review.id,
      product_id: product.id,
      product_name: product.name,
      customer_name: user.name,
      rating: review.rating,
      title: review.title,
      created_at: review.created_at
    });
  }

  async notifyReviewReply(review, product, reply) {
    // Notify customer
    await this.notifyUser(review.user_id, 'review:reply', {
      review_id: review.id,
      product_name: product.name,
      reply: reply,
      replied_at: new Date()
    });
  }

  // ============================================
  // USER EVENTS
  // ============================================

  async notifyNewUser(user) {
    // Notify admins
    this.broadcastToAdmins('user:registered', {
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });
  }

  async notifyUserSuspended(user) {
    // Notify user if connected
    await this.notifyUser(user.id, 'account:suspended', {
      reason: 'Your account has been suspended. Please contact support for more information.'
    });

    // Force disconnect user
    const socket = this.userClients.get(user.id);
    if (socket) {
      socket.disconnect(true);
    }
  }

  // ============================================
  // SYSTEM EVENTS
  // ============================================

  broadcastSystemAlert(message, level = 'info') {
    this.broadcastToAll('system:alert', {
      message,
      level,
      timestamp: new Date()
    });
  }

  broadcastMaintenanceMode(enabled, message) {
    this.broadcastToAll('system:maintenance', {
      enabled,
      message,
      timestamp: new Date()
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async updateUserLastSeen(userId) {
    try {
      await query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error updating user last seen:', error);
    }
  }

  async storeNotification(userId, type, data) {
    try {
      await query(`
        INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        userId,
        type,
        data.title || 'Notification',
        data.message || JSON.stringify(data),
        data.related_id || null,
        data.related_type || null
      ]);
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  getConnectedUsers() {
    return Array.from(this.connectedClients.values()).map(client => ({
      userId: client.userId,
      role: client.role,
      connectedAt: client.connectedAt
    }));
  }

  getAdminCount() {
    return this.adminClients.size;
  }

  getUserCount() {
    return this.userClients.size;
  }

  isUserOnline(userId) {
    return this.userClients.has(userId);
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  getHealthStatus() {
    return {
      connected_clients: this.connectedClients.size,
      admin_clients: this.adminClients.size,
      user_clients: this.userClients.size,
      uptime: process.uptime(),
      memory_usage: process.memoryUsage()
    };
  }
}

// ============================================
// NOTIFICATION SERVICE
// ============================================

class NotificationService {
  constructor(webSocketService) {
    this.wsService = webSocketService;
  }

  async createNotification(userId, type, data) {
    const notification = {
      id: this.generateId(),
      user_id: userId,
      type,
      title: data.title,
      message: data.message,
      action_url: data.action_url,
      action_label: data.action_label,
      related_id: data.related_id,
      related_type: data.related_type,
      is_read: false,
      created_at: new Date()
    };

    // Store in database
    await query(`
      INSERT INTO notifications (
        user_id, type, title, message, action_url, action_label,
        related_id, related_type, is_read
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      notification.user_id,
      notification.type,
      notification.title,
      notification.message,
      notification.action_url,
      notification.action_label,
      notification.related_id,
      notification.related_type,
      notification.is_read
    ]);

    // Send real-time notification
    await this.wsService.notifyUser(userId, 'notification:new', notification);

    return notification;
  }

  generateId() {
    return require('crypto').randomUUID();
  }
}

// ============================================
// INITIALIZE AND EXPORT
// ============================================

const webSocketService = new WebSocketService();
const notificationService = new NotificationService(webSocketService);

module.exports = {
  webSocketService,
  notificationService,
  initializeWebSocket: (io) => webSocketService.initialize(io)
};
