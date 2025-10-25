import React from 'react';
import styled from 'styled-components';
import { VscFiles, VscSettings, VscHistory } from 'react-icons/vsc';
import { MdOutlineSettingsApplications } from 'react-icons/md';
import type { SidebarView } from '../../../types';

const MiniSidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 100%;
  background: ${({ theme }) => theme['sidebar-background']};
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;
  z-index: 20;
`;

const IconButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  border: none;
  background: transparent;
  color: ${({ $isActive, theme }) => ($isActive ? theme.brand : theme['secondary-text'])};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-left: 2px solid ${({ $isActive, theme }) => ($isActive ? theme.brand : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
    color: ${({ theme }) => theme['primary-text']};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand};
    outline-offset: -2px;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 68px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

interface SidebarViewConfig {
  id: SidebarView;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
}

const SIDEBAR_VIEWS: SidebarViewConfig[] = [
  {
    id: 'collections',
    icon: <VscFiles />,
    label: 'Collections',
    ariaLabel: 'Collections',
  },
  {
    id: 'environments',
    icon: <MdOutlineSettingsApplications />,
    label: 'Environments',
    ariaLabel: 'Environments',
  },
  {
    id: 'history',
    icon: <VscHistory />,
    label: 'History',
    ariaLabel: 'History',
  },
  {
    id: 'settings',
    icon: <VscSettings />,
    label: 'Settings',
    ariaLabel: 'Settings',
  },
];

interface MiniSidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
}

export const MiniSidebar: React.FC<MiniSidebarProps> = ({ activeView, onViewChange }) => {
  const [hoveredView, setHoveredView] = React.useState<SidebarView | null>(null);

  return (
    <MiniSidebarContainer>
      {SIDEBAR_VIEWS.map((view) => (
        <IconButton
          key={view.id}
          $isActive={activeView === view.id}
          onClick={() => onViewChange(view.id)}
          onMouseEnter={() => setHoveredView(view.id)}
          onMouseLeave={() => setHoveredView(null)}
          aria-label={view.ariaLabel}
          title={view.label}
          data-testid={`mini-sidebar-${view.id}`}
        >
          {view.icon}
          <Tooltip $visible={hoveredView === view.id && activeView !== view.id}>{view.label}</Tooltip>
        </IconButton>
      ))}
    </MiniSidebarContainer>
  );
};
