import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { executeFlowTest, stopFlowTest } from '../../../services/flowTestElectron.service';

const RunnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme['codemirror-background']};
  border-radius: 8px;
  overflow: hidden;
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme['method-get']};
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    if (variant === 'danger') {
      return `
        background: ${theme['background-danger']};
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    return `
      background: ${theme['sidebar-background']};
      color: ${theme.text};
      &:hover { background: ${theme['layout-border']}; }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number; status: 'running' | 'success' | 'error' }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
  background: ${({ status, theme }) => {
    if (status === 'success') return theme['method-get'];
    if (status === 'error') return theme['background-danger'];
    return theme['method-post'];
  }};
`;

const LogsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
`;

const LogLine = styled.div<{ level?: 'info' | 'success' | 'error' | 'warn' }>`
  margin-bottom: 4px;
  color: ${({ level, theme }) => {
    if (level === 'success') return theme['method-get'];
    if (level === 'error') return theme['background-danger'];
    if (level === 'warn') return theme['method-post'];
    return theme.text;
  }};
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
  font-size: 13px;
`;

const StatusBadge = styled.span<{ status: 'idle' | 'running' | 'success' | 'error' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  background: ${({ status, theme }) => {
    if (status === 'running') return theme['method-post'];
    if (status === 'success') return theme['method-get'];
    if (status === 'error') return theme['background-danger'];
    return theme['layout-border'];
  }};
  color: white;
`;

interface TestRunnerProps {
  suiteId?: string;
  collectionId?: string;
  onComplete?: (success: boolean) => void;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

/**
 * TestRunner Component
 * Executes test suites and displays real-time logs
 */
export const TestRunner = ({ suiteId, collectionId, onComplete }: TestRunnerProps) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when logs update
  const scrollToBottom = useCallback(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Add log entry
  const addLog = useCallback(
    (level: LogEntry['level'], message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, { timestamp, level, message }]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // Start test execution
  const handleStart = useCallback(async () => {
    setStatus('running');
    setLogs([]);
    setProgress(0);
    setStats({ total: 0, passed: 0, failed: 0 });

    try {
      // Execute flow-test-engine via CLI service
      const result = await executeFlowTest(
        {
          suiteFilePath: suiteId ? `suite-${suiteId}.yaml` : undefined,
          collectionPath: collectionId ? `collections/${collectionId}` : undefined,
          verbose: true,
        },
        (level, message) => {
          // Real-time log callback
          addLog(level as LogEntry['level'], message);

          // Update progress based on log patterns
          if (message.includes('Initializing')) setProgress(15);
          if (message.includes('initialized')) setProgress(30);
          if (message.includes('Running')) setProgress(45);
          if (message.includes('Step 1')) setProgress(65);
          if (message.includes('Step 2')) setProgress(85);
          if (message.includes('passed')) setProgress(100);
        }
      );

      // Update final stats from result
      setStats({
        total: result.stats.total,
        passed: result.stats.passed,
        failed: result.stats.failed,
      });

      // Set final status
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }

      onComplete?.(result.success);
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog('error', `❌ Test execution failed: ${errorMessage}`);
      onComplete?.(false);
    }
  }, [collectionId, suiteId, addLog, onComplete]);

  // Stop test execution
  const handleStop = useCallback(async () => {
    try {
      await stopFlowTest();
      setStatus('idle');
      addLog('warn', '⏹️ Test execution stopped by user');
    } catch (error) {
      addLog('error', `Failed to stop execution: ${error}`);
    }
  }, [addLog]);

  // Clear logs
  const handleClear = useCallback(() => {
    setLogs([]);
    setProgress(0);
    setStats({ total: 0, passed: 0, failed: 0 });
    setStatus('idle');
  }, []);

  return (
    <RunnerContainer>
      {/* Control Bar */}
      <ControlBar>
        <Button variant="primary" onClick={handleStart} disabled={status === 'running'}>
          {status === 'running' ? '⏸️ Running...' : '▶️ Run Tests'}
        </Button>

        <Button variant="danger" onClick={handleStop} disabled={status !== 'running'}>
          ⏹️ Stop
        </Button>

        <Button onClick={handleClear} disabled={status === 'running'}>
          🗑️ Clear
        </Button>

        <ProgressBar>
          <ProgressFill
            progress={progress}
            status={status === 'error' ? 'error' : status === 'success' ? 'success' : 'running'}
          />
        </ProgressBar>

        <StatusBadge status={status}>{status.toUpperCase()}</StatusBadge>
      </ControlBar>

      {/* Logs Container */}
      <LogsContainer>
        {logs.length === 0 ? (
          <LogLine level="info">Click &quot;Run Tests&quot; to start execution...</LogLine>
        ) : (
          logs.map((log, index) => (
            <LogLine key={index} level={log.level}>
              [{log.timestamp}] {log.message}
            </LogLine>
          ))
        )}
        <div ref={logsEndRef} />
      </LogsContainer>

      {/* Status Bar */}
      <StatusBar>
        <div>
          <strong>Total:</strong> {stats.total} | <strong style={{ color: '#28a745' }}>Passed:</strong> {stats.passed} |{' '}
          <strong style={{ color: '#dc3545' }}>Failed:</strong> {stats.failed}
        </div>
        <div>{progress}% Complete</div>
      </StatusBar>
    </RunnerContainer>
  );
};
