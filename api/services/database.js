const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// ============================================
// SUPABASE DATABASE SERVICE
// ============================================

class DatabaseService {
  constructor() {
    this.supabase = null;
    this.pool = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Initialize Supabase client
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // Initialize PostgreSQL pool for direct queries
      this.pool = new Pool({
        connectionString: process.env.SUPABASE_DB_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.initialized = true;
      console.log('✅ Supabase database connected');
      
      // Setup real-time subscriptions
      await this.setupRealtimeSubscriptions();
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async setupRealtimeSubscriptions() {
    try {
      // Subscribe to order changes for real-time notifications
      this.supabase
        .channel('orders')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            this.handleNewOrder(payload.new);
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          (payload) => {
            this.handleOrderUpdate(payload.new, payload.old);
          }
        )
        .subscribe();

      // Subscribe to support ticket changes
      this.supabase
        .channel('support_tickets')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'support_tickets' },
          (payload) => {
            this.handleNewTicket(payload.new);
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'support_tickets' },
          (payload) => {
            this.handleTicketUpdate(payload.new, payload.old);
          }
        )
        .subscribe();

      // Subscribe to new user registrations
      this.supabase
        .channel('users')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'users' },
          (payload) => {
            this.handleNewUser(payload.new);
          }
        )
        .subscribe();

      console.log('✅ Real-time subscriptions setup complete');
    } catch (error) {
      console.error('❌ Failed to setup real-time subscriptions:', error);
    }
  }

  // Handle real-time events
  async handleNewOrder(order) {
    const { webSocketService } = require('./websocket');
    if (webSocketService) {
      await webSocketService.notifyNewOrder(order);
    }
  }

  async handleOrderUpdate(newOrder, oldOrder) {
    const { webSocketService } = require('./websocket');
    if (webSocketService && newOrder.status !== oldOrder.status) {
      await webSocketService.notifyOrderStatusChange(newOrder, oldOrder.status);
    }
  }

  async handleNewTicket(ticket) {
    const { webSocketService } = require('./websocket');
    if (webSocketService) {
      // Get user details
      const user = await this.query('SELECT * FROM users WHERE id = $1', [ticket.user_id]);
      if (user.rows.length > 0) {
        await webSocketService.notifyNewTicket(ticket, user.rows[0]);
      }
    }
  }

  async handleTicketUpdate(newTicket, oldTicket) {
    const { webSocketService } = require('./websocket');
    if (webSocketService && newTicket.status !== oldTicket.status) {
      await webSocketService.notifyTicketStatusChange(newTicket, oldTicket.status);
    }
  }

  async handleNewUser(user) {
    const { webSocketService } = require('./websocket');
    if (webSocketService) {
      await webSocketService.notifyNewUser(user);
    }
  }

  // Query method for direct SQL queries
  async query(text, params = []) {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Query executed:', { text, duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', { text, params, error: error.message });
      throw error;
    }
  }

  // Supabase client methods
  getSupabaseClient() {
    return this.supabase;
  }

  // Transaction support
  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time, version() as version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version,
        pool_total: this.pool.totalCount,
        pool_idle: this.pool.idleCount,
        pool_waiting: this.pool.waitingCount
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Cleanup
  async close() {
    if (this.pool) {
      await this.pool.end();
    }
    if (this.supabase) {
      // Supabase client doesn't need explicit cleanup
    }
    this.initialized = false;
    console.log('Database connections closed');
  }
}

// ============================================
// SUPABASE AUTH INTEGRATION
// ============================================

class SupabaseAuthService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async createUser(email, password, userData = {}) {
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userData
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const { data, error } = await this.supabase.auth.admin.updateUserById(
        userId,
        updates
      );

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const { error } = await this.supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const { data, error } = await this.supabase.auth.admin.getUserById(userId);
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async listUsers(page = 1, perPage = 1000) {
    try {
      const { data, error } = await this.supabase.auth.admin.listUsers({
        page,
        perPage
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  async generateLink(type, email, options = {}) {
    try {
      const { data, error } = await this.supabase.auth.admin.generateLink({
        type, // 'signup', 'invite', 'magiclink', 'recovery', 'email_change_current', 'email_change_new'
        email,
        ...options
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating link:', error);
      throw error;
    }
  }
}

// ============================================
// INITIALIZE AND EXPORT
// ============================================

const databaseService = new DatabaseService();

module.exports = {
  databaseService,
  SupabaseAuthService,
  initializeDatabase: () => databaseService.initialize(),
  query: (text, params) => databaseService.query(text, params),
  getSupabaseClient: () => databaseService.getSupabaseClient(),
  transaction: (callback) => databaseService.transaction(callback),
  healthCheck: () => databaseService.healthCheck()
};
