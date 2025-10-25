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
  expandedCollections: new Set<string>(),
  expandedFolders: new Set<string>(),
  selectedRequestId: undefined,
  sidebarWidth: 280,
  isCollapsed: false,
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
      state.expandedCollections.delete(action.payload);
    },

    toggleCollection: (state, action: PayloadAction<string>) => {
      const collectionId = action.payload;
      const collection = state.collections.find((c) => c.id === collectionId);

      if (collection) {
        collection.isExpanded = !collection.isExpanded;

        if (collection.isExpanded) {
          state.expandedCollections.add(collectionId);
        } else {
          state.expandedCollections.delete(collectionId);
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
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
