import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  MiniSidebar,
  SidebarContentArea,
  CollectionsView,
  EnvironmentsView,
  HistoryView,
  SettingsView,
} from '../components/organisms/Sidebar';
import { useAppDispatch, useAppSelector } from '../store';
import { setCollections, setSelectedRequest, setActiveView } from '../store/slices/sidebarSlice';
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

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  overflow-x: auto;
  min-height: 42px;
  padding: 0 8px;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['layout-border']};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme['secondary-text']};
    }
  }
`;

const Tab = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme['primary-theme'] : 'transparent')};
  border-radius: 6px 6px 0 0;
  border-bottom: ${({ $active, theme }) => ($active ? `2px solid ${theme.brand}` : '2px solid transparent')};
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
  position: relative;
  margin-bottom: -1px;
  ${({ $active }) => $active && 'box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);'}

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme['primary-theme'] : theme['sidebar-collection-item-active-background']};
    ${({ $active }) => !$active && 'transform: translateY(-1px);'}
  }

  .tab-method {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 7px;
    border-radius: 4px;
    color: white;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .tab-close {
    margin-left: 4px;
    padding: 3px 5px;
    border-radius: 4px;
    opacity: 0.5;
    transition: all 0.15s ease;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

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
  padding: 10px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme['secondary-text']};

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .panel-icon {
      font-size: 14px;
      opacity: 0.7;
    }
  }

  .panel-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
    text-transform: none;
    letter-spacing: normal;
  }

  .panel-action-btn {
    padding: 4px 8px;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme['secondary-text']};
    cursor: pointer;
    border-radius: 4px;
    font-size: 11px;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme['primary-theme']};
      color: ${({ theme }) => theme['primary-text']};
    }
  }
`;

const URLBar = styled.div`
  padding: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: ${({ theme }) => theme['primary-theme']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};

  .url-input-group {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 6px;
    background: ${({ theme }) => theme['primary-theme']};
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:focus-within {
      border-color: ${({ theme }) => theme.brand};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}33;
    }

    &:hover {
      border-color: ${({ theme }) => theme.brand}66;
    }

    .url-icon {
      font-size: 14px;
      opacity: 0.5;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      color: ${({ theme }) => theme['primary-text']};
      font-size: 13px;
      outline: none;

      &::placeholder {
        color: ${({ theme }) => theme['secondary-text']};
        opacity: 0.6;
      }
    }
  }

  select {
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme['layout-border']};
    border-radius: 6px;
    background: ${({ theme }) => theme['sidebar-background']};
    color: ${({ theme }) => theme['primary-text']};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      border-color: ${({ theme }) => theme.brand};
    }

    &:focus {
      border-color: ${({ theme }) => theme.brand};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}33;
    }
  }

  button {
    padding: 8px 24px;
    border: none;
    border-radius: 6px;
    background: ${({ theme }) => theme.brand};
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
`;

const RequestTabs = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 13px;
`;

const RequestTab = styled.div<{ $active?: boolean }>`
  padding: 12px 0;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  border-bottom: ${({ $active, theme }) => ($active ? `2px solid ${theme.brand}` : '2px solid transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme['primary-text']};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.brand};
      animation: slideIn 0.2s ease;
    }

    @keyframes slideIn {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
  `}
`;

const RequestBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: ${({ theme }) => theme['primary-theme']};

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['layout-border']};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme['secondary-text']};
    }
  }
`;

const VerticalDragHandle = styled.div`
  height: 5px;
  cursor: row-resize;
  background: ${({ theme }) => theme['layout-border']};
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 3px;
    background: ${({ theme }) => theme['secondary-text']};
    border-radius: 2px;
    opacity: 0.3;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.brand}33;

    &::before {
      opacity: 0.6;
      background: ${({ theme }) => theme.brand};
    }
  }

  &:active {
    background: ${({ theme }) => theme.brand}66;
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
  gap: 20px;
  padding: 0 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 13px;
`;

const ResponseBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: ${({ theme }) => theme['primary-theme']};

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['layout-border']};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme['secondary-text']};
    }
  }

  pre {
    margin: 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    padding: 16px;
    background: ${({ theme }) => theme['sidebar-background']};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme['layout-border']};
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
  opacity: 0.7;
  font-size: 13px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 0.7;
      transform: translateY(0);
    }
  }

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.3;
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
  const { activeView } = useAppSelector((state) => state.sidebar);

  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [currentMethod, setCurrentMethod] = useState('GET');
  const [currentUrl, setCurrentUrl] = useState('https://api.example.com/endpoint');
  const [activeRequestTab, setActiveRequestTab] = useState('params');
  const [requestPanelHeight, setRequestPanelHeight] = useState(50);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState('body');

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

  const renderSidebarView = () => {
    switch (activeView) {
      case 'collections':
        return <CollectionsView onCreateCollection={handleCreateCollection} onRequestClick={handleRequestClick} />;
      case 'environments':
        return <EnvironmentsView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CollectionsView onCreateCollection={handleCreateCollection} onRequestClick={handleRequestClick} />;
    }
  };

  return (
    <WorkspaceWrapper>
      <SidebarContainer>
        <MiniSidebar activeView={activeView} onViewChange={handleViewChange} />
        <SidebarContentArea activeView={activeView}>{renderSidebarView()}</SidebarContentArea>
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
                <PanelHeader>
                  <div className="panel-title">
                    <span className="panel-icon">📤</span>
                    <span>Request</span>
                  </div>
                  <div className="panel-actions">
                    <span className="panel-badge">{currentMethod}</span>
                  </div>
                </PanelHeader>

                <URLBar>
                  <select value={currentMethod} onChange={(e) => setCurrentMethod(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>

                  <div className="url-input-group">
                    <span className="url-icon">🔗</span>
                    <input
                      type="text"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="Enter request URL"
                    />
                  </div>

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
                  {activeRequestTab === 'params' && (
                    <EmptyState>
                      <div className="icon">🔍</div>
                      <div>No query parameters</div>
                    </EmptyState>
                  )}
                  {activeRequestTab === 'headers' && (
                    <EmptyState>
                      <div className="icon">📋</div>
                      <div>No headers</div>
                    </EmptyState>
                  )}
                  {activeRequestTab === 'body' && (
                    <EmptyState>
                      <div className="icon">📄</div>
                      <div>No body</div>
                    </EmptyState>
                  )}
                  {activeRequestTab === 'auth' && (
                    <EmptyState>
                      <div className="icon">🔐</div>
                      <div>No authorization</div>
                    </EmptyState>
                  )}
                </RequestBody>
              </RequestPanel>

              <VerticalDragHandle onMouseDown={handleVerticalDragStart} />

              <ResponsePanel>
                <PanelHeader>
                  <div className="panel-title">
                    <span className="panel-icon">📥</span>
                    <span>Response</span>
                  </div>
                  <div className="panel-actions">
                    <span className="panel-badge">Ready</span>
                  </div>
                </PanelHeader>

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
                      <div className="icon">📡</div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'inherit' }}>
                        Hit Send to execute the request
                      </div>
                    </EmptyState>
                  )}
                  {activeResponseTab === 'headers' && (
                    <EmptyState>
                      <div className="icon">📋</div>
                      <div>No response yet</div>
                    </EmptyState>
                  )}
                  {activeResponseTab === 'console' && (
                    <EmptyState>
                      <div className="icon">💬</div>
                      <div>No console logs</div>
                    </EmptyState>
                  )}
                </ResponseBody>
              </ResponsePanel>
            </ContentArea>
          </>
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
