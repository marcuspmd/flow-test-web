import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

export const ToastWrapper = styled.div<{ $variant: 'success' | 'error' | 'warning' | 'info'; $isExiting?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  padding: 12px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return `border-color: ${theme['method-post']};`;
      case 'error':
        return `border-color: ${theme['text-danger']};`;
      case 'warning':
        return `border-color: #f59e0b;`;
      case 'info':
        return `border-color: ${theme['text-link']};`;
      default:
        return `border-color: ${theme['layout-border']};`;
    }
  }}
`;

export const IconWrapper = styled.div<{ $variant: 'success' | 'error' | 'warning' | 'info' }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 2px;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return `color: ${theme['method-post']};`;
      case 'error':
        return `color: ${theme['text-danger']};`;
      case 'warning':
        return `color: #f59e0b;`;
      case 'info':
        return `color: ${theme['text-link']};`;
      default:
        return `color: ${theme['primary-text']};`;
    }
  }}
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 4px;
`;

export const ToastMessage = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme['secondary-text']};
  line-height: 1.5;
`;

export const CloseButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const ProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  transform-origin: left;
  animation: progress ${({ $duration }) => $duration}ms linear;

  @keyframes progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;
