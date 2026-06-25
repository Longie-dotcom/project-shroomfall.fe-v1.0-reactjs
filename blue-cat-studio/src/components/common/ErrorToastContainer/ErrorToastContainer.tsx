import React, { useState, useEffect } from 'react';
import { toastBus, type ToastEventData } from '../../../api/handlers/error/errorEvent';
import styles from './ErrorToastContainer.module.css';

export const ErrorToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastEventData[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe((newToast) => {
      setToasts((prev) => {
        if (prev.some((t) => t.error.code === newToast.error.code && t.error.message === newToast.error.message)) {
          return prev;
        }
        return [...prev, newToast];
      });
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={removeToast} 
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastEventData;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className={styles.toast}>
      <div className={styles.header}>
        <span className={styles.title}>
          ✕ {toast.error.type}
        </span>
        <button onClick={() => onClose(toast.id)} className={styles.closeButton}>
          ×
        </button>
      </div>

      <p className={styles.message}>
        {toast.error.message}
      </p>

      <span className={styles.code}>
        Code: {toast.error.code}
      </span>
    </div>
  );
};