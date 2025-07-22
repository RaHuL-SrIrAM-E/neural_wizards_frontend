import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastType } from '../types';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'error':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'info':
      default:
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`${getColors()} backdrop-blur-xl border rounded-xl p-4 min-w-80 shadow-lg`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <span className="text-white text-sm font-medium flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;