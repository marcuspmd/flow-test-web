import styled from 'styled-components';

export const SidebarWrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const SidebarAside = styled.aside<{ $width: number; $isDragging: boolean }>`
  width: ${(props) => props.$width}px;
  height: 100%;
  background-color: ${(props) => props.theme['sidebar-background']};
  border-right: 1px solid ${(props) => props.theme['layout-border']};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: ${(props) => (props.$isDragging ? 'none' : 'width 0.2s ease-in-out')};
  position: relative;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme['layout-border']};
  background-color: ${(props) => props.theme['sidebar-bottom-bg']};
`;

export const SidebarBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme['layout-border']};
    border-radius: 3px;

    &:hover {
      background-color: ${(props) => props.theme['secondary-text']};
    }
  }
`;

export const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${(props) => props.theme['layout-border']};
  background-color: ${(props) => props.theme['sidebar-bottom-bg']};
`;

export const DragHandle = styled.div<{ $visible: boolean }>`
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 6px;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: col-resize;
  z-index: 10;

  &::before {
    content: '';
    width: 2px;
    height: 100%;
    background-color: transparent;
    transition: background-color 0.2s ease;
  }

  &:hover::before {
    background-color: ${(props) => props.theme.brand};
  }
`;

export const CollapseButton = styled.button`
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: ${(props) => props.theme['sidebar-background']};
  border: 1px solid ${(props) => props.theme['layout-border']};
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 11;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme['sidebar-collection-item-active-background']};
    border-color: ${(props) => props.theme.brand};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme['primary-text']};
  }
`;
