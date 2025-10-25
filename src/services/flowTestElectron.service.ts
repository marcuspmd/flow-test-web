/**
 * Flow Test Electron Service
 * Handles execution of flow-test-engine via Electron IPC
 */

export interface TestExecutionOptions {
  suiteFilePath?: string;
  collectionPath?: string;
  verbose?: boolean;
  dryRun?: boolean;
  priority?: string;
  tags?: string[];
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

export interface TestExecutionResult {
  success: boolean;
  exitCode: number;
  duration: number;
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  logs: LogEntry[];
  error?: string;
}

// Global state for current execution
let currentExecutionId: string = '';
let cleanupListeners: (() => void)[] = [];

/**
 * Execute flow-test-engine CLI via Electron IPC
 * @param options - Execution options
 * @param onLog - Callback for streaming logs
 * @returns Execution result
 */
export const executeFlowTest = async (
  options: TestExecutionOptions,
  onLog?: (level: string, message: string) => void
): Promise<TestExecutionResult> => {
  // Check if Electron API is available
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    const errorMsg = 'Flow Test API not available. Please run this app in Electron (npm run dev).';
    console.error(errorMsg);
    onLog?.('error', errorMsg);
    throw new Error(errorMsg);
  }

  const startTime = Date.now();
  const logs: LogEntry[] = [];

  // Cleanup previous listeners
  cleanupListeners.forEach((cleanup) => cleanup());
  cleanupListeners = [];

  return new Promise((resolve, reject) => {
    let executionId = '';
    let exitCode = 0;
    let success = false;

    // Listen for execution started
    const unsubscribeStarted = window.flowTestAPI.onExecutionStarted((data) => {
      executionId = data.executionId;
      currentExecutionId = executionId;
    });
    cleanupListeners.push(unsubscribeStarted);

    // Listen for logs
    const unsubscribeLogs = window.flowTestAPI.onExecutionLog((data) => {
      const timestamp = new Date().toISOString();
      const level = normalizeLogLevel(data.level);
      logs.push({ timestamp, level, message: data.message });
      onLog?.(level, data.message);
    });
    cleanupListeners.push(unsubscribeLogs);

    // Listen for completion
    const unsubscribeComplete = window.flowTestAPI.onExecutionComplete((data) => {
      if (data.executionId === currentExecutionId) {
        success = data.success;
        exitCode = data.exitCode;

        const duration = Date.now() - startTime;

        // Cleanup listeners
        cleanupListeners.forEach((cleanup) => cleanup());
        cleanupListeners = [];

        resolve({
          success,
          exitCode,
          duration,
          stats: extractStatsFromLogs(logs),
          logs,
        });
      }
    });
    cleanupListeners.push(unsubscribeComplete);

    // Listen for errors
    const unsubscribeError = window.flowTestAPI.onExecutionError((data) => {
      if (data.executionId === currentExecutionId) {
        // Cleanup listeners
        cleanupListeners.forEach((cleanup) => cleanup());
        cleanupListeners = [];

        reject(new Error(data.message));
      }
    });
    cleanupListeners.push(unsubscribeError);

    // Start execution
    window.flowTestAPI
      .executeFlowTest(options)
      .then((result) => {
        currentExecutionId = result.executionId;
      })
      .catch((error) => {
        // Cleanup listeners
        cleanupListeners.forEach((cleanup) => cleanup());
        cleanupListeners = [];
        reject(error);
      });
  });
};

/**
 * Normalize log level to expected type
 */
function normalizeLogLevel(level: string): 'info' | 'success' | 'error' | 'warn' {
  const normalized = level.toLowerCase();
  if (normalized === 'info' || normalized === 'success' || normalized === 'error' || normalized === 'warn') {
    return normalized;
  }
  return 'info'; // Default fallback
}

/**
 * Extract test statistics from logs
 */
function extractStatsFromLogs(logs: LogEntry[]): {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
} {
  // Parse logs for stats (example patterns, adjust based on actual CLI output)
  let total = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const log of logs) {
    if (log.message.includes('PASSED')) passed++;
    if (log.message.includes('FAILED')) failed++;
    if (log.message.includes('SKIPPED')) skipped++;
  }

  total = passed + failed + skipped;

  return { total, passed, failed, skipped };
}

/**
 * Stop the currently running test execution
 */
export const stopFlowTest = async (): Promise<void> => {
  if (!window.flowTestAPI) {
    throw new Error('Flow Test API not available');
  }

  if (currentExecutionId) {
    try {
      await window.flowTestAPI.stopExecution(currentExecutionId);

      // Cleanup listeners
      cleanupListeners.forEach((cleanup) => cleanup());
      cleanupListeners = [];

      currentExecutionId = '';
    } catch (error) {
      console.error('Failed to stop execution:', error);
      throw new Error('Failed to stop test execution');
    }
  }
};

/**
 * Get CLI version
 */
export const getFlowTestVersion = async (): Promise<string> => {
  if (!window.flowTestAPI) {
    throw new Error('Flow Test API not available');
  }

  try {
    return await window.flowTestAPI.getVersion();
  } catch (error) {
    console.error('Failed to get version:', error);
    return 'Unknown';
  }
};

/**
 * Validate suite file before execution
 */
export const validateSuiteFile = async (_filePath: string): Promise<{ valid: boolean; errors?: string[] }> => {
  // TODO: Implement validation via Electron IPC
  return { valid: true };
};
