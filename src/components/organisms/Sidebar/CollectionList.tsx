import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { SidebarCollection } from '../../../types';
import { CollectionItem } from './CollectionItem';

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme['layout-border']};
    border-radius: 3px;

    &:hover {
      background-color: ${({ theme }) => theme['secondary-text']};
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme['secondary-text']};
  font-size: 14px;
  gap: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 13px;
`;

interface CollectionListProps {
  collections: SidebarCollection[];
  searchQuery?: string;
  selectedRequestId?: string;
  activeRequestId?: string;
  onToggleCollection: (collectionId: string) => void;
  onRequestClick: (requestId: string) => void;
  onCollectionActionsClick?: (collectionId: string, event: React.MouseEvent) => void;
  onRequestActionsClick?: (requestId: string, event: React.MouseEvent) => void;
}

/**
 * CollectionList - Lista de coleções
 *
 * Exibe a lista completa de coleções com:
 * - Filtragem baseada em busca
 * - Estado vazio quando não há coleções
 * - Scroll customizado
 */
export const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  searchQuery = '',
  selectedRequestId,
  activeRequestId,
  onToggleCollection,
  onRequestClick,
  onCollectionActionsClick,
  onRequestActionsClick,
}) => {
  // Filter collections based on search query
  const filteredCollections = useMemo(() => {
    if (!searchQuery) return collections;

    const query = searchQuery.toLowerCase();

    return collections.filter((collection) => {
      const matchesName = collection.name.toLowerCase().includes(query);
      const hasMatchingRequest = collection.requests.some((req) => req.name.toLowerCase().includes(query));

      return matchesName || hasMatchingRequest;
    });
  }, [collections, searchQuery]);

  if (filteredCollections.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📚</EmptyIcon>
        <EmptyText>
          {searchQuery
            ? `No collections found for "${searchQuery}"`
            : 'No collections yet. Create your first collection to get started.'}
        </EmptyText>
      </EmptyState>
    );
  }

  return (
    <ListContainer data-testid="collection-list">
      {filteredCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          selectedRequestId={selectedRequestId}
          activeRequestId={activeRequestId}
          onToggle={onToggleCollection}
          onRequestClick={onRequestClick}
          onCollectionActionsClick={onCollectionActionsClick}
          onRequestActionsClick={onRequestActionsClick}
        />
      ))}
    </ListContainer>
  );
};
