import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { SidebarView } from './MiniSidebar';

const ContentAreaContainer = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  height: 100%;
  background: ${({ theme }) => theme['sidebar-background']};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  transition: width 0.1s ease-out;
`;

const DragHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  z-index: 100;
  background: transparent;
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 40px;
    background: ${({ theme }) => theme['secondary-text']};
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.brand}22;

    &::before {
      opacity: 0.4;
      background: ${({ theme }) => theme.brand};
    }
  }

  &:active {
    background: ${({ theme }) => theme.brand}44;

    &::before {
      opacity: 0.7;
    }
  }
`;

const ViewContainer = styled.div<{ $visible: boolean }>`
  flex: 1;
  overflow: hidden;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  animation: ${({ $visible }) => ($visible ? 'fadeIn 0.2s ease' : 'none')};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

interface SidebarContentAreaProps {
  activeView: SidebarView;
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 280;
const MAX_WIDTH = 600;

export const SidebarContentArea: React.FC<SidebarContentAreaProps> = ({
  activeView,
  children,
  initialWidth = DEFAULT_WIDTH,
  minWidth = MIN_WIDTH,
  maxWidth = MAX_WIDTH,
  onWidthChange,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const lastWidthRef = useRef(initialWidth);

  const clamp = useCallback(
    (value: number) => Math.min(maxWidth, Math.max(minWidth, value)),
    [minWidth, maxWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      // Calculate width based on cursor position minus the mini-sidebar width (60px)
      const nextWidth = clamp(e.clientX - 60);

      if (Math.abs(nextWidth - lastWidthRef.current) < 3) return;

      lastWidthRef.current = nextWidth;
      setWidth(nextWidth);
      onWidthChange?.(nextWidth);
    },
    [isDragging, clamp, onWidthChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <ContentAreaContainer $width={width}>
      <ViewContainer $visible={true}>{children}</ViewContainer>
      <DragHandle onMouseDown={handleDragStart} />
    </ContentAreaContainer>
  );
};
