import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { PostmanSidebar } from '../components/organisms/Sidebar';
import { useAppDispatch } from '../store';
import { setCollections, setSelectedRequest } from '../store/slices/sidebarSlice';
import { mockCollections } from '../data/mockSidebarData';

const DEFAULT_SIDEBAR_WIDTH = 280;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;

const WorkspaceWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
`;

const SidebarContainer = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  height: 100%;
  position: relative;
  flex-shrink: 0;
`;

const DragHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 100;
  background: transparent;
  transition: background 0.2s;

  &:hover,
  &:active {
    background: ${({ theme }) => theme.brand};
  }
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  overflow-x: auto;
  min-height: 40px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['layout-border']};
    border-radius: 2px;
  }
`;

const Tab = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ $active, theme }) => ($active ? theme['primary-theme'] : 'transparent')};
  border-bottom: ${({ $active, theme }) => ($active ? `2px solid ${theme.brand}` : '2px solid transparent')};
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }

  .tab-method {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    color: white;
  }

  .tab-close {
    margin-left: 4px;
    padding: 2px 4px;
    border-radius: 3px;
    opacity: 0.6;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RequestPanel = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const URLBar = styled.div`
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: ${({ theme }) => theme['primary-theme']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};

  select {
    padding: 6px 12px;
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 4px;
    background: ${({ theme }) => theme['sidebar-background']};
    color: ${({ theme }) => theme['primary-text']};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.brand};
    }
  }

  input {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 4px;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
    font-size: 13px;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.brand};
    }
  }

  button {
    padding: 6px 20px;
    border: none;
    border-radius: 4px;
    background: ${({ theme }) => theme.brand};
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const RequestTabs = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 12px;
`;

const RequestTab = styled.div<{ $active?: boolean }>`
  padding: 6px 0;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  border-bottom: ${({ $active, theme }) => ($active ? `2px solid ${theme.brand}` : '2px solid transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const RequestBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: ${({ theme }) => theme['primary-theme']};
`;

const VerticalDragHandle = styled.div`
  height: 4px;
  cursor: row-resize;
  background: transparent;
  transition: background 0.2s;
  position: relative;
  z-index: 10;

  &:hover,
  &:active {
    background: ${({ theme }) => theme.brand};
  }
`;

const ResponsePanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ResponseTabs = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 12px;
`;

const ResponseBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: ${({ theme }) => theme['primary-theme']};

  pre {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.6;
  }
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

  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.3;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${({ theme }) => theme['primary-text']};
  }

  p {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
`;

interface OpenTab {
  id: string;
  name: string;
  method: string;
  url: string;
}

interface MainWorkspaceProps {
  children?: React.ReactNode;
}

export default function MainWorkspace({ children }: MainWorkspaceProps) {
  const dispatch = useAppDispatch();

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [currentMethod, setCurrentMethod] = useState('GET');
  const [currentUrl, setCurrentUrl] = useState('https://api.example.com/endpoint');
  const [activeRequestTab, setActiveRequestTab] = useState('params');
  const [requestPanelHeight, setRequestPanelHeight] = useState(50);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState('body');

  const lastWidthRef = useRef(DEFAULT_SIDEBAR_WIDTH);

  // Inicializar dados de exemplo
  useEffect(() => {
    dispatch(setCollections(mockCollections));
  }, [dispatch]);

  // Drag horizontal (sidebar)
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX));
      if (Math.abs(newWidth - lastWidthRef.current) >= 3) {
        lastWidthRef.current = newWidth;
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
    if (isDraggingVertical) setIsDraggingVertical(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
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

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleVerticalMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isDraggingVertical]);

  const handleCreateCollection = () => {
    console.log('Create collection');
  };

  const handleRequestClick = (requestId: string) => {
    dispatch(setSelectedRequest(requestId));
    
    // Encontrar o request no mock data
    let foundRequest: { id: string; name: string; method: string; url?: string } | null = null;
    for (const collection of mockCollections) {
      const req = collection.requests.find((r) => r.id === requestId);
      if (req) {
        foundRequest = req;
        break;
      }
      // Verificar em folders também
      for (const folder of collection.folders) {
        const req = folder.requests.find((r) => r.id === requestId);
        if (req) {
          foundRequest = req;
          break;
        }
      }
    }

    if (foundRequest) {
      // Verificar se já está aberto
      const existingTab = openTabs.find((tab) => tab.id === requestId);
      if (existingTab) {
        setActiveTabId(requestId);
      } else {
        // Abrir nova tab
        const newTab: OpenTab = {
          id: requestId,
          name: foundRequest.name,
          method: foundRequest.method,
          url: foundRequest.url || 'https://api.example.com/endpoint',
        };
        setOpenTabs([...openTabs, newTab]);
        setActiveTabId(requestId);
        setCurrentMethod(foundRequest.method);
        setCurrentUrl(foundRequest.url || 'https://api.example.com/endpoint');
      }
    }
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((tab) => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = openTabs.find((t) => t.id === tabId);
    if (tab) {
      setCurrentMethod(tab.method);
      setCurrentUrl(tab.url);
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#059669',
      POST: '#8e44ad',
      PUT: '#546de5',
      DELETE: '#b91c1c',
      PATCH: '#343434',
    };
    return colors[method] || '#999';
  };

  return (
    <WorkspaceWrapper>
      <SidebarContainer $width={sidebarWidth}>
        <PostmanSidebar onCreateCollection={handleCreateCollection} onRequestClick={handleRequestClick} />
        <DragHandle onMouseDown={handleDragStart} />
      </SidebarContainer>

      <MainSection>
        {children ? (
          <ContentArea>{children}</ContentArea>
        ) : openTabs.length > 0 ? (
          <>
            <TabsContainer>
              {openTabs.map((tab) => (
                <Tab key={tab.id} $active={activeTabId === tab.id} onClick={() => switchTab(tab.id)}>
                  <span className="tab-method" style={{ background: getMethodColor(tab.method) }}>
                    {tab.method}
                  </span>
                  <span>{tab.name}</span>
                  <span className="tab-close" onClick={(e) => closeTab(tab.id, e)}>
                    ✕
                  </span>
                </Tab>
              ))}
            </TabsContainer>

            <ContentArea className="content-area">
              <RequestPanel $height={requestPanelHeight}>
                <PanelHeader>Request</PanelHeader>

                <URLBar>
                  <select value={currentMethod} onChange={(e) => setCurrentMethod(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                  <input type="text" value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} placeholder="Enter request URL" />
                  <button>Send</button>
                </URLBar>

                <RequestTabs>
                  <RequestTab $active={activeRequestTab === 'params'} onClick={() => setActiveRequestTab('params')}>
                    Params
                  </RequestTab>
                  <RequestTab $active={activeRequestTab === 'headers'} onClick={() => setActiveRequestTab('headers')}>
                    Headers
                  </RequestTab>
                  <RequestTab $active={activeRequestTab === 'body'} onClick={() => setActiveRequestTab('body')}>
                    Body
                  </RequestTab>
                  <RequestTab $active={activeRequestTab === 'auth'} onClick={() => setActiveRequestTab('auth')}>
                    Auth
                  </RequestTab>
                </RequestTabs>

                <RequestBody>
                  {activeRequestTab === 'params' && <EmptyState>No query parameters</EmptyState>}
                  {activeRequestTab === 'headers' && <EmptyState>No headers</EmptyState>}
                  {activeRequestTab === 'body' && <EmptyState>No body</EmptyState>}
                  {activeRequestTab === 'auth' && <EmptyState>No authorization</EmptyState>}
                </RequestBody>
              </RequestPanel>

              <VerticalDragHandle onMouseDown={handleVerticalDragStart} />

              <ResponsePanel>
                <PanelHeader>Response</PanelHeader>

                <ResponseTabs>
                  <RequestTab $active={activeResponseTab === 'body'} onClick={() => setActiveResponseTab('body')}>
                    Body
                  </RequestTab>
                  <RequestTab $active={activeResponseTab === 'headers'} onClick={() => setActiveResponseTab('headers')}>
                    Headers
                  </RequestTab>
                  <RequestTab $active={activeResponseTab === 'console'} onClick={() => setActiveResponseTab('console')}>
                    Console
                  </RequestTab>
                </ResponseTabs>

                <ResponseBody>
                  {activeResponseTab === 'body' && (
                    <EmptyState>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
                      <div>Hit Send to execute the request</div>
                    </EmptyState>
                  )}
                  {activeResponseTab === 'headers' && <EmptyState>No response yet</EmptyState>}
                  {activeResponseTab === 'console' && <EmptyState>No console logs</EmptyState>}
                </ResponseBody>
              </ResponsePanel>
            </ContentArea>
          </>
        ) : (
          <WelcomeScreen>
            <div className="icon">🚀</div>
            <h1>Flow Test Engine</h1>
            <p>Select a request from the collection to get started</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>Or use the + button to create a new collection</p>
          </WelcomeScreen>
        )}
      </MainSection>
    </WorkspaceWrapper>
  );
}
