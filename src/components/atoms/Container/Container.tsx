import styled from 'styled-components';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const maxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

const paddings = {
  none: '0',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${(props) => maxWidths[props.maxWidth || 'xl']};
  padding-left: ${(props) => paddings[props.padding || 'md']};
  padding-right: ${(props) => paddings[props.padding || 'md']};
  margin-left: ${(props) => (props.centered ? 'auto' : '0')};
  margin-right: ${(props) => (props.centered ? 'auto' : '0')};
`;

Container.defaultProps = {
  maxWidth: 'xl',
  padding: 'md',
  centered: true,
};
