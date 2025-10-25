import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Collections Slice - Gerencia coleções de testes e requests
 */

export interface Variable {
  key: string;
  value: string;
  enabled: boolean;
}

export interface TestStep {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | null;
  assert?: Record<string, unknown>;
}

export interface TestSuite {
  id: string;
  node_id: string;
  suite_name: string;
  description?: string;
  base_url?: string;
  variables?: Variable[];
  steps: TestStep[];
  metadata?: {
    priority?: 'critical' | 'high' | 'medium' | 'low';
    tags?: string[];
  };
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  suites: TestSuite[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsState {
  collections: Collection[];
  activeCollectionId: string | null;
  activeSuiteId: string | null;
  activeStepId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  activeCollectionId: null,
  activeSuiteId: null,
  activeStepId: null,
  isLoading: false,
  error: null,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    // Collections CRUD
    addCollection: (state, action: PayloadAction<Collection>) => {
      state.collections.push(action.payload);
    },
    updateCollection: (state, action: PayloadAction<{ id: string; updates: Partial<Collection> }>) => {
      const index = state.collections.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.collections[index] = { ...state.collections[index], ...action.payload.updates };
      }
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter((c) => c.id !== action.payload);
      if (state.activeCollectionId === action.payload) {
        state.activeCollectionId = null;
        state.activeSuiteId = null;
        state.activeStepId = null;
      }
    },

    // Test Suite CRUD
    addTestSuite: (state, action: PayloadAction<{ collectionId: string; suite: TestSuite }>) => {
      const collection = state.collections.find((c) => c.id === action.payload.collectionId);
      if (collection) {
        collection.suites.push(action.payload.suite);
      }
    },
    updateTestSuite: (
      state,
      action: PayloadAction<{ collectionId: string; suiteId: string; updates: Partial<TestSuite> }>
    ) => {
      const collection = state.collections.find((c) => c.id === action.payload.collectionId);
      if (collection) {
        const index = collection.suites.findIndex((s) => s.id === action.payload.suiteId);
        if (index !== -1) {
          collection.suites[index] = { ...collection.suites[index], ...action.payload.updates };
        }
      }
    },
    deleteTestSuite: (state, action: PayloadAction<{ collectionId: string; suiteId: string }>) => {
      const collection = state.collections.find((c) => c.id === action.payload.collectionId);
      if (collection) {
        collection.suites = collection.suites.filter((s) => s.id !== action.payload.suiteId);
        if (state.activeSuiteId === action.payload.suiteId) {
          state.activeSuiteId = null;
          state.activeStepId = null;
        }
      }
    },

    // Active Selection
    setActiveCollection: (state, action: PayloadAction<string | null>) => {
      state.activeCollectionId = action.payload;
    },
    setActiveSuite: (state, action: PayloadAction<string | null>) => {
      state.activeSuiteId = action.payload;
    },
    setActiveStep: (state, action: PayloadAction<string | null>) => {
      state.activeStepId = action.payload;
    },

    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addCollection,
  updateCollection,
  deleteCollection,
  addTestSuite,
  updateTestSuite,
  deleteTestSuite,
  setActiveCollection,
  setActiveSuite,
  setActiveStep,
  setLoading,
  setError,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
