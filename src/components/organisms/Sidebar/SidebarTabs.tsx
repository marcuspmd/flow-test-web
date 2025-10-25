import React from 'react';
import styled from 'styled-components';
import type { SidebarTab, SidebarTabConfig } from '../../../types';

const TabsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ theme }) => theme['sidebar-background']};
  user-select: none;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: none;
  background: ${({ $isActive, theme }) => ($isActive ? theme['primary-theme'] : 'transparent')};
  color: ${({ $isActive, theme }) => ($isActive ? theme['primary-text'] : theme['secondary-text'])};
  font-size: 11px;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${({ $isActive, theme }) => ($isActive ? theme.brand : 'transparent')};
  flex: 1;
  min-width: 0;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
    color: ${({ theme }) => theme['primary-text']};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand};
    outline-offset: -2px;
  }
`;

const TabIcon = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ $isActive, theme }) => ($isActive ? theme['primary-text'] : theme['secondary-text'])};
  }
`;

const TabLabel = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme['layout-border']};
  margin: 0 4px;
`;

const ConfigButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-left: auto;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
    color: ${({ theme }) => theme['primary-text']};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onConfigClick?: () => void;
}

const TABS: SidebarTabConfig[] = [
  {
    id: 'collections',
    label: 'Collections',
    icon: '📚',
    ariaLabel: 'Collections',
  },
  {
    id: 'environments',
    label: 'Environments',
    icon: '🌍',
    ariaLabel: 'Environments',
  },
  {
    id: 'flows',
    label: 'Flows',
    icon: '🔄',
    ariaLabel: 'Flows',
  },
  {
    id: 'history',
    label: 'History',
    icon: '🕐',
    ariaLabel: 'History',
  },
];

/**
 * SidebarTabs - Component de abas estilo Postman
 *
 * Exibe as abas principais da sidebar: Collections, Environments, Flows, History
 */
export const SidebarTabs: React.FC<SidebarTabsProps> = ({ activeTab, onTabChange, onConfigClick }) => {
  return (
    <TabsContainer role="tablist" aria-label="Sidebar navigation">
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`sidebar-panel-${tab.id}`}
          aria-label={tab.ariaLabel}
          tabIndex={activeTab === tab.id ? 0 : -1}
          $isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          data-testid={`sidebar-tab-${tab.id}`}
        >
          <TabIcon $isActive={activeTab === tab.id}>{tab.icon}</TabIcon>
          <TabLabel>{tab.label}</TabLabel>
        </TabButton>
      ))}

      {onConfigClick && (
        <>
          <Divider />
          <ConfigButton
            onClick={onConfigClick}
            aria-label="Configure sidebar"
            title="Configure sidebar"
            data-testid="sidebar-config-button"
          >
            ⚙️
          </ConfigButton>
        </>
      )}
    </TabsContainer>
  );
};
