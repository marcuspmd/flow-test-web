import React from 'react';
import styled from 'styled-components';
import type { SidebarCollection, SidebarFolder } from '../../../types';
import { RequestItem } from './RequestItem';

const CollectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollectionHeader = styled.div<{ $isExpanded: boolean; $indentLevel: number }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px ${({ $indentLevel }) => 12 + $indentLevel * 16}px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  background: transparent;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }
`;

const ToggleButton = styled.button<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '90deg' : '0deg')});

  &:hover {
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const CollectionIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const CollectionName = styled.div`
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme['primary-text']};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;

  ${CollectionHeader}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme['layout-border']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const CollectionContent = styled.div<{ $isExpanded: boolean }>`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
`;

interface CollectionItemProps {
  collection: SidebarCollection;
  selectedRequestId?: string;
  activeRequestId?: string;
  indentLevel?: number;
  onToggle: (collectionId: string) => void;
  onRequestClick: (requestId: string) => void;
  onCollectionActionsClick?: (collectionId: string, event: React.MouseEvent) => void;
  onRequestActionsClick?: (requestId: string, event: React.MouseEvent) => void;
}

/**
 * CollectionItem - Item de coleção expansível
 *
 * Exibe uma coleção com:
 * - Botão de toggle (seta) para expandir/colapsar
 * - Nome da coleção
 * - Lista de requests quando expandido
 * - Suporte a hierarquia (pastas/subpastas)
 * - Botão de ações (três pontos)
 */
export const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  selectedRequestId,
  activeRequestId,
  indentLevel = 0,
  onToggle,
  onRequestClick,
  onCollectionActionsClick,
  onRequestActionsClick,
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(collection.id);
  };

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCollectionActionsClick?.(collection.id, e);
  };

  const hasItems = collection.requests.length > 0 || collection.folders.length > 0;

  return (
    <CollectionContainer data-testid={`collection-${collection.id}`}>
      <CollectionHeader
        $isExpanded={!!collection.isExpanded}
        $indentLevel={indentLevel}
        onClick={handleToggle}
        title={collection.name}
      >
        {hasItems && (
          <ToggleButton
            $isExpanded={!!collection.isExpanded}
            onClick={handleToggle}
            aria-label={collection.isExpanded ? 'Collapse collection' : 'Expand collection'}
            data-testid="collection-toggle-button"
          >
            ▶
          </ToggleButton>
        )}
        {!hasItems && <span style={{ width: '16px' }} />}

        <CollectionIcon>📚</CollectionIcon>
        <CollectionName>{collection.name}</CollectionName>

        {onCollectionActionsClick && (
          <ActionsButton
            onClick={handleActionsClick}
            aria-label="More actions"
            title="More actions"
            data-testid="collection-actions-button"
          >
            ⋮
          </ActionsButton>
        )}
      </CollectionHeader>

      <CollectionContent $isExpanded={!!collection.isExpanded}>
        {/* Render folders first */}
        {collection.folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            selectedRequestId={selectedRequestId}
            activeRequestId={activeRequestId}
            indentLevel={indentLevel + 1}
            onRequestClick={onRequestClick}
            onRequestActionsClick={onRequestActionsClick}
          />
        ))}

        {/* Then render direct requests */}
        {collection.requests.map((request) => (
          <RequestItem
            key={request.id}
            id={request.id}
            name={request.name}
            method={request.method}
            isSelected={selectedRequestId === request.id}
            isActive={activeRequestId === request.id}
            indentLevel={indentLevel + 1}
            onClick={onRequestClick}
            onActionsClick={onRequestActionsClick}
          />
        ))}
      </CollectionContent>
    </CollectionContainer>
  );
};

// Folder component (similar to collection but for nested folders)
const FolderItem: React.FC<{
  folder: SidebarFolder;
  selectedRequestId?: string;
  activeRequestId?: string;
  indentLevel: number;
  onRequestClick: (id: string) => void;
  onRequestActionsClick?: (id: string, event: React.MouseEvent) => void;
}> = ({ folder, selectedRequestId, activeRequestId, indentLevel, onRequestClick, onRequestActionsClick }) => {
  const [isExpanded, setIsExpanded] = React.useState(!!folder.isExpanded);

  const hasItems = folder.requests?.length > 0 || folder.subfolders?.length > 0;

  return (
    <div>
      <CollectionHeader
        $isExpanded={isExpanded}
        $indentLevel={indentLevel}
        onClick={() => setIsExpanded(!isExpanded)}
        title={folder.name}
      >
        {hasItems && (
          <ToggleButton
            $isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
          >
            ▶
          </ToggleButton>
        )}
        {!hasItems && <span style={{ width: '16px' }} />}

        <CollectionIcon>📁</CollectionIcon>
        <CollectionName>{folder.name}</CollectionName>
      </CollectionHeader>

      <CollectionContent $isExpanded={isExpanded}>
        {folder.subfolders?.map((subfolder: SidebarFolder) => (
          <FolderItem
            key={subfolder.id}
            folder={subfolder}
            selectedRequestId={selectedRequestId}
            activeRequestId={activeRequestId}
            indentLevel={indentLevel + 1}
            onRequestClick={onRequestClick}
            onRequestActionsClick={onRequestActionsClick}
          />
        ))}

        {folder.requests?.map((request) => (
          <RequestItem
            key={request.id}
            id={request.id}
            name={request.name}
            method={request.method}
            isSelected={selectedRequestId === request.id}
            isActive={activeRequestId === request.id}
            indentLevel={indentLevel + 1}
            onClick={onRequestClick}
            onActionsClick={onRequestActionsClick}
          />
        ))}
      </CollectionContent>
    </div>
  );
};
