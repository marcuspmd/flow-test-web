import React from 'react';
import { AlertWrapper, IconWrapper, ContentWrapper, AlertTitle, AlertMessage, CloseButton } from './Alert.styles';
import { Icon } from '../Icon';

export interface AlertProps {
  /**
   * Alert variant
   * @default 'info'
   */
  variant?: 'success' | 'error' | 'warning' | 'info';

  /**
   * Alert title (optional)
   */
  title?: string;

  /**
   * Alert message
   */
  children: React.ReactNode;

  /**
   * Show close button
   * @default false
   */
  closeable?: boolean;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;

  /**
   * Custom icon (overrides default variant icon)
   */
  icon?: React.ReactNode;

  className?: string;
}

const VARIANT_ICONS = {
  success: 'IconCircleCheck',
  error: 'IconCircleX',
  warning: 'IconAlertTriangle',
  info: 'IconInfoCircle',
};

/**
 * Alert component for inline messages and notifications
 *
 * @example
 * <Alert variant="success" title="Success">
 *   Your changes have been saved.
 * </Alert>
 *
 * @example
 * <Alert variant="error" closeable onClose={() => setError(null)}>
 *   An error occurred while processing your request.
 * </Alert>
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  closeable = false,
  onClose,
  icon,
  className,
}) => {
  return (
    <AlertWrapper $variant={variant} className={className} role="alert">
      <IconWrapper>{icon || <Icon name={VARIANT_ICONS[variant]} size={20} />}</IconWrapper>

      <ContentWrapper>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertMessage>{children}</AlertMessage>
      </ContentWrapper>

      {closeable && onClose && (
        <CloseButton onClick={onClose} aria-label="Close alert">
          <Icon name="IconX" size={16} />
        </CloseButton>
      )}
    </AlertWrapper>
  );
};
