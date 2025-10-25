import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const sizes = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
};

const StyledSpinner = styled.div<{ size: string; color?: string }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border: 2px solid ${(props) => props.theme['layout-border']};
  border-top-color: ${(props) => props.color || props.theme.brand};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Loading spinner component
 *
 * @example
 * <Spinner size="md" />
 * <Spinner size="lg" color="#ff0000" />
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color, className }) => {
  return (
    <SpinnerContainer className={className}>
      <StyledSpinner size={sizes[size]} color={color} role="status" aria-label="Loading" />
    </SpinnerContainer>
  );
};
