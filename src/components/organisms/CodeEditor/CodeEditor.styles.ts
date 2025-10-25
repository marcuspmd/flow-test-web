import styled from 'styled-components';

export const EditorWrapper = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${({ $height }) => $height || '400px'};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
`;

export const EditorToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  gap: 12px;
`;

export const LanguageSelector = styled.select`
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  font-size: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

export const EditorActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 4px 10px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  color: ${({ theme }) => theme['primary-text']};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(0, 122, 204, 0.1);
    border-color: #007acc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 11px;
  color: ${({ theme }) => theme['secondary-text']};
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
  z-index: 1000;
`;
