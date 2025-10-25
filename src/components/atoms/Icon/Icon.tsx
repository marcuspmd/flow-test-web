import React from 'react';
import styled from 'styled-components';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}

const IconWrapper = styled.span<{ $size?: number; $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size || 24}px;
  height: ${(props) => props.$size || 24}px;
  color: ${(props) => props.$color || 'currentColor'};

  svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * Icon wrapper component
 * Use with Tabler Icons or any SVG icon
 *
 * @example
 * import { IconCheck } from '@tabler/icons';
 * <Icon size={24}><IconCheck /></Icon>
 */
export const Icon: React.FC<IconProps> = ({ size = 24, color, className, children }) => {
  return (
    <IconWrapper $size={size} $color={color} className={className}>
      {children}
    </IconWrapper>
  );
};
