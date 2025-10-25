import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { searchQuery, collections, selectedRequestId } = useAppSelector((state) => state.sidebar);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleCreateClick = () => {
    // Navigate to new test suite page
    navigate('/new-test');
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
