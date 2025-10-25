import React, { useEffect, useState } from 'react';
import {
  ToastWrapper,
  IconWrapper,
  ContentWrapper,
  ToastTitle,
  ToastMessage,
  CloseButton,
  ProgressBar,
} from './Toast.styles';
import { Icon } from '../../atoms/Icon';

export interface ToastProps {
  id: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  showProgress?: boolean;
}

const VARIANT_ICONS = {
  success: 'IconCircleCheck',
  error: 'IconCircleX',
  warning: 'IconAlertTriangle',
  info: 'IconInfoCircle',
};

/**
 * Toast notification component
 *
 * @example
 * <Toast
 *   id="toast-1"
 *   variant="success"
 *   title="Success"
 *   message="Operation completed successfully"
 *   duration={3000}
 *   onClose={(id) => removeToast(id)}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 3000,
  onClose,
  showProgress = true,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <ToastWrapper $variant={variant} $isExiting={isExiting} role="alert" aria-live="polite">
      <IconWrapper $variant={variant}>
        <Icon name={VARIANT_ICONS[variant]} size={20} />
      </IconWrapper>

      <ContentWrapper>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastMessage>{message}</ToastMessage>
      </ContentWrapper>

      <CloseButton onClick={handleClose} aria-label="Close notification">
        <Icon name="IconX" size={16} />
      </CloseButton>

      {showProgress && duration > 0 && <ProgressBar $duration={duration} />}
    </ToastWrapper>
  );
};
