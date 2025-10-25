/**
 * Electron Preload Script
 * Expõe API segura para o renderer process
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Tipos para API exposta
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

export interface ExecuteOptions {
  suiteFilePath?: string;
  collectionPath?: string;
  verbose?: boolean;
  dryRun?: boolean;
  priority?: string;
  tags?: string[];
}

// API exposta para o renderer
const flowTestAPI: FlowTestAPI = {
  // Execute flow test
  executeFlowTest: (options: ExecuteOptions) => {
    return ipcRenderer.invoke('execute-flow-test', options);
  },

  // Stop execution
  stopExecution: (executionId: string) => {
    return ipcRenderer.invoke('stop-execution', executionId);
  },

  // Event listeners
  onExecutionStarted: (callback) => {
    const listener = (_event: IpcRendererEvent, data: { executionId: string }) => callback(data);
    ipcRenderer.on('execution-started', listener);
    return () => ipcRenderer.removeListener('execution-started', listener);
  },

  onExecutionLog: (callback) => {
    const listener = (_event: IpcRendererEvent, data: { executionId: string; level: string; message: string }) =>
      callback(data);
    ipcRenderer.on('execution-log', listener);
    return () => ipcRenderer.removeListener('execution-log', listener);
  },

  onExecutionComplete: (callback) => {
    const listener = (_event: IpcRendererEvent, data: { executionId: string; success: boolean; exitCode: number }) =>
      callback(data);
    ipcRenderer.on('execution-complete', listener);
    return () => ipcRenderer.removeListener('execution-complete', listener);
  },

  onExecutionError: (callback) => {
    const listener = (_event: IpcRendererEvent, data: { executionId: string; message: string }) => callback(data);
    ipcRenderer.on('execution-error', listener);
    return () => ipcRenderer.removeListener('execution-error', listener);
  },

  // Version info
  getVersion: () => {
    return ipcRenderer.invoke('get-version');
  },

  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  },

  // File system
  selectDirectory: () => {
    return ipcRenderer.invoke('select-directory');
  },

  selectFile: (filters) => {
    return ipcRenderer.invoke('select-file', filters);
  },

  readFile: (filePath: string) => {
    return ipcRenderer.invoke('read-file', filePath);
  },

  writeFile: (filePath: string, content: string) => {
    return ipcRenderer.invoke('write-file', filePath, content);
  },
};

// Expor API via contextBridge
contextBridge.exposeInMainWorld('flowTestAPI', flowTestAPI);

// Extend Window interface para TypeScript
declare global {
  interface Window {
    flowTestAPI: FlowTestAPI;
  }
}
