/**
 * Simple toast notification system
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

const TOAST_DURATION = 3000;

let toastContainer: HTMLDivElement | null = null;

const getToastContainer = (): HTMLDivElement => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToastElement = (options: ToastOptions): HTMLDivElement => {
  const toast = document.createElement('div');
  const { message, type = 'info' } = options;

  const colors = {
    success: { bg: '#10b981', text: '#ffffff' },
    error: { bg: '#ef4444', text: '#ffffff' },
    info: { bg: '#3b82f6', text: '#ffffff' },
    warning: { bg: '#f59e0b', text: '#ffffff' },
  };

  const color = colors[type];

  toast.style.cssText = `
    background: ${color.bg};
    color: ${color.text};
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    max-width: 400px;
    word-wrap: break-word;
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  toast.innerHTML = `
    <span style="font-size: 18px; font-weight: bold;">${icons[type]}</span>
    <span>${message}</span>
  `;

  return toast;
};

export const showToast = (options: ToastOptions): void => {
  const container = getToastContainer();
  const toast = createToastElement(options);
  const duration = options.duration || TOAST_DURATION;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }, duration);
};

export const showSuccess = (message: string): void => {
  showToast({ message, type: 'success' });
};

export const showError = (message: string): void => {
  showToast({ message, type: 'error' });
};

export const showInfo = (message: string): void => {
  showToast({ message, type: 'info' });
};

export const showWarning = (message: string): void => {
  showToast({ message, type: 'warning' });
};

// Add animations to document if not already present
if (typeof document !== 'undefined') {
  const styleId = 'toast-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
