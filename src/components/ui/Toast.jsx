import { useEffect } from 'react';
import { useUIStore } from '../../store/useStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => hideToast(), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const toastConfig = {
    success: {
      bg: 'bg-green-500',
      border: 'border-green-400',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bg: 'bg-red-500',
      border: 'border-red-400',
      icon: XCircle,
      iconColor: 'text-white'
    },
    warning: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-400',
      icon: AlertTriangle,
      iconColor: 'text-white'
    },
    info: {
      bg: 'bg-blue-500',
      border: 'border-blue-400',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`${config.bg} ${config.border} border text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-[500px]`}
      >
        <Icon size={20} className={config.iconColor} />
        <span className="font-medium flex-1 text-sm leading-relaxed">
          {toast.message}
        </span>
        <button
          onClick={hideToast}
          className="ml-2 text-white hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
