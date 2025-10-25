"use strict";
/**
 * Electron Preload Script
 * Expõe API segura para o renderer process
 */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// API exposta para o renderer
const flowTestAPI = {
    // Execute flow test
    executeFlowTest: (options) => {
        return electron_1.ipcRenderer.invoke('execute-flow-test', options);
    },
    // Stop execution
    stopExecution: (executionId) => {
        return electron_1.ipcRenderer.invoke('stop-execution', executionId);
    },
    // Event listeners
    onExecutionStarted: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('execution-started', listener);
        return () => electron_1.ipcRenderer.removeListener('execution-started', listener);
    },
    onExecutionLog: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('execution-log', listener);
        return () => electron_1.ipcRenderer.removeListener('execution-log', listener);
    },
    onExecutionComplete: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('execution-complete', listener);
        return () => electron_1.ipcRenderer.removeListener('execution-complete', listener);
    },
    onExecutionError: (callback) => {
        const listener = (_event, data) => callback(data);
        electron_1.ipcRenderer.on('execution-error', listener);
        return () => electron_1.ipcRenderer.removeListener('execution-error', listener);
    },
    // Version info
    getVersion: () => {
        return electron_1.ipcRenderer.invoke('get-version');
    },
    getAppVersion: () => {
        return electron_1.ipcRenderer.invoke('get-app-version');
    },
    // File system
    selectDirectory: () => {
        return electron_1.ipcRenderer.invoke('select-directory');
    },
    selectFile: (filters) => {
        return electron_1.ipcRenderer.invoke('select-file', filters);
    },
    readFile: (filePath) => {
        return electron_1.ipcRenderer.invoke('read-file', filePath);
    },
    writeFile: (filePath, content) => {
        return electron_1.ipcRenderer.invoke('write-file', filePath, content);
    },
    saveTestSuite: (content, suggestedName) => {
        return electron_1.ipcRenderer.invoke('save-test-suite', { content, suggestedName });
    },
};
// Expor API via contextBridge
electron_1.contextBridge.exposeInMainWorld('flowTestAPI', flowTestAPI);
