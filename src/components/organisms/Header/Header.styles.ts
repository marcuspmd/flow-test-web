import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ theme }) => theme['sidebar-background']};
  flex-shrink: 0;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0; /* Allow text truncation */
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Breadcrumb navigation
export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme['primary-text']};
  min-width: 0;
`;

export const BreadcrumbItem = styled.span<{ $isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  color: ${({ theme, $isActive }) => ($isActive ? theme['primary-text'] : theme['secondary-text'])};
  font-weight: ${({ $isActive }) => ($isActive ? 500 : 400)};
  cursor: ${({ $isActive }) => ($isActive ? 'default' : 'pointer')};
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme, $isActive }) => !$isActive && theme['text-link']};
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme['secondary-text']};
  user-select: none;
  flex-shrink: 0;
`;

// Actions toolbar
export const ActionsToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${({ theme, $variant = 'secondary' }) => {
    if ($variant === 'primary') {
      return `
        background: ${theme.brand};
        color: white;
        border-color: ${theme.brand};

        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      `;
    }
    if ($variant === 'danger') {
      return `
        background: ${theme['text-danger']};
        color: white;
        border-color: ${theme['text-danger']};

        &:hover:not(:disabled) {
          background: ${theme['background-danger']};
        }
      `;
    }
    return `
      background: transparent;
      color: ${theme['primary-text']};
      border-color: ${theme['layout-border']};

      &:hover:not(:disabled) {
        background: ${theme['table-stripe']};
        border-color: ${theme['text-link']};
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

// Environment selector
export const EnvironmentSelect = styled.div`
  position: relative;
  display: inline-flex;
`;

export const EnvironmentButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 13px;
  background: transparent;
  color: ${({ theme }) => theme['primary-text']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['table-stripe']};
    border-color: ${({ theme }) => theme['text-link']};
  }

  svg {
    transition: transform 0.2s ease;
  }

  &[data-open='true'] svg {
    transform: rotate(180deg);
  }
`;

export const EnvironmentDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
`;

export const EnvironmentOption = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme['sidebar-collection-item-active-background'] : 'transparent'};
  color: ${({ theme }) => theme['primary-text']};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['table-stripe']};
  }
`;

export const ThemeToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['table-stripe']};
    border-color: ${({ theme }) => theme['text-link']};
  }
`;
