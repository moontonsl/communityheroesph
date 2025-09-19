import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

export function ToastItem({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 100);
        
        // Auto remove after duration
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [toast.id, toast.duration, onRemove]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'border-l-4 border-l-green-400';
            case 'error':
                return 'border-l-4 border-l-red-400';
            default:
                return 'border-l-4 border-l-blue-400';
        }
    };

    return (
        <div
            className={`
                transform transition-all duration-300 ease-in-out pointer-events-auto
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                w-96 max-w-sm shadow-xl rounded-lg border border-gray-200 bg-white
                ${getStyles()}
            `}
        >
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                            {toast.title}
                        </p>
                        {toast.message && (
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                {toast.message}
                            </p>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            className="inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (title: string, message?: string) => {
        addToast({ type: 'success', title, message });
    };

    const showError = (title: string, message?: string) => {
        addToast({ type: 'error', title, message });
    };

    const showInfo = (title: string, message?: string) => {
        addToast({ type: 'info', title, message });
    };

    return {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
    };
} 