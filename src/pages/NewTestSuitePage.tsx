import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setMode,
  updateTestSuiteData,
  setGeneratedYAML,
  setPreviewPanelWidth,
  togglePreviewPanel,
  resetEditor,
  EditorMode,
  setTestSuiteData,
  updateYAMLContent,
  restoreFromAutoSave,
  markClean,
} from '../store/slices/testSuiteEditorSlice';
import * as yaml from 'js-yaml';
import { YAMLEditor } from '../components/organisms/YAMLEditor';
import { WizardContainer } from '../components/organisms/TestSuiteWizard';
import { VisualFormBuilder } from '../components/organisms/VisualFormBuilder';
import { useAutoSave, restoreAutoSave, clearAutoSave, hasAutoSave } from '../hooks/useAutoSave';
import { saveTestSuiteToFile, downloadTestSuiteYAML, validateTestSuiteYAML } from '../services/testSuiteFile.service';
import { showSuccess, showError, showInfo } from '../utils/toast';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  overflow: hidden;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};

  a {
    color: ${({ theme }) => theme.brand};
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  span {
    opacity: 0.5;
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme['primary-text']};
`;

const ModeSelectorTabs = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme['primary-theme']};
  padding: 4px;
  border-radius: 6px;
`;

const ModeTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme['sidebar-background'] : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['sidebar-background']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $variant, theme }) => ($variant === 'primary' ? theme.brand : theme['sidebar-background'])};
  color: ${({ $variant }) => ($variant === 'primary' ? 'white' : 'inherit')};
  border: 1px solid ${({ $variant, theme }) => ($variant === 'primary' ? theme.brand : theme['layout-border'])};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const EditorPanel = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
  border-right: 1px solid ${({ theme }) => theme['layout-border']};
`;

const DragHandle = styled.div`
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s ease;
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 40px;
    background: ${({ theme }) => theme['secondary-text']};
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.brand}22;

    &::before {
      opacity: 0.4;
      background: ${({ theme }) => theme.brand};
    }
  }

  &:active {
    background: ${({ theme }) => theme.brand}44;

    &::before {
      opacity: 0.7;
    }
  }
`;

const PreviewPanel = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme['sidebar-background']};
`;

const PreviewHeader = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme['secondary-text']};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .preview-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preview-actions {
    display: flex;
    gap: 8px;
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;

  pre {
    margin: 0;
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const PlaceholderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;

  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.3;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: ${({ theme }) => theme['primary-text']};
  }

  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.7;
    line-height: 1.6;
  }
`;

const IconButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  border-radius: 4px;
  font-size: 11px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const YAMLEditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background: ${({ theme }) => theme['primary-theme']};
`;

const DirtyIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.brand};
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.brand};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.h2`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: ${({ theme }) => theme['primary-text']};
`;

const ModalText = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export default function NewTestSuitePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mode, currentData, generatedYAML, previewPanelWidth, isDirty, wizardData, formData } = useAppSelector(
    (state) => state.testSuiteEditor
  );

  const [isDragging, setIsDragging] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [autoSaveData, setAutoSaveData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check for auto-saved data on mount
  useEffect(() => {
    if (hasAutoSave()) {
      const savedData = restoreAutoSave();
      if (savedData) {
        setAutoSaveData(savedData);
        setShowRestoreModal(true);
      }
    }
  }, []);

  // Auto-save hook - saves current state to localStorage
  const testSuiteName = formData.suite_name || wizardData.suite_name || currentData.name;
  useAutoSave(mode, generatedYAML, testSuiteName);

  // Generate YAML from current data
  useEffect(() => {
    try {
      const yamlString = yaml.dump(currentData, { indent: 2 });
      dispatch(setGeneratedYAML(yamlString));
    } catch (error) {
      console.error('Failed to generate YAML:', error);
      dispatch(setGeneratedYAML('# Error generating YAML'));
    }
  }, [currentData, dispatch]);

  const handleRestoreAutoSave = () => {
    if (autoSaveData) {
      dispatch(restoreFromAutoSave({
        mode: autoSaveData.mode,
        yamlContent: autoSaveData.yamlContent,
      }));
    }
    setShowRestoreModal(false);
  };

  const handleDiscardAutoSave = () => {
    clearAutoSave();
    setShowRestoreModal(false);
  };

  const handleModeChange = (newMode: EditorMode) => {
    dispatch(setMode(newMode));
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    clearAutoSave();
    dispatch(resetEditor());
    navigate(-1);
  };

  const handleSave = async () => {
    // Validate YAML before saving
    const validation = validateTestSuiteYAML(generatedYAML);
    if (!validation.valid) {
      showError(`Invalid test suite: ${validation.errors.join(', ')}`);
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveTestSuiteToFile(generatedYAML, testSuiteName || 'test-suite');
      
      if (result.canceled) {
        showInfo('Save cancelled');
      } else if (result.success) {
        showSuccess(`Test suite saved successfully to ${result.filePath}`);
        dispatch(markClean());
        clearAutoSave();
      } else {
        showError(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save test suite');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    // Validate before export
    const validation = validateTestSuiteYAML(generatedYAML);
    if (!validation.valid) {
      showError(`Invalid test suite: ${validation.errors.join(', ')}`);
      return;
    }

    // Export YAML
    const filename = testSuiteName || 'test-suite';
    downloadTestSuiteYAML(generatedYAML, filename);
    showSuccess(`Test suite exported as ${filename}.yaml`);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const containerWidth = window.innerWidth;
      const newEditorWidth = (e.clientX / containerWidth) * 100;
      const clampedWidth = Math.min(80, Math.max(20, newEditorWidth));
      dispatch(setPreviewPanelWidth(100 - clampedWidth));
    },
    [isDragging, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const editorWidth = 100 - previewPanelWidth;

  const handleYAMLChange = (newYaml: string) => {
    dispatch(updateYAMLContent(newYaml));
  };

  const renderModeContent = () => {
    switch (mode) {
      case 'wizard':
        return <WizardContainer />;
      case 'yaml':
        return (
          <YAMLEditorContainer>
            <YAMLEditor
              value={generatedYAML}
              onChange={handleYAMLChange}
              height="100%"
              readOnly={false}
            />
          </YAMLEditorContainer>
        );
      case 'form':
        return <VisualFormBuilder />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {showRestoreModal && (
        <Modal onClick={handleDiscardAutoSave}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Continue Editing?</ModalHeader>
            <ModalText>
              We found an unsaved test suite from{' '}
              {autoSaveData && new Date(autoSaveData.timestamp).toLocaleString()}.
              Would you like to continue editing it?
            </ModalText>
            <ModalActions>
              <Button $variant="secondary" onClick={handleDiscardAutoSave}>
                Discard
              </Button>
              <Button $variant="primary" onClick={handleRestoreAutoSave}>
                Continue Editing
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      <PageHeader>
        <HeaderLeft>
          <Breadcrumb>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <span>›</span>
            <span>New Test Suite</span>
          </Breadcrumb>
          <PageTitle>
            New Test Suite
            {isDirty && (
              <DirtyIndicator>
                <span className="dot"></span>
                Unsaved changes
              </DirtyIndicator>
            )}
          </PageTitle>
        </HeaderLeft>

        <ModeSelectorTabs>
          <ModeTab $active={mode === 'wizard'} onClick={() => handleModeChange('wizard')}>
            🧙 Wizard
          </ModeTab>
          <ModeTab $active={mode === 'yaml'} onClick={() => handleModeChange('yaml')}>
            📝 YAML Editor
          </ModeTab>
          <ModeTab $active={mode === 'form'} onClick={() => handleModeChange('form')}>
            📋 Visual Form
          </ModeTab>
        </ModeSelectorTabs>

        <HeaderActions>
          <Button $variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button $variant="secondary" onClick={handleExport}>
            Export YAML
          </Button>
          <Button $variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Test Suite'}
          </Button>
        </HeaderActions>
      </PageHeader>

      <ContentArea>
        <EditorPanel $width={editorWidth}>{renderModeContent()}</EditorPanel>

        <DragHandle onMouseDown={handleDragStart} />

        <PreviewPanel $width={previewPanelWidth}>
          <PreviewHeader>
            <div className="preview-title">
              <span>📄</span>
              <span>YAML Preview</span>
            </div>
            <div className="preview-actions">
              <IconButton onClick={handleExport} title="Download YAML">
                ⬇️ Download
              </IconButton>
            </div>
          </PreviewHeader>
          <PreviewContent>
            <pre>{generatedYAML || '# Start creating your test suite...'}</pre>
          </PreviewContent>
        </PreviewPanel>
      </ContentArea>
    </PageContainer>
  );
}
