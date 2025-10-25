import React, { useState } from 'react';
import styled from 'styled-components';

interface SidebarSectionProps {
  /**
   * Section title
   */
  title: string;

  /**
   * If true, section starts collapsed
   */
  defaultCollapsed?: boolean;

  /**
   * Show collapse toggle
   */
  collapsible?: boolean;

  /**
   * Section content
   */
  children: React.ReactNode;

  /**
   * Right side actions (buttons, icons)
   */
  actions?: React.ReactNode;

  className?: string;
}

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme['layout-border']};

  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme['sidebar-bottom-bg']};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      props.$clickable ? props.theme['sidebar-collection-item-active-background'] : 'transparent'};
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const TitleText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme['secondary-text']};
`;

const CollapseIcon = styled.span<{ $collapsed: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${(props) => props.theme['secondary-text']};
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$collapsed ? 'rotate(-90deg)' : 'rotate(0deg)')};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionContent = styled.div<{ $collapsed: boolean }>`
  display: ${(props) => (props.$collapsed ? 'none' : 'flex')};
  flex-direction: column;
`;

/**
 * Sidebar section with collapsible content
 *
 * @example
 * <SidebarSection title="Collections" collapsible>
 *   <SidebarItem label="API Tests" />
 *   <SidebarItem label="E2E Tests" />
 * </SidebarSection>
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  defaultCollapsed = false,
  collapsible = false,
  children,
  actions,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <SectionWrapper className={className}>
      <SectionHeader $clickable={collapsible} onClick={toggleCollapse}>
        <SectionTitle>
          {collapsible && <CollapseIcon $collapsed={collapsed}>▼</CollapseIcon>}
          <TitleText>{title}</TitleText>
        </SectionTitle>
        {actions && <Actions onClick={(e) => e.stopPropagation()}>{actions}</Actions>}
      </SectionHeader>
      <SectionContent $collapsed={collapsed}>{children}</SectionContent>
    </SectionWrapper>
  );
};
