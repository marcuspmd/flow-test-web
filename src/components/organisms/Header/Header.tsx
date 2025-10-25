import React, { useState, useRef, useEffect } from 'react';
import {
  HeaderWrapper,
  LeftSection,
  RightSection,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  ActionsToolbar,
  ActionButton,
  EnvironmentSelect,
  EnvironmentButton,
  EnvironmentDropdown,
  EnvironmentOption,
  ThemeToggle,
} from './Header.styles';
import { Icon } from '../../atoms/Icon';

export interface BreadcrumbItemData {
  label: string;
  onClick?: () => void;
}

export interface ActionButtonData {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

export interface Environment {
  id: string;
  name: string;
}

export interface HeaderProps {
  /**
   * Breadcrumb navigation items
   */
  breadcrumbs?: BreadcrumbItemData[];

  /**
   * Action buttons in the toolbar
   */
  actions?: ActionButtonData[];

  /**
   * Available environments
   */
  environments?: Environment[];

  /**
   * Currently selected environment
   */
  selectedEnvironment?: string;

  /**
   * Callback when environment changes
   */
  onEnvironmentChange?: (environmentId: string) => void;

  /**
   * Show theme toggle button
   * @default true
   */
  showThemeToggle?: boolean;

  /**
   * Current theme mode
   */
  themeMode?: 'light' | 'dark';

  /**
   * Callback when theme is toggled
   */
  onThemeToggle?: () => void;

  /**
   * Additional content to render on the right side
   */
  rightContent?: React.ReactNode;

  className?: string;
}

/**
 * Header component with breadcrumb navigation, actions toolbar, and environment selector
 *
 * @example
 * <Header
 *   breadcrumbs={[
 *     { label: 'Collections', onClick: () => {} },
 *     { label: 'My API', onClick: () => {} },
 *     { label: 'Get User' }
 *   ]}
 *   actions={[
 *     { label: 'Run', icon: 'IconPlayerPlay', variant: 'primary', onClick: () => {} },
 *     { label: 'Save', icon: 'IconDeviceFloppy', onClick: () => {} }
 *   ]}
 *   environments={[
 *     { id: 'dev', name: 'Development' },
 *     { id: 'prod', name: 'Production' }
 *   ]}
 *   selectedEnvironment="dev"
 * />
 */
export const Header: React.FC<HeaderProps> = ({
  breadcrumbs = [],
  actions = [],
  environments = [],
  selectedEnvironment,
  onEnvironmentChange,
  showThemeToggle = true,
  themeMode = 'light',
  onThemeToggle,
  rightContent,
  className,
}) => {
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const envDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (envDropdownRef.current && !envDropdownRef.current.contains(event.target as Node)) {
        setEnvDropdownOpen(false);
      }
    };

    if (envDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [envDropdownOpen]);

  const selectedEnv = environments.find((env) => env.id === selectedEnvironment);

  const handleEnvironmentSelect = (envId: string) => {
    onEnvironmentChange?.(envId);
    setEnvDropdownOpen(false);
  };

  return (
    <HeaderWrapper className={className}>
      <LeftSection>
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb aria-label="Breadcrumb navigation">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem
                  $isActive={index === breadcrumbs.length - 1}
                  onClick={index < breadcrumbs.length - 1 ? item.onClick : undefined}
                  role={index < breadcrumbs.length - 1 ? 'button' : undefined}
                  tabIndex={index < breadcrumbs.length - 1 ? 0 : undefined}
                >
                  {item.label}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              </React.Fragment>
            ))}
          </Breadcrumb>
        )}

        {/* Actions Toolbar */}
        {actions.length > 0 && (
          <ActionsToolbar>
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                $variant={action.variant}
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.label}
              >
                {action.icon && <Icon name={action.icon} size={16} />}
                {action.label}
              </ActionButton>
            ))}
          </ActionsToolbar>
        )}
      </LeftSection>

      <RightSection>
        {/* Environment Selector */}
        {environments.length > 0 && (
          <EnvironmentSelect ref={envDropdownRef}>
            <EnvironmentButton
              onClick={() => setEnvDropdownOpen(!envDropdownOpen)}
              data-open={envDropdownOpen}
              aria-expanded={envDropdownOpen}
              aria-haspopup="true"
            >
              <Icon name="IconWorld" size={14} />
              {selectedEnv?.name || 'Select Environment'}
              <Icon name="IconChevronDown" size={14} />
            </EnvironmentButton>

            {envDropdownOpen && (
              <EnvironmentDropdown role="menu">
                {environments.map((env) => (
                  <EnvironmentOption
                    key={env.id}
                    $isActive={env.id === selectedEnvironment}
                    onClick={() => handleEnvironmentSelect(env.id)}
                    role="menuitem"
                  >
                    {env.id === selectedEnvironment && (
                      <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                        <Icon name="IconCheck" size={14} />
                      </span>
                    )}
                    {env.name}
                  </EnvironmentOption>
                ))}
              </EnvironmentDropdown>
            )}
          </EnvironmentSelect>
        )}

        {/* Custom Right Content */}
        {rightContent}

        {/* Theme Toggle */}
        {showThemeToggle && (
          <ThemeToggle onClick={onThemeToggle} title="Toggle theme" aria-label="Toggle theme">
            <Icon name={themeMode === 'light' ? 'IconMoon' : 'IconSun'} size={18} />
          </ThemeToggle>
        )}
      </RightSection>
    </HeaderWrapper>
  );
};
