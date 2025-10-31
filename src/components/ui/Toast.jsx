import { useEffect } from 'react';
import { useUIStore } from '../../store/useStore';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => hideToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`${bgColors[toast.type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}
      >
        <span className="text-2xl">
          {toast.type === 'success' && '✓'}
          {toast.type === 'error' && '✕'}
          {toast.type === 'warning' && '⚠'}
          {toast.type === 'info' && 'ℹ'}
        </span>
        <span className="font-medium">{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-auto text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
