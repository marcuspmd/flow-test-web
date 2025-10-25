import styled from 'styled-components';

export const AlertWrapper = styled.div<{ $variant: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.1);
          border-color: ${theme['method-post']};
          color: ${theme['method-post']};
        `;
      case 'error':
        return `
          background: ${theme['background-danger']};
          border-color: ${theme['text-danger']};
          color: ${theme['text-danger']};
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          border-color: #f59e0b;
          color: #f59e0b;
        `;
      case 'info':
        return `
          background: rgba(59, 130, 246, 0.1);
          border-color: ${theme['text-link']};
          color: ${theme['text-link']};
        `;
    }
  }}
`;

export const IconWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AlertTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const AlertMessage = styled.div`
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.9;
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
  color: currentColor;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;
