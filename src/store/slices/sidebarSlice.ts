import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  SidebarState,
  SidebarTab,
  SidebarView,
  SidebarCollection,
  SidebarEnvironment,
  SidebarHistoryItem,
} from '../../types';

const initialState: SidebarState = {
  activeTab: 'collections',
  activeView: 'collections',
  searchQuery: '',
  collections: [],
  environments: [],
  history: [],
  expandedCollections: [], // Changed from Set to Array for Redux serialization
  expandedFolders: [], // Changed from Set to Array for Redux serialization
  selectedRequestId: undefined,
  sidebarWidth: 280,
  isCollapsed: false,
  viewStates: {
    collections: {},
    environments: {},
    history: {},
    settings: {},
  },
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<SidebarTab>) => {
      state.activeTab = action.payload;
    },

    setActiveView: (state, action: PayloadAction<SidebarView>) => {
      state.activeView = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setCollections: (state, action: PayloadAction<SidebarCollection[]>) => {
      state.collections = action.payload;
    },

    addCollection: (state, action: PayloadAction<SidebarCollection>) => {
      state.collections.push(action.payload);
    },

    removeCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter((c) => c.id !== action.payload);
      state.expandedCollections = state.expandedCollections.filter((id) => id !== action.payload);
    },

    toggleCollection: (state, action: PayloadAction<string>) => {
      const collectionId = action.payload;
      const collection = state.collections.find((c) => c.id === collectionId);

      if (collection) {
        collection.isExpanded = !collection.isExpanded;

        if (collection.isExpanded) {
          if (!state.expandedCollections.includes(collectionId)) {
            state.expandedCollections.push(collectionId);
          }
        } else {
          state.expandedCollections = state.expandedCollections.filter((id) => id !== collectionId);
        }
      }
    },

    setSelectedRequest: (state, action: PayloadAction<string | undefined>) => {
      state.selectedRequestId = action.payload;
    },

    setEnvironments: (state, action: PayloadAction<SidebarEnvironment[]>) => {
      state.environments = action.payload;
    },

    addToHistory: (state, action: PayloadAction<SidebarHistoryItem>) => {
      state.history.unshift(action.payload);
      // Keep only last 50 items
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
    },

    clearHistory: (state) => {
      state.history = [];
    },

    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },

    toggleSidebarCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },

    updateViewState: (state, action: PayloadAction<{ viewId: SidebarView; state: Record<string, unknown> }>) => {
      state.viewStates[action.payload.viewId] = {
        ...state.viewStates[action.payload.viewId],
        ...action.payload.state,
      };
    },
  },
});

export const {
  setActiveTab,
  setActiveView,
  setSearchQuery,
  setCollections,
  addCollection,
  removeCollection,
  toggleCollection,
  setSelectedRequest,
  setEnvironments,
  addToHistory,
  clearHistory,
  setSidebarWidth,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  updateViewState,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
