import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestData } from '../../components/organisms/RequestPane';
import { ResponseData } from '../../components/organisms/ResponsePane';

/**
 * API History Slice - Gerencia histórico de execuções de requisições
 */

export interface HistoryEntry {
  id: string;
  requestId?: string;
  requestName?: string;
  request: RequestData;
  response: ResponseData;
  timestamp: number;
  duration: number;
  success: boolean;
  environmentId?: string;
}

export interface APIHistoryState {
  entries: HistoryEntry[];
  maxEntries: number;
  loading: boolean;
}

const STORAGE_KEY = 'flow-test-api-history';
const MAX_ENTRIES = 100; // Limit to last 100 requests

// Helper para carregar do localStorage
const loadFromStorage = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries: HistoryEntry[] = stored ? JSON.parse(stored) : [];
    // Sort by timestamp desc and limit
    return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
};

// Helper para salvar no localStorage
const saveToStorage = (entries: HistoryEntry[]) => {
  try {
    // Only save last MAX_ENTRIES
    const toSave = entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving history to storage:', error);
  }
};

const initialState: APIHistoryState = {
  entries: loadFromStorage(),
  maxEntries: MAX_ENTRIES,
  loading: false,
};

const apiHistorySlice = createSlice({
  name: 'apiHistory',
  initialState,
  reducers: {
    addHistoryEntry: (
      state,
      action: PayloadAction<{
        requestId?: string;
        requestName?: string;
        request: RequestData;
        response: ResponseData;
        duration: number;
        environmentId?: string;
      }>
    ) => {
      const newEntry: HistoryEntry = {
        id: `hist_${Date.now()}`,
        requestId: action.payload.requestId,
        requestName: action.payload.requestName,
        request: action.payload.request,
        response: action.payload.response,
        timestamp: Date.now(),
        duration: action.payload.duration,
        success: action.payload.response.status >= 200 && action.payload.response.status < 400,
        environmentId: action.payload.environmentId,
      };

      // Add to beginning
      state.entries.unshift(newEntry);

      // Keep only MAX_ENTRIES
      if (state.entries.length > state.maxEntries) {
        state.entries = state.entries.slice(0, state.maxEntries);
      }

      saveToStorage(state.entries);
    },

    deleteHistoryEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
      saveToStorage(state.entries);
    },

    clearHistory: (state) => {
      state.entries = [];
      saveToStorage(state.entries);
    },

    clearOldEntries: (state, action: PayloadAction<number>) => {
      // Clear entries older than specified days
      const cutoffTime = Date.now() - action.payload * 24 * 60 * 60 * 1000;
      state.entries = state.entries.filter((e) => e.timestamp >= cutoffTime);
      saveToStorage(state.entries);
    },

    clearFailedEntries: (state) => {
      state.entries = state.entries.filter((e) => e.success);
      saveToStorage(state.entries);
    },

    setMaxEntries: (state, action: PayloadAction<number>) => {
      state.maxEntries = action.payload;
      if (state.entries.length > action.payload) {
        state.entries = state.entries.slice(0, action.payload);
        saveToStorage(state.entries);
      }
    },
  },
});

export const { addHistoryEntry, deleteHistoryEntry, clearHistory, clearOldEntries, clearFailedEntries, setMaxEntries } =
  apiHistorySlice.actions;

export default apiHistorySlice.reducer;
