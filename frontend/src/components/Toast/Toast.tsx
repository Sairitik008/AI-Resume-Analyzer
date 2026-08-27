import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.scss';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let _id = 0;

const ICONS: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = ++_id;
        setToasts((prev) => [...prev, { id, message, variant }]);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: number) =>
        setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.container} aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`${styles.toast} ${styles[t.variant]}`} role="alert">
                        <span className={styles.icon}>{ICONS[t.variant]}</span>
                        <span>{t.message}</span>
                        <button className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};
