/**
 * ImportExportModal Component
 * Modal for importing/exporting requests in different formats
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { parseCurl, validateCurl } from '../../../utils/curlConverter';
import { exportToFlowTestYAML, parseFlowTestYAML, validateYAML } from '../../../utils/yamlConverter';
import type { RequestData } from '../RequestPane';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme['primary-theme']};
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme['primary-text']};
  }

  button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: ${({ theme }) => theme['secondary-text']};
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.1)' : 'transparent')};
  border: none;
  border-bottom: ${({ $active }) => ($active ? '2px solid #007acc' : '2px solid transparent')};
  color: ${({ theme, $active }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 122, 204, 0.05);
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  background: ${({ $primary }) => ($primary ? '#007acc' : 'transparent')};
  color: ${({ $primary, theme }) => ($primary ? 'white' : theme['primary-text'])};
  border: ${({ $primary, theme }) => ($primary ? 'none' : `1px solid ${theme['layout-border']}`)};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#005a9e' : 'rgba(0, 122, 204, 0.1)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 4px;
  color: #e74c3c;
  font-size: 13px;
  margin-top: 12px;
`;

const SuccessMessage = styled.div`
  padding: 12px;
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid #27ae60;
  border-radius: 4px;
  color: #27ae60;
  font-size: 13px;
  margin-top: 12px;
`;

interface ImportExportModalProps {
  mode: 'import' | 'export';
  currentRequest: RequestData;
  onClose: () => void;
  onImport: (request: RequestData) => void;
}

type ImportFormat = 'curl' | 'yaml';
type ExportFormat = 'curl' | 'yaml';

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ mode, currentRequest, onClose, onImport }) => {
  const [activeFormat, setActiveFormat] = useState<ImportFormat | ExportFormat>(mode === 'import' ? 'curl' : 'yaml');
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImport = () => {
    setError('');
    setSuccess('');

    if (!importText.trim()) {
      setError('Please paste content to import');
      return;
    }

    try {
      if (activeFormat === 'curl') {
        const validation = validateCurl(importText);
        if (!validation.valid) {
          setError(validation.error || 'Invalid cURL command');
          return;
        }

        const parsed = parseCurl(importText);
        const requestData: RequestData = {
          method: parsed.method,
          url: parsed.url,
          params: [],
          headers: Object.entries(parsed.headers).map(([key, value], index) => ({
            id: `header-${index}`,
            key,
            value,
            enabled: true,
          })),
          body: {
            type: parsed.body ? 'json' : 'none',
            content: parsed.body || '',
            formData: [],
          },
          auth: parsed.auth
            ? {
                type: parsed.auth.type,
                config:
                  parsed.auth.type === 'basic'
                    ? { username: parsed.auth.username || '', password: parsed.auth.password || '' }
                    : { token: parsed.auth.token || '' },
              }
            : { type: 'none', config: {} },
          assertions: {},
          pre_hooks: [],
          post_hooks: [],
        };

        onImport(requestData);
        setSuccess('Successfully imported from cURL!');
        setTimeout(() => onClose(), 1500);
      } else if (activeFormat === 'yaml') {
        const validation = validateYAML(importText);
        if (!validation.valid) {
          setError(validation.error || 'Invalid YAML format');
          return;
        }

        const requestData = parseFlowTestYAML(importText);
        onImport(requestData);
        setSuccess('Successfully imported from YAML!');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setError(`Import failed: ${err}`);
    }
  };

  const getExportContent = (): string => {
    if (activeFormat === 'curl') {
      // Use the cURL command from response if available, or generate new one
      return `curl -X ${currentRequest.method} '${currentRequest.url}'`;
    } else {
      return exportToFlowTestYAML(currentRequest, {
        name: 'Exported Request',
        includeAssertions: true,
        includeHooks: true,
      });
    }
  };

  const handleCopy = () => {
    const content = getExportContent();
    navigator.clipboard.writeText(content);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const extension = activeFormat === 'curl' ? 'sh' : 'yaml';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `request.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess('Downloaded successfully!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{mode === 'import' ? '📥 Import Request' : '📤 Export Request'}</h2>
          <button onClick={onClose}>×</button>
        </ModalHeader>

        <ModalBody>
          <TabsContainer>
            <Tab $active={activeFormat === 'curl'} onClick={() => setActiveFormat('curl')}>
              cURL
            </Tab>
            <Tab $active={activeFormat === 'yaml'} onClick={() => setActiveFormat('yaml')}>
              YAML (Flow Test)
            </Tab>
          </TabsContainer>

          {mode === 'import' ? (
            <>
              <TextArea
                placeholder={
                  activeFormat === 'curl'
                    ? `Paste your cURL command here...\n\nExample:\ncurl -X POST 'https://api.example.com/users' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"name": "John"}'`
                    : `Paste your flow-test YAML here...\n\nExample (single request):\nrequest:\n  method: POST\n  url: https://api.example.com/users\n  headers:\n    Content-Type: application/json\n    Authorization: Bearer <token>\n  body: |\n    {\n      "name": "John Doe",\n      "email": "john@example.com"\n    }\nassertions:\n  - type: status_code\n    value: 201\n\nOr (full test suite):\nsteps:\n  - name: Create User\n    request:\n      method: POST\n      url: https://api.example.com/users\n      headers:\n        Content-Type: application/json\n      body: '{"name":"John"}'\n    assertions:\n      - type: status_code\n        value: 201`
                }
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />

              <ButtonGroup>
                <Button $primary onClick={handleImport}>
                  Import
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <TextArea value={getExportContent()} readOnly />

              <ButtonGroup>
                <Button $primary onClick={handleCopy}>
                  📋 Copy to Clipboard
                </Button>
                <Button onClick={handleDownload}>💾 Download</Button>
                <Button onClick={onClose}>Close</Button>
              </ButtonGroup>
            </>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
