/**
 * Global Type Declarations for Electron API
 */

export interface ExecuteOptions {
  suiteFilePath?: string;
  collectionPath?: string;
  verbose?: boolean;
  dryRun?: boolean;
  priority?: string;
  tags?: string[];
}

export interface FlowTestAPI {
  // Test execution
  executeFlowTest: (options: ExecuteOptions) => Promise<{ executionId: string }>;
  stopExecution: (executionId: string) => Promise<{ success: boolean; message: string }>;

  // Event listeners
  onExecutionStarted: (callback: (data: { executionId: string }) => void) => () => void;
  onExecutionLog: (callback: (data: { executionId: string; level: string; message: string }) => void) => () => void;
  onExecutionComplete: (
    callback: (data: { executionId: string; success: boolean; exitCode: number }) => void
  ) => () => void;
  onExecutionError: (callback: (data: { executionId: string; message: string }) => void) => () => void;

  // Version info
  getVersion: () => Promise<string>;
  getAppVersion: () => Promise<string>;

  // File system
  selectDirectory: () => Promise<string | null>;
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    flowTestAPI: FlowTestAPI;
  }
}

export {};
