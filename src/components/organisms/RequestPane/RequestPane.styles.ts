import styled from 'styled-components';

export const RequestPaneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme['primary-theme']};
`;

export const RequestToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme['sidebar-background']};
  flex-shrink: 0;
`;

export const MethodSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-width: 100px;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  option {
    font-weight: 600;
  }
`;

export const UrlInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;

  &:focus {
    outline: none;
    border-color: #007acc;
  }

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
  }
`;

export const SendButton = styled.button`
  padding: 8px 24px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #005a9e;
  }

  &:active {
    background: #004578;
  }

  &:disabled {
    background: rgba(0, 122, 204, 0.5);
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: ${({ theme }) => theme['primary-text']};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 122, 204, 0.1);
    border-color: #007acc;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.1)' : 'transparent')};
  border: none;
  border-bottom: ${({ $active }) => ($active ? '2px solid #007acc' : '2px solid transparent')};
  color: ${({ theme, $active }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 122, 204, 0.05);
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: ${({ theme }) => theme['primary-theme']};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  p {
    font-size: 14px;
  }
`;

export const KeyValueTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const KeyValueRow = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 1fr 60px;
  gap: 8px;
  align-items: center;

  input[type='checkbox'] {
    cursor: pointer;
  }

  input[type='text'] {
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
    font-size: 13px;

    &:focus {
      outline: none;
      border-color: #007acc;
    }

    &::placeholder {
      color: ${({ theme }) => theme['secondary-text']};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .description-input {
    grid-column: 2 / -1;
    margin-top: -4px;
  }
`;

export const ActionButton = styled.button`
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  font-size: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const AddRowButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: ${({ theme }) => theme['secondary-text']};
  font-size: 13px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #007acc;
    color: #007acc;
    background: rgba(0, 122, 204, 0.05);
  }
`;

export const BulkEditButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: ${({ theme }) => theme['primary-text']};
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 122, 204, 0.1);
    border-color: #007acc;
  }
`;

export const InfoText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  .icon {
    font-size: 14px;
  }
`;
