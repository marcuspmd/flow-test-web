import React, { Suspense } from 'react';
import styled from 'styled-components';
import type { SidebarView } from '../../../types';
import { getViewById } from './views';

const ViewRendererContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ViewWrapper = styled.div<{ $visible: boolean }>`
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

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme['secondary-text']};
  font-size: 14px;

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme['layout-border']};
    border-top-color: ${({ theme }) => theme.brand};
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .error-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${({ theme }) => theme['primary-text']};
  }

  .error-message {
    font-size: 13px;
    opacity: 0.7;
  }
`;

interface ViewErrorBoundaryProps {
  children: React.ReactNode;
  viewId: SidebarView;
}

interface ViewErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ViewErrorBoundary extends React.Component<ViewErrorBoundaryProps, ViewErrorBoundaryState> {
  constructor(props: ViewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ViewErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in sidebar view "${this.props.viewId}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback>
          <div className="error-icon">⚠️</div>
          <div className="error-title">Failed to load view</div>
          <div className="error-message">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
        </ErrorFallback>
      );
    }

    return this.props.children;
  }
}

const SidebarViewSkeleton: React.FC = () => (
  <LoadingFallback>
    <div className="spinner" />
    <span>Loading view...</span>
  </LoadingFallback>
);

interface SidebarViewRendererProps {
  activeView: SidebarView;
  viewProps?: Record<string, unknown>;
  preserveState?: boolean;
}

/**
 * SidebarViewRenderer - Renders sidebar views dynamically with lazy loading
 * 
 * Features:
 * - Lazy loading of view components
 * - Error boundary for graceful error handling
 * - Loading states with Suspense
 * - State preservation when switching views (using display: none)
 */
export const SidebarViewRenderer: React.FC<SidebarViewRendererProps> = ({
  activeView,
  viewProps = {},
  preserveState = true,
}) => {
  const viewConfig = getViewById(activeView);

  if (!viewConfig) {
    return (
      <ErrorFallback>
        <div className="error-icon">🔍</div>
        <div className="error-title">View not found</div>
        <div className="error-message">The requested view &quot;{activeView}&quot; does not exist</div>
      </ErrorFallback>
    );
  }

  const ViewComponent = viewConfig.component;
  const combinedProps = { ...viewConfig.defaultProps, ...viewProps };

  return (
    <ViewRendererContainer>
      <ViewErrorBoundary viewId={activeView}>
        <Suspense fallback={<SidebarViewSkeleton />}>
          <ViewWrapper $visible={true}>
            <ViewComponent {...combinedProps} />
          </ViewWrapper>
        </Suspense>
      </ViewErrorBoundary>
    </ViewRendererContainer>
  );
};
