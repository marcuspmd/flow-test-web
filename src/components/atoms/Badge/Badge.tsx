import React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  default: css`
    background-color: ${(props) => props.theme['sidebar-background']};
    color: ${(props) => props.theme['primary-text']};
  `,
  success: css`
    background-color: rgba(5, 150, 105, 0.1);
    color: ${(props) => props.theme['method-get']};
  `,
  warning: css`
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  `,
  error: css`
    background-color: rgba(185, 28, 28, 0.1);
    color: ${(props) => props.theme['text-danger']};
  `,
  info: css`
    background-color: rgba(84, 109, 229, 0.1);
    color: ${(props) => props.theme.brand};
  `,
};

const sizes = {
  sm: css`
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  `,
  md: css`
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
  `,
  lg: css`
    font-size: 1rem;
    padding: 0.375rem 1rem;
  `,
};

const StyledBadge = styled.span<{ variant: BadgeProps['variant']; size: BadgeProps['size'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
  ${(props) => variants[props.variant || 'default']}
  ${(props) => sizes[props.size || 'md']}
`;

/**
 * Badge component for labels and status indicators
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Failed</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'md', children, className }) => {
  return (
    <StyledBadge variant={variant} size={size} className={className}>
      {children}
    </StyledBadge>
  );
};
