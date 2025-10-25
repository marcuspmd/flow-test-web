/**
 * Electron Main Process
 * Gerencia a janela principal e comunicação IPC
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// Store active test executions
const activeExecutions = new Map<string, ChildProcess>();

let mainWindow: BrowserWindow | null = null;

// Development or production mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const RENDERER_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../dist/index.html')}`;

/**
 * Create main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
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
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
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
ipcMain.handle('execute-flow-test', async (event, options) => {
  const { suiteFilePath, collectionPath, verbose, dryRun, priority, tags } = options;

  // Generate execution ID
  const executionId = `exec-${Date.now()}`;

  // Build CLI command args
  const args: string[] = [];

  if (suiteFilePath) args.push(suiteFilePath);
  if (verbose) args.push('--verbose');
  if (dryRun) args.push('--dry-run');
  if (priority) args.push('--priority', priority);
  if (tags && tags.length > 0) args.push('--tags', tags.join(','));

  // Determine working directory
  const cwd = collectionPath ? path.resolve(process.cwd(), collectionPath) : process.cwd();

  // Spawn process
  const flowTestProcess = spawn('npx', ['flow-test-engine', ...args], {
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
ipcMain.handle('stop-execution', async (_event, executionId: string) => {
  const process = activeExecutions.get(executionId);
  if (process) {
    process.kill();
    activeExecutions.delete(executionId);
    return { success: true, message: 'Execution stopped' };
  }
  return { success: false, message: 'Execution not found' };
});

// Get flow-test-engine version
ipcMain.handle('get-version', async () => {
  return new Promise((resolve, reject) => {
    const versionProcess = spawn('npx', ['flow-test-engine', '--version'], { shell: true });

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
ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

// Select directory dialog
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Select file dialog
ipcMain.handle('select-file', async (_event, filters?: { name: string; extensions: string[] }[]) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: filters || [{ name: 'YAML Files', extensions: ['yaml', 'yml'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Read file
ipcMain.handle('read-file', async (_event, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
});

// Write file
ipcMain.handle('write-file', async (_event, filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
});

// Save test suite with dialog
ipcMain.handle('save-test-suite', async (_event, { content, suggestedName }: { content: string; suggestedName: string }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow!, {
      title: 'Save Test Suite',
      defaultPath: `${suggestedName || 'test-suite'}.yaml`,
      filters: [
        { name: 'YAML Files', extensions: ['yaml', 'yml'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    await fs.writeFile(result.filePath, content, 'utf-8');
    return { success: true, filePath: result.filePath };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
});

console.log('✅ Electron Main Process Initialized');
