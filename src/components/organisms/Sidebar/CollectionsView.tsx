import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSearchQuery, toggleCollection, setSelectedRequest } from '../../../store/slices/sidebarSlice';
import { SidebarHeaderActions } from './SidebarHeaderActions';
import { CollectionList } from './CollectionList';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

interface CollectionsViewProps {
  onCreateCollection?: () => void;
  onRequestClick?: (requestId: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onCreateCollection, onRequestClick }) => {
  const dispatch = useAppDispatch();
  const { searchQuery, collections, selectedRequestId } = useAppSelector((state) => state.sidebar);

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

  return (
    <ViewContainer>
      <SidebarHeaderActions
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateClick={handleCreateClick}
        placeholder="Search collections"
      />
      <CollectionList
        collections={collections}
        searchQuery={searchQuery}
        selectedRequestId={selectedRequestId}
        onToggleCollection={handleToggleCollection}
        onRequestClick={handleRequestClick}
      />
    </ViewContainer>
  );
};
