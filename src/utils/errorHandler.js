import { toast, showSuccess, showError, showInfo, showWarning } from './notifications';

/**
 * Comprehensive error handler for the entire application
 */
export class ErrorHandler {
  /**
   * Handle Supabase errors with user-friendly messages
   */
  static handleSupabaseError(error, context = '') {
    console.error(`Supabase Error ${context}:`, error);
    
    // Common Supabase error codes and their user-friendly messages
    const errorMessages = {
      // Authentication errors
      'invalid_credentials': 'Invalid email or password. Please try again.',
      'email_not_confirmed': 'Please check your email and click the confirmation link.',
      'signup_disabled': 'New user registration is currently disabled.',
      'email_address_invalid': 'Please enter a valid email address.',
      'password_too_short': 'Password must be at least 6 characters long.',
      'weak_password': 'Password is too weak. Please use a stronger password.',
      'user_already_registered': 'An account with this email already exists.',
      
      // Database errors
      '23505': 'This record already exists. Please use different values.',
      '23503': 'Cannot delete this record because it is being used elsewhere.',
      '23502': 'Required field is missing. Please fill in all required fields.',
      '42703': 'Database column does not exist. Please contact support.',
      '42P01': 'Database table does not exist. Please contact support.',
      
      // Permission errors
      'insufficient_privileges': 'You do not have permission to perform this action.',
      'row_level_security_violation': 'Access denied. You can only access your own data.',
      
      // Network errors
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      
      // Generic errors
      'PGRST200': 'Database relationship error. Please contact support.',
      'PGRST116': 'No data found matching your request.',
    };

    // Get user-friendly message
    let userMessage = errorMessages[error.code] || 
                     errorMessages[error.message] || 
                     error.message;

    // Add context if provided
    if (context) {
      userMessage = `${context}: ${userMessage}`;
    }

    // Show error notification
    showError(userMessage);

    return {
      code: error.code,
      message: userMessage,
      originalError: error
    };
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(errors, context = 'Validation failed') {
    console.error('Validation Error:', errors);
    
    if (Array.isArray(errors)) {
      // Multiple validation errors
      const errorList = errors.map(err => `• ${err}`).join(', ');
      showError(`${context}: ${errorList}`);
    } else if (typeof errors === 'object') {
      // Object with field errors
      const errorList = Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
      showError(`${context}: ${errorList}`);
    } else {
      // Single error message
      showError(`${context}: ${errors}`);
    }
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error, context = '') {
    console.error(`Network Error ${context}:`, error);
    
    let message = 'Network error occurred. Please check your connection and try again.';
    
    if (error.name === 'AbortError') {
      message = 'Request was cancelled. Please try again.';
    } else if (error.message?.includes('fetch')) {
      message = 'Unable to connect to server. Please check your internet connection.';
    }

    toast.error(context ? `${context}: ${message}` : message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FEF2F2',
        color: '#DC2626',
      },
    });
  }

  /**
   * Handle generic application errors
   */
  static handleError(error, context = '') {
    console.error(`Application Error ${context}:`, error);
    
    // Check if it's a Supabase error
    if (error.code || error.message?.includes('supabase')) {
      return this.handleSupabaseError(error, context);
    }
    
    // Check if it's a network error
    if (error.name === 'TypeError' && error.message?.includes('fetch')) {
      return this.handleNetworkError(error, context);
    }
    
    // Generic error handling
    const message = error.message || 'An unexpected error occurred. Please try again.';
    showError(context ? `${context}: ${message}` : message);
    
    return {
      message,
      originalError: error
    };
  }

  /**
   * Show success message
   */
  static showSuccess(message, _options = {}) {
    showSuccess(message);
  }

  /**
   * Show info message
   */
  static showInfo(message, _options = {}) {
    showInfo(message);
  }

  /**
   * Show warning message
   */
  static showWarning(message, _options = {}) {
    showWarning(message);
  }

  /**
   * Async wrapper for database operations
   */
  static async executeWithErrorHandling(operation, context = '') {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      const handledError = this.handleError(error, context);
      return { success: false, error: handledError };
    }
  }

  /**
   * Validate required fields
   */
  static validateRequired(data, requiredFields) {
    const errors = {};
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: this.getPasswordStrength(password)
    };
  }

  /**
   * Get password strength score
   */
  static getPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }
}

// Export convenience functions
export const handleError = ErrorHandler.handleError.bind(ErrorHandler);
export const handleSupabaseError = ErrorHandler.handleSupabaseError.bind(ErrorHandler);
export { showSuccess, showError, showWarning, showInfo } from './notifications';
export const executeWithErrorHandling = ErrorHandler.executeWithErrorHandling.bind(ErrorHandler);
