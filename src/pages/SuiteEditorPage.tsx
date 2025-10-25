import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCollections } from '../hooks';
import { Button, YAMLEditor, FileBrowserModal } from '../components';
import type { TestSuite } from '../store/slices/collectionsSlice';
import { parseYAMLToSuite, suiteToYAML } from '../utils/yamlParser';

const EditorPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme['primary-theme']};
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ theme }) => theme['sidebar-background']};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SuiteTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SuiteName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin: 0;
`;

const SuitePath = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ValidationStatus = styled.div<{ $isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: ${({ $isValid }) => ($isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')};
  color: ${({ $isValid, theme }) => ($isValid ? theme['method-get'] : theme['text-danger'])};
  font-weight: 500;
`;

const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorBanner = styled.div`
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  color: ${({ theme }) => theme['text-danger']};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const defaultYAML = `suite_name: "New Test Suite"
node_id: "new-test-suite"
description: "A new test suite"
base_url: "https://api.example.com"

variables:
  api_key: "your-api-key"
  user_id: "12345"

steps:
  - name: "Get user data"
    request:
      method: GET
      url: "/users/{{user_id}}"
      headers:
        Authorization: "Bearer {{api_key}}"
    assert:
      status_code: 200
      body:
        id:
          exists: true
          type: "string"
    capture:
      username: "body.name"
      email: "body.email"

  - name: "Update user"
    request:
      method: PUT
      url: "/users/{{user_id}}"
      headers:
        Authorization: "Bearer {{api_key}}"
        Content-Type: "application/json"
      body:
        name: "{{username}}"
        email: "{{email}}"
    assert:
      status_code: 200
`;

export default function SuiteEditorPage() {
  const { collectionId, suiteId } = useParams<{ collectionId: string; suiteId: string }>();
  const navigate = useNavigate();
  const { collections, addTestSuite, updateTestSuite } = useCollections();

  const [yamlContent, setYamlContent] = useState(defaultYAML);
  const [isValid, setIsValid] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [suite, setSuite] = useState<TestSuite | null>(null);
  const [isFileBrowserOpen, setIsFileBrowserOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) return;

    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) {
      navigate('/collections');
      return;
    }

    if (suiteId) {
      const foundSuite = collection.suites.find((s) => s.id === suiteId);
      if (foundSuite) {
        setSuite(foundSuite);
        // Convert suite object to YAML
        try {
          const yaml = suiteToYAML(foundSuite);
          setYamlContent(yaml);
          setHasChanges(false);
        } catch (error) {
          console.error('Failed to convert suite to YAML:', error);
          setYamlContent(defaultYAML);
        }
      }
    } else {
      // Novo suite
      setSuite(null);
      setYamlContent(defaultYAML);
      setHasChanges(false);
    }
  }, [collectionId, suiteId, collections, navigate]);

  const handleSave = () => {
    if (!isValid || !collectionId) return;

    setSaveError(null);

    try {
      // Parse YAML to TestSuite object
      const parsedSuite = parseYAMLToSuite(yamlContent);

      if (suiteId) {
        // Update existing suite
        updateTestSuite(collectionId, suiteId, parsedSuite);
      } else {
        // Add new suite
        addTestSuite(collectionId, parsedSuite);
      }

      setHasChanges(false);
      navigate(`/collections/${collectionId}`);
    } catch (error) {
      if (error instanceof Error) {
        setSaveError(error.message);
        alert(`Failed to save suite: ${error.message}`);
      } else {
        setSaveError('Unknown error occurred');
        alert('Failed to save suite: Unknown error');
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    navigate(`/collections/${collectionId}`);
  };

  const handleYAMLChange = (newValue: string) => {
    setYamlContent(newValue);
    setHasChanges(true);
  };

  const handleValidation = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleFileLoad = (filePath: string, content: string) => {
    setYamlContent(content);
    setHasChanges(true);
    setSaveError(null);

    // Try to extract metadata from loaded YAML
    try {
      const parsed = parseYAMLToSuite(content);
      setSuite(parsed);
    } catch (error) {
      console.warn('Could not parse loaded file:', error);
    }
  };

  return (
    <EditorPageWrapper>
      <EditorHeader>
        <HeaderLeft>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            ← Back
          </Button>

          <SuiteTitle>
            <SuiteName>{suite ? `Edit: ${suite.suite_name}` : 'New Test Suite'}</SuiteName>
            <SuitePath>{suite ? suite.node_id : 'unsaved-suite.yaml'}</SuitePath>
          </SuiteTitle>
        </HeaderLeft>

        <HeaderActions>
          <ValidationStatus $isValid={isValid}>{isValid ? '✓ Valid YAML' : '⚠ Invalid YAML'}</ValidationStatus>

          <Button variant="outline" size="sm" onClick={() => setIsFileBrowserOpen(true)}>
            📁 Load File
          </Button>

          <Button variant="outline" size="md" onClick={handleCancel}>
            Cancel
          </Button>

          <Button variant="primary" size="md" onClick={handleSave} disabled={!isValid || !hasChanges}>
            {hasChanges ? '● Save Changes' : 'Save'}
          </Button>
        </HeaderActions>
      </EditorHeader>

      <EditorContent>
        {saveError && (
          <ErrorBanner>
            <span>⚠️</span>
            <span>{saveError}</span>
          </ErrorBanner>
        )}

        <YAMLEditor
          value={yamlContent}
          onChange={handleYAMLChange}
          onValidation={handleValidation}
          height={saveError ? 'calc(100vh - 200px)' : 'calc(100vh - 140px)'}
        />
      </EditorContent>

      <FileBrowserModal
        isOpen={isFileBrowserOpen}
        onClose={() => setIsFileBrowserOpen(false)}
        onSelect={handleFileLoad}
      />
    </EditorPageWrapper>
  );
}
