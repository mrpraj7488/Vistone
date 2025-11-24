// Notification Service for managing in-app notifications
class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = new Set();
    this.unreadCount = 0;
    this.maxNotifications = 100;
  }

  // Initialize the service
  init() {
    // Load notifications from localStorage if available
    this.loadFromStorage();
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanup();
    }, 60000); // Clean up every minute
  }

  // Add a new notification
  add(notification) {
    const newNotification = {
      id: this.generateId(),
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'info', // info, success, warning, error
      timestamp: Date.now(),
      read: false,
      data: notification.data || {},
      ...notification
    };

    this.notifications.unshift(newNotification);
    
    if (!newNotification.read) {
      this.unreadCount++;
    }

    // Limit the number of stored notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    this.saveToStorage();
    this.notifyListeners();
    
    // Show browser notification if permitted
    if (notification.showBrowserNotification) {
      this.showBrowserNotification(newNotification);
    }

    return newNotification;
  }

  // Get all notifications
  getAll() {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnread() {
    return this.notifications.filter(n => !n.read);
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => {
      n.read = true;
    });
    this.unreadCount = 0;
    this.saveToStorage();
    this.notifyListeners();
  }

  // Delete a notification
  delete(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      const notification = this.notifications[index];
      if (!notification.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this.saveToStorage();
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    const state = {
      notifications: this.getAll(),
      unreadCount: this.unreadCount
    };
    
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Generate unique ID
  generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify({
        notifications: this.notifications,
        unreadCount: this.unreadCount
      }));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.unreadCount = data.unreadCount || 0;
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  }

  // Clean up old notifications
  cleanup() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const beforeCleanup = this.notifications.length;
    
    this.notifications = this.notifications.filter(n => {
      // Keep unread notifications
      if (!n.read) return true;
      // Keep recent notifications
      if (n.timestamp > oneWeekAgo) return true;
      // Keep important notifications
      if (n.type === 'error' || n.type === 'warning') return true;
      return false;
    });

    if (this.notifications.length !== beforeCleanup) {
      this.saveToStorage();
    }
  }

  // Show browser notification
  async showBrowserNotification(notification) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        timestamp: notification.timestamp,
        requireInteraction: notification.type === 'error'
      });

      browserNotif.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        browserNotif.close();
      };

      // Auto close after 5 seconds for non-error notifications
      if (notification.type !== 'error') {
        setTimeout(() => browserNotif.close(), 5000);
      }
    }
  }

  // Request browser notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Get notification permission status
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  // Get all notifications (alias for getAll)
  getNotifications() {
    return this.getAll();
  }

  // Get unread count
  getUnreadCount() {
    return this.unreadCount;
  }

  // Clear notifications (alias for clearAll)
  clear() {
    return this.clearAll();
  }

  // Get notification statistics
  getStats() {
    const all = this.notifications;
    const unread = all.filter(n => !n.read);
    const byType = {};
    const categories = {};
    
    // Count by type
    all.forEach(n => {
      const type = n.type || 'info';
      byType[type] = (byType[type] || 0) + 1;
      
      // Count by category
      const category = n.category || 'general';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
      total: all.length,
      unread: unread.length,
      read: all.length - unread.length,
      byType,
      categories,
      latest: all[0] || null,
      oldest: all[all.length - 1] || null
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Initialize on load
if (typeof window !== 'undefined') {
  notificationService.init();
}

export default notificationService;
