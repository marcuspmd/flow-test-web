import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestData } from '../../components/organisms/RequestPane';

/**
 * API Client Slice - Gerencia requisições HTTP individuais estilo Postman/Bruno
 */

export interface APIRequest {
  id: string;
  name: string;
  description?: string;
  data: RequestData;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface APIFolder {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  parentFolderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface APIWorkspace {
  id: string;
  name: string;
  description?: string;
  folders: APIFolder[];
  requests: APIRequest[];
  createdAt: number;
  updatedAt: number;
}

export interface APIClientState {
  workspaces: APIWorkspace[];
  activeWorkspaceId: string | null;
  activeRequestId: string | null;
  openTabs: string[]; // IDs das requisições abertas em tabs
  activeTabId: string | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'flow-test-api-workspaces';

// Helper para carregar do localStorage
const loadFromStorage = (): APIWorkspace[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper para salvar no localStorage
const saveToStorage = (workspaces: APIWorkspace[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
  } catch (error) {
    console.error('Error saving workspaces to storage:', error);
  }
};

// Criar workspace default se não existir
const initializeWorkspaces = (): APIWorkspace[] => {
  const stored = loadFromStorage();
  if (stored.length === 0) {
    // Criar requisição mockada com todos os recursos para demonstração
    const mockRequest: APIRequest = {
      id: `req_${Date.now()}`,
      name: 'Example API Request',
      description: 'Demonstração completa do Flow Test com Assertions, Hooks e YAML',
      data: {
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        params: [{ id: '1', key: 'userId', value: '1', enabled: true }],
        headers: [
          { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
          { id: '2', key: 'Accept', value: 'application/json', enabled: true },
        ],
        body: {
          type: 'json',
          content: `{
  "title": "Test Post",
  "body": "This is a test post",
  "userId": 1
}`,
        },
        auth: {
          type: 'bearer',
          config: {
            token: 'your-api-token-here',
          },
        },
        // Assertions completas
        assertions: {
          status_code: 201,
          body: {
            id: { exists: true, type: 'number' },
            title: { equals: 'Test Post' },
            body: { notEmpty: true },
            userId: { equals: 1 },
          },
          headers: {
            'content-type': { contains: 'application/json' },
          },
          response_time_ms: {
            less_than: 2000,
          },
          custom: [
            {
              name: 'Check Status Created',
              condition: 'response.status === 201',
              severity: 'error',
              message: 'Expected 201 Created status',
            },
          ],
        },
        // Pre-request hooks
        pre_hooks: [
          {
            compute: {
              timestamp: '{{$timestamp}}',
              randomId: '{{$randomInt}}',
            },
          },
          {
            log: {
              message: 'Iniciando requisição para criar post',
              level: 'info',
            },
          },
        ],
        // Post-request hooks
        post_hooks: [
          {
            capture: {
              postId: 'id',
              postTitle: 'title',
            },
          },
          {
            exports: ['CREATED_POST_ID'],
          },
          {
            log: {
              message: 'Post criado com ID: {{postId}}',
              level: 'info',
            },
          },
        ],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const defaultWorkspace: APIWorkspace = {
      id: `ws_${Date.now()}`,
      name: 'My Workspace',
      description: 'Default workspace with example requests',
      folders: [],
      requests: [mockRequest],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return [defaultWorkspace];
  }
  return stored;
};

// Helper para obter primeira requisição do workspace
const getFirstRequestId = (): string | null => {
  const workspaces = initializeWorkspaces();
  const firstWorkspace = workspaces[0];
  if (firstWorkspace && firstWorkspace.requests.length > 0) {
    return firstWorkspace.requests[0].id;
  }
  return null;
};

const initialState: APIClientState = {
  workspaces: initializeWorkspaces(),
  activeWorkspaceId: initializeWorkspaces()[0]?.id || null,
  activeRequestId: getFirstRequestId(),
  openTabs: getFirstRequestId() ? [getFirstRequestId()!] : [],
  activeTabId: getFirstRequestId(),
  loading: false,
  error: null,
};

const apiClientSlice = createSlice({
  name: 'apiClient',
  initialState,
  reducers: {
    // Workspaces
    createWorkspace: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const newWorkspace: APIWorkspace = {
        id: `ws_${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        folders: [],
        requests: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.workspaces.push(newWorkspace);
      saveToStorage(state.workspaces);
    },

    updateWorkspace: (state, action: PayloadAction<{ id: string; name?: string; description?: string }>) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.id);
      if (workspace) {
        if (action.payload.name) workspace.name = action.payload.name;
        if (action.payload.description !== undefined) workspace.description = action.payload.description;
        workspace.updatedAt = Date.now();
        saveToStorage(state.workspaces);
      }
    },

    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = state.workspaces[0]?.id || null;
      }
      saveToStorage(state.workspaces);
    },

    setActiveWorkspace: (state, action: PayloadAction<string | null>) => {
      state.activeWorkspaceId = action.payload;
    },

    // Folders
    createFolder: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        name: string;
        description?: string;
        parentFolderId?: string;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const newFolder: APIFolder = {
          id: `fld_${Date.now()}`,
          name: action.payload.name,
          description: action.payload.description,
          workspaceId: action.payload.workspaceId,
          parentFolderId: action.payload.parentFolderId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        workspace.folders.push(newFolder);
        workspace.updatedAt = Date.now();
        saveToStorage(state.workspaces);
      }
    },

    updateFolder: (state, action: PayloadAction<{ id: string; name?: string; description?: string }>) => {
      for (const workspace of state.workspaces) {
        const folder = workspace.folders.find((f) => f.id === action.payload.id);
        if (folder) {
          if (action.payload.name) folder.name = action.payload.name;
          if (action.payload.description !== undefined) folder.description = action.payload.description;
          folder.updatedAt = Date.now();
          workspace.updatedAt = Date.now();
          saveToStorage(state.workspaces);
          break;
        }
      }
    },

    deleteFolder: (state, action: PayloadAction<string>) => {
      for (const workspace of state.workspaces) {
        const folderIndex = workspace.folders.findIndex((f) => f.id === action.payload);
        if (folderIndex !== -1) {
          workspace.folders.splice(folderIndex, 1);
          // Remove requests in this folder
          workspace.requests = workspace.requests.filter((r) => r.folderId !== action.payload);
          workspace.updatedAt = Date.now();
          saveToStorage(state.workspaces);
          break;
        }
      }
    },

    // Requests
    createRequest: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        name: string;
        description?: string;
        data: RequestData;
        folderId?: string;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const newRequest: APIRequest = {
          id: `req_${Date.now()}`,
          name: action.payload.name,
          description: action.payload.description,
          data: action.payload.data,
          folderId: action.payload.folderId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        workspace.requests.push(newRequest);
        workspace.updatedAt = Date.now();
        saveToStorage(state.workspaces);
      }
    },

    updateRequest: (
      state,
      action: PayloadAction<{
        id: string;
        name?: string;
        description?: string;
        data?: RequestData;
        folderId?: string;
      }>
    ) => {
      for (const workspace of state.workspaces) {
        const request = workspace.requests.find((r) => r.id === action.payload.id);
        if (request) {
          if (action.payload.name) request.name = action.payload.name;
          if (action.payload.description !== undefined) request.description = action.payload.description;
          if (action.payload.data) request.data = action.payload.data;
          if (action.payload.folderId !== undefined) request.folderId = action.payload.folderId;
          request.updatedAt = Date.now();
          workspace.updatedAt = Date.now();
          saveToStorage(state.workspaces);
          break;
        }
      }
    },

    deleteRequest: (state, action: PayloadAction<string>) => {
      for (const workspace of state.workspaces) {
        const requestIndex = workspace.requests.findIndex((r) => r.id === action.payload);
        if (requestIndex !== -1) {
          workspace.requests.splice(requestIndex, 1);
          workspace.updatedAt = Date.now();
          if (state.activeRequestId === action.payload) {
            state.activeRequestId = null;
          }
          // Remove from tabs
          state.openTabs = state.openTabs.filter((id) => id !== action.payload);
          if (state.activeTabId === action.payload) {
            state.activeTabId = state.openTabs[0] || null;
          }
          saveToStorage(state.workspaces);
          break;
        }
      }
    },

    setActiveRequest: (state, action: PayloadAction<string | null>) => {
      state.activeRequestId = action.payload;
    },

    duplicateRequest: (state, action: PayloadAction<string>) => {
      for (const workspace of state.workspaces) {
        const request = workspace.requests.find((r) => r.id === action.payload);
        if (request) {
          const duplicate: APIRequest = {
            ...request,
            id: `req_${Date.now()}`,
            name: `${request.name} (Copy)`,
            data: JSON.parse(JSON.stringify(request.data)), // Deep copy
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          workspace.requests.push(duplicate);
          workspace.updatedAt = Date.now();
          saveToStorage(state.workspaces);
          break;
        }
      }
    },

    // Tabs Management
    openTab: (state, action: PayloadAction<string>) => {
      if (!state.openTabs.includes(action.payload)) {
        state.openTabs.push(action.payload);
      }
      state.activeTabId = action.payload;
      state.activeRequestId = action.payload;
    },

    closeTab: (state, action: PayloadAction<string>) => {
      const index = state.openTabs.indexOf(action.payload);
      if (index !== -1) {
        state.openTabs.splice(index, 1);
        if (state.activeTabId === action.payload) {
          state.activeTabId = state.openTabs[index] || state.openTabs[index - 1] || null;
          state.activeRequestId = state.activeTabId;
        }
      }
    },

    setActiveTab: (state, action: PayloadAction<string | null>) => {
      state.activeTabId = action.payload;
      state.activeRequestId = action.payload;
    },

    closeAllTabs: (state) => {
      state.openTabs = [];
      state.activeTabId = null;
      state.activeRequestId = null;
    },

    // Import/Export
    importWorkspace: (state, action: PayloadAction<APIWorkspace>) => {
      const imported = {
        ...action.payload,
        id: `ws_${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.workspaces.push(imported);
      saveToStorage(state.workspaces);
    },

    clearAllWorkspaces: (state) => {
      state.workspaces = [];
      state.activeWorkspaceId = null;
      state.activeRequestId = null;
      state.openTabs = [];
      state.activeTabId = null;
      saveToStorage(state.workspaces);
    },
  },
});

export const {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setActiveWorkspace,
  createFolder,
  updateFolder,
  deleteFolder,
  createRequest,
  updateRequest,
  deleteRequest,
  setActiveRequest,
  duplicateRequest,
  openTab,
  closeTab,
  setActiveTab,
  closeAllTabs,
  importWorkspace,
  clearAllWorkspaces,
} = apiClientSlice.actions;

export default apiClientSlice.reducer;
