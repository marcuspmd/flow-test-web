/**
 * TestRunnerWithParsing Component
 * Nova versão do TestRunner com parsing de steps em tempo real
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useFlowTestExecution } from '../../hooks/useFlowTestExecution';
import { TestResultViewer } from '../TestResultViewer';
import { selectFile, selectDirectory } from '../../services/flowTestIntegrated.service';
import { StepExecutionResult } from '../../types/testExecution.types';

const RunnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme['codemirror-background']};
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  flex-shrink: 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary'; disabled?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme['method-get']};
        color: white;
        &:hover { opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 0.9)}; }
      `;
    }
    if (variant === 'danger') {
      return `
        background: ${theme['background-danger']};
        color: white;
        &:hover { opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 0.9)}; }
      `;
    }
    return `
      background: ${theme['layout-border']};
      color: ${theme.text};
      border: 1px solid ${theme['layout-border']};
      &:hover { background: ${theme['sidebar-background']}; }
    `;
  }}
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme['method-get']};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
`;

const LogsPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
`;

const LogsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme['codemirror-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-weight: 600;
  font-size: 14px;
`;

const LogsContent = styled.pre`
  flex: 1;
  margin: 0;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme['sidebar-background']};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme['layout-border']};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme['method-get']};
    border-radius: 4px;
  }
`;

const ResultsPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
`;

const StatusBadge = styled.span<{ status: 'running' | 'success' | 'error' | 'idle' }>`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${({ status, theme }) => {
    if (status === 'running') return `background: ${theme['method-post']}; color: white;`;
    if (status === 'success') return `background: ${theme['method-get']}; color: white;`;
    if (status === 'error') return `background: ${theme['background-danger']}; color: white;`;
    return `background: ${theme['layout-border']}; color: ${theme.text};`;
  }}
`;

const ProgressBar = styled.div`
  margin-top: 12px;
  height: 4px;
  background: ${({ theme }) => theme['layout-border']};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme['method-get']};
  transition: width 0.3s ease;
`;

export const TestRunnerWithParsing: React.FC = () => {
  const [suiteFilePath, setSuiteFilePath] = useState('');
  const [collectionPath, setCollectionPath] = useState('');

  const { isExecuting, logs, steps, currentStep, totalSteps, result, error, execute, stop, clearLogs, clearResults } =
    useFlowTestExecution();

  const handleSelectFile = async () => {
    const filePath = await selectFile([{ name: 'YAML Files', extensions: ['yaml', 'yml'] }]);
    if (filePath) {
      setSuiteFilePath(filePath);
    }
  };

  const handleSelectDirectory = async () => {
    const dirPath = await selectDirectory();
    if (dirPath) {
      setCollectionPath(dirPath);
    }
  };

  const handleExecute = async () => {
    clearLogs();
    clearResults();

    await execute({
      suiteFilePath: suiteFilePath || undefined,
      collectionPath: collectionPath || undefined,
      verbose: true,
    });
  };

  const handleStop = async () => {
    await stop();
  };

  const getStatus = (): 'running' | 'success' | 'error' | 'idle' => {
    if (isExecuting) return 'running';
    if (error) return 'error';
    if (result?.success) return 'success';
    return 'idle';
  };

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <RunnerContainer>
      {/* Control Bar */}
      <ControlBar>
        <Input
          type="text"
          placeholder="Suite file path (or select below)"
          value={suiteFilePath}
          onChange={(e) => setSuiteFilePath(e.target.value)}
        />
        <Button variant="secondary" onClick={handleSelectFile}>
          📁 Browse File
        </Button>
        <Button variant="secondary" onClick={handleSelectDirectory}>
          📂 Browse Folder
        </Button>
        <Button variant="primary" onClick={handleExecute} disabled={isExecuting || !suiteFilePath}>
          ▶️ {isExecuting ? 'Running...' : 'Run Test'}
        </Button>
        {isExecuting && (
          <Button variant="danger" onClick={handleStop}>
            ⏹️ Stop
          </Button>
        )}
        <StatusBadge status={getStatus()}>{getStatus()}</StatusBadge>
      </ControlBar>

      {/* Progress */}
      {isExecuting && totalSteps > 0 && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
            Step {currentStep} of {totalSteps}
          </div>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
        </div>
      )}

      {/* Content Area */}
      <ContentArea>
        {/* Logs Panel */}
        <LogsPanel>
          <LogsHeader>
            <span>📋 Execution Logs ({logs.length})</span>
            <Button variant="secondary" onClick={clearLogs} style={{ padding: '4px 12px', fontSize: '12px' }}>
              Clear
            </Button>
          </LogsHeader>
          <LogsContent>{logs.join('\n')}</LogsContent>
        </LogsPanel>

        {/* Results Panel */}
        <ResultsPanel>
          <LogsHeader>
            <span>📊 Test Results ({steps.length} steps)</span>
            <Button variant="secondary" onClick={clearResults} style={{ padding: '4px 12px', fontSize: '12px' }}>
              Clear
            </Button>
          </LogsHeader>
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            {steps.length === 0 && !isExecuting && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                <p style={{ fontSize: '48px', margin: 0 }}>🧪</p>
                <p style={{ marginTop: '16px' }}>No test results yet. Run a test to see results here.</p>
              </div>
            )}

            {steps.map((step: StepExecutionResult, index: number) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <TestResultViewer result={step} />
              </div>
            ))}

            {error && (
              <div
                style={{
                  padding: '16px',
                  background: '#ffe6e6',
                  border: '1px solid #ff4444',
                  borderRadius: '8px',
                  color: '#cc0000',
                  marginTop: '16px',
                }}
              >
                <strong>❌ Error:</strong> {error}
              </div>
            )}
          </div>
        </ResultsPanel>
      </ContentArea>
    </RunnerContainer>
  );
};
