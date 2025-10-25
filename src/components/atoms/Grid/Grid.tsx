import styled, { css } from 'styled-components';

interface GridProps {
  columns?: number | 'auto-fit' | 'auto-fill';
  rows?: number | 'auto';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minColumnWidth?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const gaps = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

export const Grid = styled.div<GridProps>`
  display: grid;

  ${(props) => {
    if (props.columns === 'auto-fit' || props.columns === 'auto-fill') {
      return css`
        grid-template-columns: repeat(${props.columns}, minmax(${props.minColumnWidth || '200px'}, 1fr));
      `;
    }
    if (typeof props.columns === 'number') {
      return css`
        grid-template-columns: repeat(${props.columns}, 1fr);
      `;
    }
    return '';
  }}

  ${(props) =>
    props.rows &&
    props.rows !== 'auto' &&
    css`
      grid-template-rows: repeat(${props.rows}, 1fr);
    `}

  gap: ${(props) => gaps[props.gap || 'none']};
  column-gap: ${(props) => (props.columnGap ? gaps[props.columnGap] : undefined)};
  row-gap: ${(props) => (props.rowGap ? gaps[props.rowGap] : undefined)};

  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}

  ${(props) =>
    props.fullHeight &&
    css`
      height: 100%;
    `}
`;

Grid.defaultProps = {
  columns: 1,
  rows: 'auto',
  gap: 'none',
  minColumnWidth: '200px',
};
