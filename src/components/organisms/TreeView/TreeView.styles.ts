import styled from 'styled-components';

export const TreeViewWrapper = styled.div`
  height: 100%;
  background: ${({ theme }) => theme['primary-theme']};
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme['sidebar-background']};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme['secondary-text']};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
    color: ${({ theme }) => theme.text};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const TreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['layout-border']};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme['secondary-text']};
    }
  }
`;

export const TreeItem = styled.div<{ $level: number; $isActive?: boolean; $isDragging?: boolean }>`
  padding: 6px 12px;
  padding-left: ${({ $level }) => 12 + $level * 16}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  position: relative;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme['sidebar-collection-item-active-background'] : 'transparent'};
  border-left: ${({ $isActive, theme }) =>
    $isActive ? `2px solid ${theme['sidebar-collection-item-active-indent-border']}` : '2px solid transparent'};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }

  &:active {
    background: ${({ theme }) => theme['table-stripe']};
  }
`;

export const ExpandIcon = styled.div<{ $expanded: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme['secondary-text']};
  transform: ${({ $expanded }) => ($expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const ItemIcon = styled.div<{ $type: 'workspace' | 'folder' | 'request'; $method?: string }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type, $method, theme }) => {
    if ($type === 'request') {
      switch ($method) {
        case 'GET':
          return theme['method-get'];
        case 'POST':
          return theme['method-post'];
        case 'PUT':
        case 'PATCH':
          return theme['method-patch'];
        case 'DELETE':
          return theme['method-delete'];
        case 'OPTIONS':
          return theme['method-options'];
        case 'HEAD':
          return theme['method-head'];
        default:
          return theme['secondary-text'];
      }
    }
    return theme['secondary-text'];
  }};

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ItemText = styled.span`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemActions = styled.div`
  display: none;
  gap: 4px;
  margin-left: auto;

  ${TreeItem}:hover & {
    display: flex;
  }
`;

export const ItemActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme['secondary-text']};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme['sidebar-background']};
    color: ${({ theme }) => theme.text};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ContextMenu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  background: ${({ theme }) => theme['primary-theme']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px;
  min-width: 180px;
  z-index: 1000;
`;

export const ContextMenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  color: ${({ $danger, theme }) => ($danger ? theme['text-danger'] : theme.text)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ContextMenuSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme['layout-border']};
  margin: 4px 0;
`;

export const DropIndicator = styled.div<{ $position: 'before' | 'after' | 'inside' }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => theme.brand};
  pointer-events: none;
  ${({ $position }) => {
    if ($position === 'before') return 'top: -1px;';
    if ($position === 'after') return 'bottom: -1px;';
    return 'display: none;';
  }}
`;

export const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme['secondary-text']};
`;

export const EmptyStateIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: ${({ theme }) => theme['layout-border']};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const EmptyStateText = styled.p`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 500;
`;

export const EmptyStateSubtext = styled.p`
  margin: 0;
  font-size: 12px;
`;
