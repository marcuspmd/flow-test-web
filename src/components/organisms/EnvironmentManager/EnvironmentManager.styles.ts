import styled from 'styled-components';

export const EnvironmentManagerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 800px;
  background: ${({ theme }) => theme['primary-theme']};
  border-radius: 8px;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme['sidebar-background']};

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme['secondary-text']};
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme['sidebar-background']};
  display: flex;
  flex-direction: column;
`;

export const SidebarHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const AddButton = styled.button`
  background: #007acc;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #005a9e;
  }
`;

export const EnvironmentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

export const EnvironmentItem = styled.div<{ $active: boolean }>`
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.15)' : 'transparent')};
  border-left: ${({ $active }) => ($active ? '3px solid #007acc' : '3px solid transparent')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);

    .actions {
      opacity: 1;
    }
  }

  .name {
    font-size: 13px;
    color: ${({ theme }) => theme['primary-text']};
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
  }

  .actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;

    button {
      background: transparent;
      border: none;
      padding: 2px 6px;
      cursor: pointer;
      border-radius: 3px;
      font-size: 14px;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
`;

export const GlobalVariablesItem = styled.div<{ $active: boolean }>`
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.15)' : 'transparent')};
  border-left: ${({ $active }) => ($active ? '3px solid #007acc' : '3px solid transparent')};
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .name {
    font-size: 13px;
    color: ${({ theme }) => theme['primary-text']};
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const EditorPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const EditorHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};

    &:focus {
      outline: none;
      border-color: #007acc;
    }
  }
`;

export const VariablesTable = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 60px 80px;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme['secondary-text']};
    text-transform: uppercase;
  }
`;

export const VariableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 60px 80px;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  input[type='checkbox'] {
    cursor: pointer;
  }

  input[type='text'],
  input[type='password'] {
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    font-size: 13px;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};

    &:focus {
      outline: none;
      border-color: #007acc;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .secret-toggle {
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    color: ${({ theme }) => theme['secondary-text']};

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background: rgba(0, 122, 204, 0.1);
      border-color: #007acc;
      color: #007acc;
    }
  }

  .delete-button {
    background: transparent;
    border: none;
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 16px;
    color: ${({ theme }) => theme['secondary-text']};

    &:hover {
      background: rgba(249, 62, 62, 0.1);
      color: #f93e3e;
    }
  }
`;

export const AddVariableButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  background: transparent;
  border: 1px dashed rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    border-color: #007acc;
    color: #007acc;
    background: rgba(0, 122, 204, 0.05);
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
  padding: 40px;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme['sidebar-background']};
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info {
    font-size: 12px;
    color: ${({ theme }) => theme['secondary-text']};
  }

  .actions {
    display: flex;
    gap: 8px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: #007acc;
          color: white;
          &:hover { background: #005a9e; }
        `;
      case 'danger':
        return `
          background: #f93e3e;
          color: white;
          &:hover { background: #d63030; }
        `;
      case 'secondary':
      default:
        return `
          background: transparent;
          color: var(--primary-text);
          border: 1px solid rgba(0, 0, 0, 0.2);
          &:hover { background: rgba(0, 0, 0, 0.05); }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
