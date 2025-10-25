import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SidebarWrapper,
  SidebarAside,
  SidebarContent,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  DragHandle,
  CollapseButton,
} from './Sidebar.styles';

export interface SidebarProps {
  /**
   * Initial width of the sidebar
   * @default 280
   */
  initialWidth?: number;

  /**
   * Minimum width when resizing
   * @default 200
   */
  minWidth?: number;

  /**
   * Maximum width when resizing
   * @default 600
   */
  maxWidth?: number;

  /**
   * If true, sidebar starts collapsed
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when sidebar is collapsed/expanded
   */
  onCollapseChange?: (collapsed: boolean) => void;

  /**
   * Callback when width changes
   */
  onWidthChange?: (width: number) => void;

  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Main content
   */
  children: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Show collapse button
   * @default true
   */
  showCollapseButton?: boolean;

  /**
   * Allow resizing
   * @default true
   */
  resizable?: boolean;

  className?: string;
}

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 600;

/**
 * Sidebar component with resizable drag handle and collapse functionality
 *
 * @example
 * <Sidebar
 *   header={<div>Collections</div>}
 *   footer={<div>Settings</div>}
 * >
 *   <SidebarItem>Item 1</SidebarItem>
 *   <SidebarItem>Item 2</SidebarItem>
 * </Sidebar>
 */
export const Sidebar: React.FC<SidebarProps> = ({
  initialWidth = DEFAULT_WIDTH,
  minWidth = MIN_WIDTH,
  maxWidth = MAX_WIDTH,
  defaultCollapsed = false,
  onCollapseChange,
  onWidthChange,
  header,
  children,
  footer,
  showCollapseButton = true,
  resizable = true,
  className,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isDragging, setIsDragging] = useState(false);
  const lastWidthRef = useRef(initialWidth);

  // Clamp helper to keep width in allowed range
  const clamp = useCallback((value: number) => Math.min(maxWidth, Math.max(minWidth, value)), [minWidth, maxWidth]);

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || collapsed || !resizable) return;

      e.preventDefault();
      const nextWidth = clamp(e.clientX + 2);

      // Only update if change is significant (reduces re-renders)
      if (Math.abs(nextWidth - lastWidthRef.current) < 3) return;

      lastWidthRef.current = nextWidth;
      setWidth(nextWidth);
      onWidthChange?.(nextWidth);
    },
    [isDragging, collapsed, resizable, clamp, onWidthChange]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  // Handle drag bar mouse down
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (collapsed || !resizable) return;
      setIsDragging(true);
    },
    [collapsed, resizable]
  );

  // Toggle collapse
  const toggleCollapse = useCallback(() => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  }, [collapsed, onCollapseChange]);

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (!resizable) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizable, handleMouseMove, handleMouseUp]);

  const currentWidth = collapsed ? 0 : width;

  return (
    <SidebarWrapper className={className}>
      <SidebarAside $width={currentWidth} $isDragging={isDragging}>
        <SidebarContent>
          {header && <SidebarHeader>{header}</SidebarHeader>}
          <SidebarBody>{children}</SidebarBody>
          {footer && <SidebarFooter>{footer}</SidebarFooter>}
        </SidebarContent>

        {/* Drag handle */}
        {resizable && <DragHandle $visible={!collapsed} onMouseDown={handleDragStart} />}

        {/* Collapse button */}
        {showCollapseButton && (
          <CollapseButton onClick={toggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? '›' : '‹'}
          </CollapseButton>
        )}
      </SidebarAside>
    </SidebarWrapper>
  );
};
