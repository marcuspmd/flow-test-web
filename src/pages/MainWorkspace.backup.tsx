import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PostmanSidebar } from '../components/organisms/Sidebar';
import { useAppDispatch } from '../store';
import { setCollections } from '../store/slices/sidebarSlice';
import { mockCollections } from '../data/mockSidebarData';

const WorkspaceContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
`;

const SidebarWrapper = styled.div`
  width: 298px;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  color: ${({ theme }) => theme['primary-text']};
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
    margin-bottom: 24px;
  }
`;

interface MainWorkspaceProps {
  children?: React.ReactNode;
}

/**
 * MainWorkspace - Layout principal da aplicação
 *
 * Integra a PostmanSidebar com a área de conteúdo principal
 */
export default function MainWorkspace({ children }: MainWorkspaceProps) {
  const dispatch = useAppDispatch();

  // Inicializar dados de exemplo na sidebar
  useEffect(() => {
    dispatch(setCollections(mockCollections));
  }, [dispatch]);

  const handleCreateCollection = () => {
    console.log('Create collection clicked');
    // TODO: Implementar modal de criação
  };

  const handleRequestClick = (requestId: string) => {
    console.log('Request clicked:', requestId);
    // TODO: Implementar abertura de request em tab
  };

  return (
    <WorkspaceContainer>
      <SidebarWrapper>
        <PostmanSidebar onCreateCollection={handleCreateCollection} onRequestClick={handleRequestClick} />
      </SidebarWrapper>

      <MainContent>
        <ContentArea>
          {children ? (
            children
          ) : (
            <WelcomeScreen>
              <div className="icon">🚀</div>
              <h1>Flow Test Engine</h1>
              <p>Select a request from the collection to get started</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>Or use the + button to create a new collection</p>
            </WelcomeScreen>
          )}
        </ContentArea>
      </MainContent>
    </WorkspaceContainer>
  );
}
