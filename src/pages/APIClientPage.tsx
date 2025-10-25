import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RequestPane, RequestData } from '../components/organisms/RequestPane';
import { ResponsePane, ResponseData } from '../components/organisms/ResponsePane';
import { TreeView } from '../components/organisms/TreeView';
import { EnvironmentManager } from '../components/organisms/EnvironmentManager';
import { RootState } from '../store';
import { updateRequest } from '../store/slices/apiClientSlice';
import { addHistoryEntry } from '../store/slices/apiHistorySlice';
import { replaceVariablesInRequest } from '../utils/variableUtils';

const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
`;

const TopBar = styled.div`
  height: 50px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopBarActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary, theme }) => ($primary ? theme.brand : theme['primary-theme'])};
  color: ${({ $primary }) => ($primary ? '#fff' : 'inherit')};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 0.85;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const MainLayout = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  min-height: 40px;
  gap: 4px;
  padding: 0 8px;
`;

const Tab = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.1)' : 'transparent')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #007acc' : '2px solid transparent')};
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .tab-close {
    margin-left: 4px;
    font-size: 14px;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
`;

const PanelContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ResizablePanel = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

export const APIClientPage: React.FC = () => {
  const dispatch = useDispatch();
  const { workspaces, openTabs, activeTabId } = useSelector((state: RootState) => state.apiClient);
  const { environments, activeEnvironmentId, globalVariables } = useSelector(
    (state: RootState) => state.apiEnvironments
  );

  const [showEnvironmentManager, setShowEnvironmentManager] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topPanelHeight, setTopPanelHeight] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  // Busca request ativa
  const getActiveRequest = () => {
    if (!activeTabId) return null;
    for (const workspace of workspaces) {
      const request = workspace.requests.find((r) => r.id === activeTabId);
      if (request) return request;
    }
    return null;
  };

  const activeRequest = getActiveRequest();

  // Busca workspace que contém a request ativa
  const getActiveWorkspaceId = () => {
    if (!activeTabId) return null;
    for (const workspace of workspaces) {
      if (workspace.requests.some((r) => r.id === activeTabId)) {
        return workspace.id;
      }
    }
    return null;
  };

  const activeWorkspaceId = getActiveWorkspaceId();

  const handleRequestChange = (data: RequestData) => {
    if (!activeTabId || !activeWorkspaceId) return;

    const activeReq = getActiveRequest();
    dispatch(
      updateRequest({
        id: activeTabId,
        data,
        folderId: activeReq?.folderId,
      })
    );
  };

  const handleSend = async () => {
    if (!activeRequest) return;

    setIsLoading(true);

    try {
      // Obtém environment ativo
      const activeEnv = environments.find((e) => e.id === activeEnvironmentId);
      const envVars = activeEnv?.variables || [];
      const allVars = [...globalVariables, ...envVars];

      // Substitui variáveis no request
      const processedRequest = replaceVariablesInRequest(activeRequest.data, allVars);

      // Mock response (substituir por fetch real depois)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const startTime = Date.now();
      const endTime = Date.now();
      const responseTime = endTime - startTime + 800;

      const mockResponse: ResponseData = {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': '292',
          Connection: 'keep-alive',
          Date: new Date().toUTCString(),
          Server: 'nginx/1.18.0',
        },
        body: JSON.stringify(
          {
            userId: 1,
            id: 1,
            title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
            body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
          },
          null,
          2
        ),
        size: 292,
        time: responseTime,
        cookies: [{ name: 'session_id', value: 'abc123', domain: '.example.com' }],
        timeline: [
          { name: 'DNS Lookup', duration: 12, details: 'Resolving api.example.com' },
          { name: 'TCP Connection', duration: 45, details: 'Connecting to 192.168.1.1:443' },
          { name: 'TLS Handshake', duration: 67, details: 'SSL/TLS negotiation' },
          { name: 'Request Sent', duration: 3, details: 'Sending request headers and body' },
          { name: 'Waiting (TTFB)', duration: 23, details: 'Waiting for server response' },
          { name: 'Content Download', duration: 6, details: 'Downloading response body' },
        ],
        tests: [
          { name: 'Status code is 200', passed: true },
          { name: 'Response time < 500ms', passed: true },
          { name: 'Content-Type is JSON', passed: true },
        ],
      };

      setResponse(mockResponse);

      // Adiciona ao histórico
      dispatch(
        addHistoryEntry({
          request: processedRequest,
          response: mockResponse,
          duration: responseTime,
        })
      );
    } catch (error) {
      const errorResponse: ResponseData = {
        status: 0,
        statusText: 'Error',
        headers: {},
        body: String(error),
        size: 0,
        time: 0,
        cookies: [],
      };
      setResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const percentage = ((e.clientY - rect.top) / rect.height) * 100;

    if (percentage > 20 && percentage < 80) {
      setTopPanelHeight(percentage);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <WorkspaceContainer>
      <TopBar>
        <Logo>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Flow Test API Client
        </Logo>
        <TopBarActions>
          <Button onClick={() => setShowEnvironmentManager(true)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Environments
          </Button>
        </TopBarActions>
      </TopBar>

      <MainLayout>
        <Sidebar>
          <TreeView />
        </Sidebar>

        <MainContent>
          {openTabs.length > 0 && (
            <TabBar>
              {openTabs.map((tabId) => {
                const request = workspaces.flatMap((w) => w.requests).find((r) => r.id === tabId);
                return (
                  <Tab key={tabId} $active={tabId === activeTabId}>
                    <span>{request?.name || 'Untitled'}</span>
                  </Tab>
                );
              })}
            </TabBar>
          )}

          <PanelContainer onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {!activeRequest ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  color: '#888',
                }}
              >
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>No request selected</h3>
                  <p style={{ margin: 0, fontSize: 13 }}>Create a new request or select one from the sidebar</p>
                </div>
              </div>
            ) : (
              <>
                <ResizablePanel $height={topPanelHeight}>
                  <RequestPane
                    request={activeRequest.data}
                    onChange={handleRequestChange}
                    onSend={handleSend}
                    onSave={() => console.log('Save request')}
                    isLoading={isLoading}
                  />
                  <ResizeHandle onMouseDown={handleMouseDown} />
                </ResizablePanel>

                <BottomPanel>
                  <ResponsePane response={response} isLoading={isLoading} />
                </BottomPanel>
              </>
            )}
          </PanelContainer>
        </MainContent>
      </MainLayout>

      {showEnvironmentManager && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEnvironmentManager(false)}
        >
          <div style={{ width: '80%', maxWidth: 1200, height: '80%' }} onClick={(e) => e.stopPropagation()}>
            <EnvironmentManager onClose={() => setShowEnvironmentManager(false)} />
          </div>
        </div>
      )}
    </WorkspaceContainer>
  );
};

export default APIClientPage;
