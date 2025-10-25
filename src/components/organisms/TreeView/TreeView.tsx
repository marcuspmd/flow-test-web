import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as S from './TreeView.styles';
import { RootState } from '../../../store';
import {
  createWorkspace,
  createFolder,
  createRequest,
  deleteWorkspace,
  deleteFolder,
  deleteRequest,
  updateWorkspace,
  updateFolder,
  updateRequest,
  duplicateRequest,
  openTab,
} from '../../../store/slices/apiClientSlice';

interface TreeViewProps {
  onRequestSelect?: (requestId: string) => void;
}

interface TreeNode {
  id: string;
  type: 'workspace' | 'folder' | 'request';
  name: string;
  method?: string;
  level: number;
  parentId?: string;
  workspaceId?: string;
  folderId?: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  node: TreeNode | null;
}

/**
 * TreeView Component
 * Sidebar com estrutura hierárquica de workspaces, folders e requests
 */
export const TreeView: React.FC<TreeViewProps> = ({ onRequestSelect }) => {
  const dispatch = useDispatch();
  const { workspaces, activeTabId } = useSelector((state: RootState) => state.apiClient);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  // Fecha context menu ao clicar fora
  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, node: null });
    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);

  // Toggle expansão de um nó
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Gera lista flat de nós da árvore
  const getTreeNodes = useCallback((): TreeNode[] => {
    const nodes: TreeNode[] = [];

    workspaces.forEach((workspace) => {
      const workspaceNode: TreeNode = {
        id: workspace.id,
        type: 'workspace',
        name: workspace.name,
        level: 0,
      };
      nodes.push(workspaceNode);

      if (expandedIds.has(workspace.id)) {
        // Adiciona folders
        workspace.folders.forEach((folder) => {
          const folderNode: TreeNode = {
            id: folder.id,
            type: 'folder',
            name: folder.name,
            level: 1,
            parentId: workspace.id,
            workspaceId: workspace.id,
          };
          nodes.push(folderNode);

          if (expandedIds.has(folder.id)) {
            // Adiciona requests desse folder
            workspace.requests
              .filter((request) => request.folderId === folder.id)
              .forEach((request) => {
                const requestNode: TreeNode = {
                  id: request.id,
                  type: 'request',
                  name: request.name,
                  method: request.data.method,
                  level: 2,
                  parentId: folder.id,
                  workspaceId: workspace.id,
                  folderId: folder.id,
                };
                nodes.push(requestNode);
              });
          }
        });

        // Adiciona requests diretos do workspace (sem folder)
        workspace.requests
          .filter((request) => !request.folderId)
          .forEach((request) => {
            const requestNode: TreeNode = {
              id: request.id,
              type: 'request',
              name: request.name,
              method: request.data.method,
              level: 1,
              parentId: workspace.id,
              workspaceId: workspace.id,
            };
            nodes.push(requestNode);
          });
      }
    });

    return nodes;
  }, [workspaces, expandedIds]);

  // Handlers
  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'request') {
      dispatch(openTab(node.id)); // openTab recebe apenas string
      onRequestSelect?.(node.id);
    } else {
      toggleExpand(node.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const handleCreateWorkspace = () => {
    const name = prompt('Workspace name:');
    if (name) {
      dispatch(createWorkspace({ name }));
    }
  };

  const handleCreateFolder = (workspaceId: string) => {
    const name = prompt('Folder name:');
    if (name) {
      dispatch(createFolder({ workspaceId, name }));
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleCreateRequest = (workspaceId: string, folderId?: string) => {
    const name = prompt('Request name:');
    if (name) {
      dispatch(
        createRequest({
          workspaceId,
          folderId,
          name,
          data: {
            method: 'GET',
            url: '',
            params: [],
            headers: [],
            body: {
              type: 'none',
              content: '',
            },
            auth: {
              type: 'none',
              config: {},
            },
          },
        })
      );
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleRename = (node: TreeNode) => {
    const name = prompt(`Rename ${node.type}:`, node.name);
    if (name && name !== node.name) {
      if (node.type === 'workspace') {
        dispatch(updateWorkspace({ id: node.id, name }));
      } else if (node.type === 'folder') {
        dispatch(updateFolder({ id: node.id, name }));
      } else if (node.type === 'request') {
        dispatch(updateRequest({ id: node.id, name }));
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleDuplicate = (node: TreeNode) => {
    if (node.type === 'request') {
      dispatch(duplicateRequest(node.id)); // duplicateRequest recebe apenas id
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const handleDelete = (node: TreeNode) => {
    if (!confirm(`Delete ${node.type} "${node.name}"?`)) return;

    if (node.type === 'workspace') {
      dispatch(deleteWorkspace(node.id));
    } else if (node.type === 'folder') {
      dispatch(deleteFolder(node.id)); // deleteFolder recebe apenas id
    } else if (node.type === 'request') {
      dispatch(deleteRequest(node.id)); // deleteRequest recebe apenas id
    }
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  // Renderização de ícones
  const renderIcon = (node: TreeNode) => {
    if (node.type === 'workspace') {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      );
    }
    if (node.type === 'folder') {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      );
    }
    // Request icon (method badge)
    return <span style={{ fontSize: '10px', fontWeight: 600 }}>{node.method}</span>;
  };

  const nodes = getTreeNodes();

  return (
    <S.TreeViewWrapper>
      <S.Header>
        <S.Title>Collections</S.Title>
        <S.HeaderActions>
          <S.IconButton onClick={handleCreateWorkspace} title="New Workspace">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </S.IconButton>
        </S.HeaderActions>
      </S.Header>

      <S.TreeContainer>
        {nodes.length === 0 ? (
          <S.EmptyState>
            <S.EmptyStateIcon>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </S.EmptyStateIcon>
            <S.EmptyStateText>No collections yet</S.EmptyStateText>
            <S.EmptyStateSubtext>Create a workspace to get started</S.EmptyStateSubtext>
          </S.EmptyState>
        ) : (
          nodes.map((node) => (
            <S.TreeItem
              key={node.id}
              $level={node.level}
              $isActive={node.type === 'request' && activeTabId === node.id}
              onClick={() => handleNodeClick(node)}
              onContextMenu={(e) => handleContextMenu(e, node)}
            >
              {node.type !== 'request' && (
                <S.ExpandIcon $expanded={expandedIds.has(node.id)}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </S.ExpandIcon>
              )}
              {node.type === 'request' && <div style={{ width: 16 }} />}
              <S.ItemIcon $type={node.type} $method={node.method}>
                {renderIcon(node)}
              </S.ItemIcon>
              <S.ItemText>{node.name}</S.ItemText>
            </S.TreeItem>
          ))
        )}
      </S.TreeContainer>

      {contextMenu.visible && contextMenu.node && (
        <S.ContextMenu $x={contextMenu.x} $y={contextMenu.y}>
          {contextMenu.node.type === 'workspace' && (
            <>
              <S.ContextMenuItem onClick={() => contextMenu.node && handleCreateFolder(contextMenu.node.id)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                New Folder
              </S.ContextMenuItem>
              <S.ContextMenuItem onClick={() => contextMenu.node && handleCreateRequest(contextMenu.node.id)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </S.ContextMenuItem>
              <S.ContextMenuSeparator />
            </>
          )}

          {contextMenu.node.type === 'folder' && contextMenu.node.workspaceId && (
            <>
              <S.ContextMenuItem
                onClick={() =>
                  contextMenu.node &&
                  contextMenu.node.workspaceId &&
                  handleCreateRequest(contextMenu.node.workspaceId, contextMenu.node.id)
                }
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </S.ContextMenuItem>
              <S.ContextMenuSeparator />
            </>
          )}

          <S.ContextMenuItem onClick={() => contextMenu.node && handleRename(contextMenu.node)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Rename
          </S.ContextMenuItem>

          {contextMenu.node.type === 'request' && (
            <S.ContextMenuItem onClick={() => contextMenu.node && handleDuplicate(contextMenu.node)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Duplicate
            </S.ContextMenuItem>
          )}

          <S.ContextMenuSeparator />
          <S.ContextMenuItem $danger onClick={() => contextMenu.node && handleDelete(contextMenu.node)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </S.ContextMenuItem>
        </S.ContextMenu>
      )}
    </S.TreeViewWrapper>
  );
};
