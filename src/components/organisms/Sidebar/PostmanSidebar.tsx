import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveTab, setSearchQuery, toggleCollection, setSelectedRequest } from '../../../store/slices/sidebarSlice';
import { SidebarTabs } from './SidebarTabs';
import { SidebarHeaderActions } from './SidebarHeaderActions';
import { CollectionList } from './CollectionList';
import type { SidebarTab } from '../../../types';

const PostmanSidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme['sidebar-background']};
  overflow: hidden;
`;

const TabContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface PostmanSidebarProps {
  onCreateCollection?: () => void;
  onRequestClick?: (requestId: string) => void;
}

/**
 * PostmanSidebar - Sidebar completa estilo Postman
 *
 * Combina todos os componentes para criar uma experiência
 * similar ao Postman:
 * - Abas superiores (Collections, Environments, Flows, History)
 * - Header com botão criar e busca
 * - Lista de coleções com requests
 * - Totalmente integrado com Redux
 */
export const PostmanSidebar: React.FC<PostmanSidebarProps> = ({ onCreateCollection, onRequestClick }) => {
  const dispatch = useAppDispatch();
  const { activeTab, searchQuery, collections, environments, history, selectedRequestId } = useAppSelector(
    (state) => state.sidebar
  );

  const handleTabChange = (tab: SidebarTab) => {
    dispatch(setActiveTab(tab));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleCreateClick = () => {
    onCreateCollection?.();
  };

  const handleToggleCollection = (collectionId: string) => {
    dispatch(toggleCollection(collectionId));
  };

  const handleRequestClick = (requestId: string) => {
    dispatch(setSelectedRequest(requestId));
    onRequestClick?.(requestId);
  };

  const handleConfigClick = () => {
    // TODO: Implementar configurações da sidebar
    console.log('Configure sidebar clicked');
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'collections':
        return 'Search collections';
      case 'environments':
        return 'Search environments';
      case 'flows':
        return 'Search flows';
      case 'history':
        return 'Search history';
      default:
        return 'Search';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collections':
        return (
          <CollectionList
            collections={collections}
            searchQuery={searchQuery}
            selectedRequestId={selectedRequestId}
            onToggleCollection={handleToggleCollection}
            onRequestClick={handleRequestClick}
          />
        );

      case 'environments':
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</div>
            <div>Environments</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>{environments.length} environment(s)</div>
          </div>
        );

      case 'flows':
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔄</div>
            <div>Flows</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Coming soon</div>
          </div>
        );

      case 'history':
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕐</div>
            <div>History</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>{history.length} request(s)</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PostmanSidebarContainer data-testid="postman-sidebar">
      <SidebarTabs activeTab={activeTab} onTabChange={handleTabChange} onConfigClick={handleConfigClick} />

      <TabContent role="tabpanel" id={`sidebar-panel-${activeTab}`}>
        <SidebarHeaderActions
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onCreateClick={handleCreateClick}
          placeholder={getPlaceholder()}
        />

        {renderTabContent()}
      </TabContent>
    </PostmanSidebarContainer>
  );
};
