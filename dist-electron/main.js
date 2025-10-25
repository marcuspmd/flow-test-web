"use strict";
/**
 * Electron Main Process
 * Gerencia a janela principal e comunicação IPC
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// Store active test executions
const activeExecutions = new Map();
let mainWindow = null;
// Development or production mode
const isDev = process.env.NODE_ENV === 'development' || !electron_1.app.isPackaged;
const RENDERER_URL = isDev ? 'http://localhost:3000' : `file://${path_1.default.join(__dirname, '../dist/index.html')}`;
/**
 * Create main application window
 */
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
        titleBarStyle: 'default',
        show: false, // Show only when ready
    });
    // Set Content Security Policy (CSP)
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    isDev
                        ? // Development: Allow React dev server + Monaco Editor from CDN
                            "default-src 'self'; " +
                                "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 ws://localhost:3000 https://cdn.jsdelivr.net; " +
                                "script-src-elem 'self' 'unsafe-inline' http://localhost:3000 https://cdn.jsdelivr.net; " +
                                "style-src 'self' 'unsafe-inline' http://localhost:3000 https://cdn.jsdelivr.net; " +
                                "img-src 'self' data: blob: http://localhost:3000; " +
                                "font-src 'self' data: http://localhost:3000 https://cdn.jsdelivr.net; " +
                                "connect-src 'self' http://localhost:3000 ws://localhost:3000 https://cdn.jsdelivr.net; " +
                                "worker-src 'self' blob: data:; " +
                                "frame-src 'self';"
                        : // Production: Strict CSP (Monaco bundled locally)
                            "default-src 'self'; " +
                                "script-src 'self' 'unsafe-eval'; " + // Monaco Editor needs eval
                                "style-src 'self' 'unsafe-inline'; " + // Monaco Editor needs inline styles
                                "img-src 'self' data: blob:; " +
                                "font-src 'self' data:; " +
                                "connect-src 'self'; " +
                                "worker-src 'self' blob: data:; " +
                                "frame-src 'none';",
                ],
            },
        });
    });
    // Load renderer
    mainWindow.loadURL(RENDERER_URL);
    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
/**
 * App lifecycle events
 */
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Cleanup on quit
electron_1.app.on('before-quit', () => {
    // Kill all active executions
    activeExecutions.forEach((process) => {
        process.kill();
    });
    activeExecutions.clear();
});
/**
 * IPC Handlers
 */
// Execute flow-test-engine
electron_1.ipcMain.handle('execute-flow-test', async (event, options) => {
    const { suiteFilePath, collectionPath, verbose, dryRun, priority, tags } = options;
    // Generate execution ID
    const executionId = `exec-${Date.now()}`;
    // Build CLI command args
    const args = [];
    if (suiteFilePath)
        args.push(suiteFilePath);
    if (verbose)
        args.push('--verbose');
    if (dryRun)
        args.push('--dry-run');
    if (priority)
        args.push('--priority', priority);
    if (tags && tags.length > 0)
        args.push('--tags', tags.join(','));
    // Determine working directory
    const cwd = collectionPath ? path_1.default.resolve(process.cwd(), collectionPath) : process.cwd();
    // Spawn process
    const flowTestProcess = (0, child_process_1.spawn)('npx', ['flow-test-engine', ...args], {
        cwd,
        shell: true,
    });
    // Store process
    activeExecutions.set(executionId, flowTestProcess);
    // Send execution ID back
    event.sender.send('execution-started', { executionId });
    // Stream stdout
    flowTestProcess.stdout.on('data', (data) => {
        const message = data.toString();
        event.sender.send('execution-log', {
            executionId,
            level: 'info',
            message,
        });
    });
    // Stream stderr
    flowTestProcess.stderr.on('data', (data) => {
        const message = data.toString();
        event.sender.send('execution-log', {
            executionId,
            level: 'error',
            message,
        });
    });
    // Handle exit
    flowTestProcess.on('close', (code) => {
        event.sender.send('execution-complete', {
            executionId,
            success: code === 0,
            exitCode: code,
        });
        activeExecutions.delete(executionId);
    });
    // Handle errors
    flowTestProcess.on('error', (error) => {
        event.sender.send('execution-error', {
            executionId,
            message: error.message,
        });
        activeExecutions.delete(executionId);
    });
    return { executionId };
});
// Stop execution
electron_1.ipcMain.handle('stop-execution', async (_event, executionId) => {
    const process = activeExecutions.get(executionId);
    if (process) {
        process.kill();
        activeExecutions.delete(executionId);
        return { success: true, message: 'Execution stopped' };
    }
    return { success: false, message: 'Execution not found' };
});
// Get flow-test-engine version
electron_1.ipcMain.handle('get-version', async () => {
    return new Promise((resolve, reject) => {
        const versionProcess = (0, child_process_1.spawn)('npx', ['flow-test-engine', '--version'], { shell: true });
        let version = '';
        versionProcess.stdout.on('data', (data) => {
            version += data.toString();
        });
        versionProcess.on('close', () => {
            resolve(version.trim());
        });
        versionProcess.on('error', (error) => {
            reject(error);
        });
    });
});
// Get app version
electron_1.ipcMain.handle('get-app-version', async () => {
    return electron_1.app.getVersion();
});
// Select directory dialog
electron_1.ipcMain.handle('select-directory', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});
// Select file dialog
electron_1.ipcMain.handle('select-file', async (_event, filters) => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: filters || [{ name: 'YAML Files', extensions: ['yaml', 'yml'] }],
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});
// Read file
electron_1.ipcMain.handle('read-file', async (_event, filePath) => {
    try {
        const content = await fs_1.promises.readFile(filePath, 'utf-8');
        return { success: true, content };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
// Write file
electron_1.ipcMain.handle('write-file', async (_event, filePath, content) => {
    try {
        await fs_1.promises.writeFile(filePath, content, 'utf-8');
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
// Save test suite with dialog
electron_1.ipcMain.handle('save-test-suite', async (_event, { content, suggestedName }) => {
    try {
        // Sanitize filename to prevent path traversal
        const sanitizedName = suggestedName
            .replace(/[/\\:*?"<>|]/g, '-') // Remove invalid characters
            .replace(/\.\./g, '-') // Remove parent directory references
            .substring(0, 255); // Limit filename length
        const result = await electron_1.dialog.showSaveDialog(mainWindow, {
            title: 'Save Test Suite',
            defaultPath: `${sanitizedName || 'test-suite'}.yaml`,
            filters: [
                { name: 'YAML Files', extensions: ['yaml', 'yml'] },
                { name: 'All Files', extensions: ['*'] },
            ],
        });
        if (result.canceled || !result.filePath) {
            return { canceled: true };
        }
        await fs_1.promises.writeFile(result.filePath, content, 'utf-8');
        return { success: true, filePath: result.filePath };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
console.log('✅ Electron Main Process Initialized');
