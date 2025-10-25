import React from 'react';
import styled from 'styled-components';
import type { HttpMethod } from '../../../types';

const RequestItemContainer = styled.div<{ $isSelected: boolean; $isActive: boolean; $indentLevel: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px ${({ $indentLevel }) => 12 + $indentLevel * 16}px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  background: ${({ $isSelected, $isActive, theme }) => {
    if ($isActive) return theme['sidebar-collection-item-active-background'];
    if ($isSelected) return theme['sidebar-collection-item-active-background'];
    return 'transparent';
  }};
  border-left: 3px solid ${({ $isActive, theme }) => ($isActive ? theme.brand : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }
`;

const MethodLabel = styled.div<{ $method: HttpMethod }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: #ffffff;
  background: ${({ $method, theme }) => {
    const methodColors: Record<HttpMethod, string> = {
      GET: theme['method-get'],
      POST: theme['method-post'],
      PUT: theme.brand,
      DELETE: theme['method-delete'],
      PATCH: theme['method-patch'],
      HEAD: theme['method-head'],
      OPTIONS: theme['method-options'],
    };
    return methodColors[$method] || theme['secondary-text'];
  }};
`;

const RequestName = styled.div`
  flex: 1;
  font-size: 13px;
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

  ${RequestItemContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme['layout-border']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

interface RequestItemProps {
  id: string;
  name: string;
  method: HttpMethod;
  isSelected?: boolean;
  isActive?: boolean;
  indentLevel?: number;
  onClick: (id: string) => void;
  onActionsClick?: (id: string, event: React.MouseEvent) => void;
}

/**
 * RequestItem - Item de request com método HTTP colorido
 *
 * Exibe um request individual com:
 * - Label do método HTTP colorido (GET, POST, etc.)
 * - Nome do request
 * - Botão de ações (três pontos)
 * - Indentação baseada na hierarquia
 */
export const RequestItem: React.FC<RequestItemProps> = ({
  id,
  name,
  method,
  isSelected = false,
  isActive = false,
  indentLevel = 0,
  onClick,
  onActionsClick,
}) => {
  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActionsClick?.(id, e);
  };

  return (
    <RequestItemContainer
      $isSelected={isSelected}
      $isActive={isActive}
      $indentLevel={indentLevel}
      onClick={() => onClick(id)}
      title={name}
      data-testid={`request-item-${id}`}
    >
      <MethodLabel $method={method}>{method}</MethodLabel>
      <RequestName>{name}</RequestName>
      {onActionsClick && (
        <ActionsButton
          onClick={handleActionsClick}
          aria-label="More actions"
          title="More actions"
          data-testid="request-actions-button"
        >
          ⋮
        </ActionsButton>
      )}
    </RequestItemContainer>
  );
};
