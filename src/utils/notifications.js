// Unified notification system for the entire application
import { useUIStore } from '../store/useStore';

class NotificationManager {
  constructor() {
    this.store = null;
  }

  // Initialize with the store
  init() {
    this.store = useUIStore.getState();
  }

  // Success notification
  success(message, _options = {}) {
    const { showToast } = useUIStore.getState();
    showToast(message, 'success');
    console.log('✅ Success:', message);
  }

  // Error notification
  error(message, _options = {}) {
    const { showToast } = useUIStore.getState();
    showToast(message, 'error');
    console.error('❌ Error:', message);
  }

  // Warning notification
  warning(message, _options = {}) {
    const { showToast } = useUIStore.getState();
    showToast(message, 'warning');
    console.warn('⚠️ Warning:', message);
  }

  // Info notification
  info(message, _options = {}) {
    const { showToast } = useUIStore.getState();
    showToast(message, 'info');
    console.info('ℹ️ Info:', message);
  }

  // Loading notification (for long operations)
  loading(message) {
    const { showToast } = useUIStore.getState();
    showToast(message, 'info');
    console.log('⏳ Loading:', message);
  }

  // Hide current notification
  hide() {
    const { hideToast } = useUIStore.getState();
    hideToast();
  }
}

// Create singleton instance
const notifications = new NotificationManager();

// Export individual functions for convenience
export const showSuccess = (message, options) => notifications.success(message, options);
export const showError = (message, options) => notifications.error(message, options);
export const showWarning = (message, options) => notifications.warning(message, options);
export const showInfo = (message, options) => notifications.info(message, options);
export const showLoading = (message) => notifications.loading(message);
export const hideNotification = () => notifications.hide();

// Export the manager instance
export default notifications;

// Create a toast object that mimics react-hot-toast API for compatibility
export const toast = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  dismiss: hideNotification,
  
  // Promise-based notifications for async operations
  promise: async (promise, messages) => {
    const { loading, success, error } = messages;
    
    showLoading(loading);
    
    try {
      const result = await promise;
      showSuccess(success);
      return result;
    } catch (err) {
      showError(error || err.message);
      throw err;
    }
  }
};

// React hook for using notifications in components
export const useNotifications = () => {
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    hide: hideNotification,
    toast
  };
};
