import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from './Modal.styles';
import { Icon } from '../../atoms/Icon';

export interface ModalProps {
  /**
   * Controls modal visibility
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal body content
   */
  children: React.ReactNode;

  /**
   * Footer content (typically buttons)
   */
  footer?: React.ReactNode;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Footer alignment
   * @default 'right'
   */
  footerAlign?: 'left' | 'center' | 'right';

  /**
   * Show close button in header
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close modal when clicking overlay
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close modal when pressing ESC
   * @default true
   */
  closeOnEsc?: boolean;

  className?: string;
}

/**
 * Modal dialog component with portal rendering
 *
 * @example
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={onCancel}>Cancel</Button>
 *       <Button variant="primary" onClick={onConfirm}>Confirm</Button>
 *     </>
 *   }
 * >
 *   Are you sure you want to proceed?
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  footerAlign = 'right',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <ModalOverlay ref={overlayRef} onClick={handleOverlayClick} $isClosing={isClosing}>
      <ModalContainer $size={size} $isClosing={isClosing} className={className} role="dialog" aria-modal="true">
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseButton && (
              <ModalCloseButton onClick={handleClose} aria-label="Close modal">
                <Icon name="IconX" size={20} />
              </ModalCloseButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter $align={footerAlign}>{footer}</ModalFooter>}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};
