import React from 'react';
import styled from 'styled-components';

interface SidebarItemProps {
  /**
   * Item label
   */
  label: string;

  /**
   * Icon element
   */
  icon?: React.ReactNode;

  /**
   * If true, item is active/selected
   */
  active?: boolean;

  /**
   * If true, item is disabled
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Right side content (badge, counter, etc)
   */
  rightContent?: React.ReactNode;

  className?: string;
}

const StyledItem = styled.div<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  user-select: none;
  position: relative;

  ${(props) =>
    props.$active &&
    `
    background-color: ${props.theme['sidebar-collection-item-active-background']};
    border-left: 3px solid ${props.theme['sidebar-collection-item-active-indent-border']};
    padding-left: calc(1rem - 3px);
  `}

  &:hover {
    background-color: ${(props) => props.theme['sidebar-collection-item-active-background']};
  }

  &:active {
    transform: ${(props) => (props.$disabled ? 'none' : 'scale(0.98)')};
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${(props) => props.theme['secondary-text']};
`;

const Label = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: ${(props) => props.theme['primary-text']};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

/**
 * Sidebar navigation item
 *
 * @example
 * <SidebarItem
 *   label="Dashboard"
 *   icon={<IconHome />}
 *   active
 *   onClick={() => navigate('/dashboard')}
 * />
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active,
  disabled,
  onClick,
  rightContent,
  className,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <StyledItem $active={active} $disabled={disabled} onClick={handleClick} className={className}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Label>{label}</Label>
      {rightContent && <RightContent>{rightContent}</RightContent>}
    </StyledItem>
  );
};
