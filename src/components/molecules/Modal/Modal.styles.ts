import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const ModalOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
  opacity: ${({ $isClosing }) => ($isClosing ? 0 : 1)};
  transition: opacity 0.2s ease;
`;

export const ModalContainer = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'xl'; $isClosing?: boolean }>`
  background: ${({ theme }) => theme['sidebar-background']};
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  animation: ${slideUp} 0.2s ease;
  transform: ${({ $isClosing }) => ($isClosing ? 'translateY(20px)' : 'translateY(0)')};
  opacity: ${({ $isClosing }) => ($isClosing ? 0 : 1)};
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return 'max-width: 400px;';
      case 'md':
        return 'max-width: 600px;';
      case 'lg':
        return 'max-width: 800px;';
      case 'xl':
        return 'max-width: 1200px;';
    }
  }}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['table-stripe']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: ${({ theme }) => theme['primary-text']};
`;

export const ModalFooter = styled.div<{ $align?: 'left' | 'center' | 'right' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;

  ${({ $align = 'right' }) => {
    switch ($align) {
      case 'left':
        return 'justify-content: flex-start;';
      case 'center':
        return 'justify-content: center;';
      case 'right':
        return 'justify-content: flex-end;';
    }
  }}
`;
