import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../..';

const BrowserContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
  max-height: 600px;
`;

const BrowserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const BrowserTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  background: ${({ theme }) => theme['codemirror-background']};
  color: ${({ theme }) => theme['primary-text']};
  font-size: 14px;
  font-family: 'Monaco', 'Courier New', monospace;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme['method-get']};
  }

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
  }
`;

const FileTree = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  background: ${({ theme }) => theme['codemirror-background']};
`;

const FileItem = styled.div<{ $isSelected: boolean; $isDirectory: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: ${({ $isDirectory }) => ($isDirectory ? 'default' : 'pointer')};
  background: ${({ $isSelected, theme }) => ($isSelected ? theme['method-get'] : 'transparent')};
  color: ${({ $isSelected, theme }) => ($isSelected ? '#fff' : theme['primary-text'])};
  font-size: 13px;
  font-family: 'Monaco', 'Courier New', monospace;

  &:hover {
    background: ${({ $isSelected, theme }) => ($isSelected ? theme['method-get'] : 'rgba(255, 255, 255, 0.05)')};
  }
`;

const FileIcon = styled.span`
  font-size: 16px;
  min-width: 20px;
  text-align: center;
`;

const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-left: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
  gap: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.3;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
`;

const SelectedPath = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme['codemirror-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Monaco', 'Courier New', monospace;
  color: ${({ theme }) => theme['method-get']};
  overflow-x: auto;
  white-space: nowrap;
`;

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  children?: FileNode[];
}

interface FileBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filePath: string, content: string) => void;
  filter?: 'yaml' | 'all';
  title?: string;
}

export function FileBrowserModal({
  isOpen,
  onClose,
  onSelect,
  filter = 'yaml',
  title = 'Select Test Suite File',
}: FileBrowserModalProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção, isso virá de uma API
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    // Simula carregamento de arquivos
    setTimeout(() => {
      const mockFiles: FileNode[] = [
        {
          name: 'tests',
          path: 'tests',
          isDirectory: true,
          children: [
            {
              name: 'auth-flow.yaml',
              path: 'tests/auth-flow.yaml',
              isDirectory: false,
              size: 1234,
            },
            {
              name: 'user-crud.yaml',
              path: 'tests/user-crud.yaml',
              isDirectory: false,
              size: 2345,
            },
            {
              name: 'api-tests.yaml',
              path: 'tests/api-tests.yaml',
              isDirectory: false,
              size: 3456,
            },
          ],
        },
        {
          name: 'examples',
          path: 'examples',
          isDirectory: true,
          children: [
            {
              name: 'basic-request.yaml',
              path: 'examples/basic-request.yaml',
              isDirectory: false,
              size: 567,
            },
            {
              name: 'advanced-flow.yaml',
              path: 'examples/advanced-flow.yaml',
              isDirectory: false,
              size: 4567,
            },
          ],
        },
      ];
      setFiles(mockFiles);
      setIsLoading(false);
    }, 300);
  }, [isOpen]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filterFiles = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .map((node) => {
        if (node.isDirectory && node.children) {
          const filteredChildren = filterFiles(node.children);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
          return null;
        }

        if (filter === 'yaml' && !node.name.endsWith('.yaml') && !node.name.endsWith('.yml')) {
          return null;
        }

        if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return null;
        }

        return node;
      })
      .filter((node): node is FileNode => node !== null);
  };

  const renderFileTree = (nodes: FileNode[], level = 0): JSX.Element[] => {
    return nodes.flatMap((node) => {
      const elements: JSX.Element[] = [];

      if (node.isDirectory) {
        elements.push(
          <FileItem
            key={node.path}
            $isSelected={false}
            $isDirectory={true}
            style={{ paddingLeft: `${12 + level * 20}px` }}
          >
            <FileIcon>📁</FileIcon>
            <FileName>{node.name}</FileName>
          </FileItem>
        );

        if (node.children) {
          elements.push(...renderFileTree(node.children, level + 1));
        }
      } else {
        elements.push(
          <FileItem
            key={node.path}
            $isSelected={selectedPath === node.path}
            $isDirectory={false}
            style={{ paddingLeft: `${12 + level * 20}px` }}
            onClick={() => setSelectedPath(node.path)}
          >
            <FileIcon>📄</FileIcon>
            <FileName>{node.name}</FileName>
            {node.size && <FileSize>{formatFileSize(node.size)}</FileSize>}
          </FileItem>
        );
      }

      return elements;
    });
  };

  const handleSelect = () => {
    if (!selectedPath) return;

    // Mock file content - em produção, isso virá de uma API
    const mockContent = `suite_name: "Example Test Suite"
node_id: "example-test"
description: "Loaded from ${selectedPath}"
base_url: "https://api.example.com"

steps:
  - name: "Example step"
    request:
      method: GET
      url: "/example"
    assert:
      status_code: 200
`;

    onSelect(selectedPath, mockContent);
    handleClose();
  };

  const handleClose = () => {
    setSelectedPath('');
    setSearchQuery('');
    onClose();
  };

  const filteredFiles = filterFiles(files);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <BrowserContent>
        <BrowserHeader>
          <BrowserTitle>{title}</BrowserTitle>
        </BrowserHeader>

        <SearchInput
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FileTree>
          {isLoading ? (
            <EmptyState>
              <EmptyIcon>⏳</EmptyIcon>
              Loading files...
            </EmptyState>
          ) : filteredFiles.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📂</EmptyIcon>
              {searchQuery ? 'No files found matching your search' : 'No YAML files found in project'}
            </EmptyState>
          ) : (
            renderFileTree(filteredFiles)
          )}
        </FileTree>

        {selectedPath && <SelectedPath>Selected: {selectedPath}</SelectedPath>}

        <ModalActions>
          <Button variant="outline" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSelect} disabled={!selectedPath}>
            Load File
          </Button>
        </ModalActions>
      </BrowserContent>
    </Modal>
  );
}
