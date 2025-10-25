import React, { useRef } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ theme }) => theme['sidebar-background']};
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand};
    outline-offset: -2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme['secondary-text']};
  pointer-events: none;
  font-size: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 32px 6px 32px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.brand}33;
  }
`;

const ClearButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  right: 6px;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme['sidebar-collection-item-active-background']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

interface SidebarHeaderActionsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
  placeholder?: string;
}

/**
 * SidebarHeaderActions - Header com botão criar e campo de busca
 *
 * Componente de header inspirado no Postman com:
 * - Botão de criar nova coleção/item
 * - Campo de busca com ícone e botão limpar
 */
export const SidebarHeaderActions: React.FC<SidebarHeaderActionsProps> = ({
  searchQuery,
  onSearchChange,
  onCreateClick,
  placeholder = 'Search collections',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <HeaderContainer>
      <ActionsRow>
        <CreateButton
          onClick={onCreateClick}
          aria-label="Create new"
          title="Create new"
          data-testid="sidebar-create-button"
        >
          <span style={{ fontSize: '18px' }}>+</span>
        </CreateButton>

        <SearchContainer>
          <SearchIcon aria-hidden="true">🔍</SearchIcon>
          <SearchInput
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="search"
            data-testid="sidebar-search-input"
          />
          <ClearButton
            $visible={searchQuery.length > 0}
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
            data-testid="sidebar-search-clear"
          >
            ✕
          </ClearButton>
        </SearchContainer>
      </ActionsRow>
    </HeaderContainer>
  );
};
