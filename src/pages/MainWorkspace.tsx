import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MiniSidebar, SidebarContentArea, SidebarViewRenderer } from '../components/organisms/Sidebar';
import { RequestPane, RequestData } from '../components/organisms/RequestPane';
import { ResponsePane, ResponseData } from '../components/organisms/ResponsePane';
import { useAppDispatch, useAppSelector } from '../store';
import { setCollections, setSelectedRequest, setActiveView } from '../store/slices/sidebarSlice';
import { updateRequest } from '../store/slices/apiClientSlice';
import { mockCollections } from '../data/mockSidebarData';
import type { SidebarView } from '../types';

const WorkspaceWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

const SidebarContainer = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ResizablePanel = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  position: relative;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 6px;
  cursor: row-resize;
  z-index: 100;
  background: transparent;

  &:hover {
    background: rgba(0, 122, 204, 0.3);
  }

  &:active {
    background: #007acc;
  }
`;

const BottomPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
  padding: 40px;
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .icon {
    font-size: 72px;
    margin-bottom: 28px;
    opacity: 0.4;
    filter: grayscale(0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    color: ${({ theme }) => theme['primary-text']};
    background: linear-gradient(135deg, ${({ theme }) => theme['primary-text']} 0%, ${({ theme }) => theme.brand} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 15px;
    margin-bottom: 6px;
    line-height: 1.6;
    opacity: 0.9;

    &:last-of-type {
      font-size: 13px;
      opacity: 0.6;
      margin-top: 8px;
    }
  }

  .quick-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  .action-card {
    padding: 20px 24px;
    background: ${({ theme }) => theme['sidebar-background']};
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 160px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: ${({ theme }) => theme.brand}66;
    }

    .action-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .action-title {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme['primary-text']};
      margin-bottom: 4px;
    }

    .action-desc {
      font-size: 12px;
      color: ${({ theme }) => theme['secondary-text']};
      opacity: 0.8;
    }
  }
`;

const KeyboardHint = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme['secondary-text']};
  font-family: 'Monaco', 'Menlo', monospace;

  kbd {
    padding: 2px 6px;
    background: ${({ theme }) => theme['primary-theme']};
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

interface MainWorkspaceProps {
  children?: React.ReactNode;
}

export default function MainWorkspace({ children }: MainWorkspaceProps) {
  const dispatch = useAppDispatch();
  const { activeView } = useAppSelector((state) => state.sidebar);

  // Redux state para API Client
  const { workspaces, activeTabId: apiActiveTabId } = useAppSelector((state) => state.apiClient);

  const [requestPanelHeight, setRequestPanelHeight] = useState(50);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Busca request ativa do Redux
  const getActiveRequest = () => {
    if (!apiActiveTabId) return null;
    for (const workspace of workspaces) {
      const request = workspace.requests.find((r) => r.id === apiActiveTabId);
      if (request) return request;
    }
    return null;
  };

  const activeRequest = getActiveRequest();

  // Handler para atualizar requisição no Redux
  const handleRequestChange = (data: RequestData) => {
    if (!apiActiveTabId) return;
    const activeReq = getActiveRequest();
    dispatch(
      updateRequest({
        id: apiActiveTabId,
        data,
        folderId: activeReq?.folderId,
      })
    );
  };

  // Handler para enviar requisição
  const handleSend = async () => {
    if (!activeRequest) return;

    setIsLoading(true);

    try {
      // Mock response (substituir por fetch real depois)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockResponse: ResponseData = {
        status: 201,
        statusText: 'Created',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': '292',
          Connection: 'keep-alive',
          Date: new Date().toUTCString(),
          Server: 'nginx/1.18.0',
        },
        body: JSON.stringify(
          {
            id: 101,
            title: 'Test Post',
            body: 'This is a test post',
            userId: 1,
          },
          null,
          2
        ),
        time: 789,
        size: 292,

        // Flow Test Engine execution data
        curlCommand: `curl -X POST 'https://jsonplaceholder.typicode.com/posts' \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json' \\
  -d '{
  "title": "Test Post",
  "body": "This is a test post",
  "userId": 1
}'`,

        consoleLogs: [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'Starting request execution...',
            source: 'system',
          },
          {
            timestamp: new Date(Date.now() + 100).toISOString(),
            level: 'info',
            message: 'Computing variable: userId = 1',
            source: 'pre-hook',
          },
          {
            timestamp: new Date(Date.now() + 200).toISOString(),
            level: 'debug',
            message: 'Request headers prepared',
            source: 'system',
          },
          {
            timestamp: new Date(Date.now() + 789).toISOString(),
            level: 'info',
            message: 'Response received: 201 Created',
            source: 'system',
          },
          {
            timestamp: new Date(Date.now() + 800).toISOString(),
            level: 'info',
            message: 'Captured variable: postId = 101',
            source: 'post-hook',
          },
          {
            timestamp: new Date(Date.now() + 850).toISOString(),
            level: 'info',
            message: 'All assertions passed ✓',
            source: 'assertion',
          },
        ],

        assertionResults: [
          {
            path: 'response.status',
            operator: 'equals',
            passed: true,
            message: 'Status code is 201',
            expected: 201,
            actual: 201,
          },
          {
            path: 'response.body.id',
            operator: 'exists',
            passed: true,
            message: 'ID exists and is greater than 0',
            expected: true,
            actual: 101,
          },
          {
            path: 'response.body.title',
            operator: 'equals',
            passed: true,
            message: 'Title matches expected value',
            expected: 'Test Post',
            actual: 'Test Post',
          },
          {
            path: 'response.headers.Content-Type',
            operator: 'contains',
            passed: true,
            message: 'Content-Type is application/json',
            expected: 'application/json',
            actual: 'application/json; charset=utf-8',
          },
        ],

        capturedVariables: {
          postId: 101,
          userId: 1,
          timestamp: new Date().toISOString(),
          responseTime: 789,
        },
      };

      setResponse(mockResponse);
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar dados de exemplo
  useEffect(() => {
    dispatch(setCollections(mockCollections));
  }, [dispatch]);

  // Handle view change
  const handleViewChange = (view: SidebarView) => {
    dispatch(setActiveView(view));
  };

  // Drag vertical (request/response)
  const handleVerticalDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVertical(true);
  };

  const handleVerticalMouseMove = (e: MouseEvent) => {
    if (isDraggingVertical) {
      e.preventDefault();
      const container = document.querySelector('.content-area') as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        setRequestPanelHeight(Math.min(80, Math.max(20, newHeight)));
      }
    }
  };

  const handleMouseUp = () => {
    if (isDraggingVertical) setIsDraggingVertical(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleVerticalMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingVertical]);

  const handleCreateCollection = () => {
    console.log('Create collection');
  };

  const handleRequestClick = (requestId: string) => {
    dispatch(setSelectedRequest(requestId));
    // Request handling is now managed by Redux apiClientSlice
  };

  const getSidebarViewProps = () => {
    switch (activeView) {
      case 'collections':
        return {
          onCreateCollection: handleCreateCollection,
          onRequestClick: handleRequestClick,
        };
      default:
        return {};
    }
  };

  return (
    <WorkspaceWrapper>
      <SidebarContainer>
        <MiniSidebar activeView={activeView} onViewChange={handleViewChange} />
        <SidebarContentArea activeView={activeView}>
          <SidebarViewRenderer activeView={activeView} viewProps={getSidebarViewProps()} />
        </SidebarContentArea>
      </SidebarContainer>

      <MainSection>
        {children ? (
          <ContentArea>{children}</ContentArea>
        ) : activeRequest ? (
          <ContentArea className="content-area">
            <ResizablePanel $height={requestPanelHeight}>
              <RequestPane
                request={activeRequest.data}
                onChange={handleRequestChange}
                onSend={handleSend}
                onSave={() => console.log('Save request')}
                isLoading={isLoading}
              />
              <ResizeHandle onMouseDown={handleVerticalDragStart} />
            </ResizablePanel>

            <BottomPanel>
              <ResponsePane response={response} isLoading={isLoading} />
            </BottomPanel>
          </ContentArea>
        ) : (
          <WelcomeScreen>
            <div className="icon">🚀</div>
            <h1>Flow Test Engine</h1>
            <p>Select a request from the collection to get started</p>
            <p>Build, test, and debug your API flows with ease</p>

            <div className="quick-actions">
              <div className="action-card" onClick={handleCreateCollection}>
                <div className="action-icon">📁</div>
                <div className="action-title">New Collection</div>
                <div className="action-desc">Create a new API collection</div>
              </div>

              <div className="action-card">
                <div className="action-icon">⚡</div>
                <div className="action-title">Quick Request</div>
                <div className="action-desc">Send a one-off request</div>
              </div>

              <div className="action-card">
                <div className="action-icon">📖</div>
                <div className="action-title">Documentation</div>
                <div className="action-desc">Learn more about Flow Test</div>
              </div>
            </div>

            <div
              style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <KeyboardHint>
                <kbd>⌘</kbd> + <kbd>N</kbd> New Request
              </KeyboardHint>
              <KeyboardHint>
                <kbd>⌘</kbd> + <kbd>T</kbd> New Tab
              </KeyboardHint>
              <KeyboardHint>
                <kbd>⌘</kbd> + <kbd>Enter</kbd> Send
              </KeyboardHint>
            </div>
          </WelcomeScreen>
        )}
      </MainSection>
    </WorkspaceWrapper>
  );
}
