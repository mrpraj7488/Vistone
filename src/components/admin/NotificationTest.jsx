import React from 'react';
import { toast } from '../../utils/notifications';
import { ErrorHandler } from '../../utils/errorHandler';

const NotificationTest = () => {
  const testSuccess = () => {
    toast.success('✅ User saved successfully! All changes have been applied.');
  };

  const testError = () => {
    toast.error('❌ Failed to save user. Please check your internet connection and try again.');
  };

  const testWarning = () => {
    toast.warning('⚠️ Some fields are missing. Please fill in all required information.');
  };

  const testInfo = () => {
    toast.info('ℹ️ Settings have been updated. Changes will take effect after refresh.');
  };

  const testSupabaseError = () => {
    const mockError = {
      code: '23505',
      message: 'duplicate key value violates unique constraint'
    };
    ErrorHandler.handleSupabaseError(mockError, 'Creating user');
  };

  const testValidationError = () => {
    const errors = {
      email: 'Email is required',
      password: 'Password must be at least 6 characters'
    };
    ErrorHandler.handleValidationError(errors, 'Form validation failed');
  };

  const testPromiseSuccess = () => {
    const mockPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ id: 1, name: 'Test User' }), 2000);
    });

    toast.promise(mockPromise, {
      loading: 'Creating user...',
      success: 'User created successfully!',
      error: 'Failed to create user'
    });
  };

  const testPromiseError = () => {
    const mockPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network error')), 2000);
    });

    toast.promise(mockPromise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes'
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🧪 Notification System Test
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Test all notification types to ensure they're working correctly across the admin panel.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={testSuccess}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ✅ Success
        </button>
        
        <button
          onClick={testError}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ❌ Error
        </button>
        
        <button
          onClick={testWarning}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⚠️ Warning
        </button>
        
        <button
          onClick={testInfo}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ℹ️ Info
        </button>
        
        <button
          onClick={testSupabaseError}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🔧 DB Error
        </button>
        
        <button
          onClick={testValidationError}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📝 Validation
        </button>
        
        <button
          onClick={testPromiseSuccess}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⏳ Promise ✅
        </button>
        
        <button
          onClick={testPromiseError}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⏳ Promise ❌
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Expected Behavior:
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Notifications should appear in bottom-right corner</li>
          <li>• Each type should have appropriate color and icon</li>
          <li>• Notifications should auto-dismiss after 4 seconds</li>
          <li>• Click X button should dismiss immediately</li>
          <li>• Promise notifications should show loading → result</li>
          <li>• Multiple notifications should not overlap</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTest;
