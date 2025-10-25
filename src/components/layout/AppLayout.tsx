import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../providers/ThemeProvider';
import { useUI, useEnvironments } from '../../hooks';
import { Sidebar, SidebarItem, SidebarSection, Header } from '..';
import type { BreadcrumbItemData } from '../organisms/Header/Header';

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background: ${({ theme }) => theme['primary-theme']};
`;

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout - Layout principal com Sidebar e Header
 * Usado por todas as páginas da aplicação
 */
export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme } = useTheme();
  const { activeNavItem, setActiveNavItem } = useUI();
  const { environments, activeEnvironment, setActiveEnvironment } = useEnvironments();

  const handleNavigation = (item: string, path: string) => {
    setActiveNavItem(item);
    navigate(path);
  };

  // Determina breadcrumb baseado na rota atual
  const getBreadcrumb = (): BreadcrumbItemData[] => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Home' }];
    if (path === '/collections') return [{ label: 'Collections' }];
    if (path === '/settings') return [{ label: 'Settings' }];
    return [{ label: 'Home' }];
  };

  return (
    <LayoutWrapper>
      <Sidebar>
        <SidebarSection title="Navigation">
          <SidebarItem
            label="Home"
            icon="🏠"
            active={activeNavItem === 'home'}
            onClick={() => handleNavigation('home', '/')}
          />
          <SidebarItem
            label="Collections"
            icon="📚"
            active={activeNavItem === 'collections'}
            onClick={() => handleNavigation('collections', '/collections')}
          />
          <SidebarItem
            label="Settings"
            icon="⚙️"
            active={activeNavItem === 'settings'}
            onClick={() => handleNavigation('settings', '/settings')}
          />
        </SidebarSection>
      </Sidebar>

      <ContentArea>
        <Header
          breadcrumbs={getBreadcrumb()}
          actions={[]}
          environments={environments}
          selectedEnvironment={activeEnvironment?.id || 'dev'}
          onEnvironmentChange={setActiveEnvironment}
          onThemeToggle={toggleTheme}
        />

        <MainContent>{children}</MainContent>
      </ContentArea>
    </LayoutWrapper>
  );
}
