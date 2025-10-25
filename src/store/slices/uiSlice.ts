import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * UI Slice - Gerencia estado da interface
 * - Theme (dark/light)
 * - Sidebar (collapsed/expanded, width)
 * - Active navigation item
 * - Modals/dialogs visibility
 */

export type ThemeMode = 'dark' | 'light';

export interface UiState {
  theme: ThemeMode;
  sidebar: {
    isCollapsed: boolean;
    width: number;
  };
  activeNavItem: string;
  activeEnvironment: string;
  modals: {
    confirmDialog: boolean;
    settingsDialog: boolean;
  };
}

const initialState: UiState = {
  theme: 'dark',
  sidebar: {
    isCollapsed: false,
    width: 250,
  },
  activeNavItem: 'my-apis',
  activeEnvironment: 'dev',
  modals: {
    confirmDialog: false,
    settingsDialog: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },

    // Sidebar
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebar.width = action.payload;
    },

    // Navigation
    setActiveNavItem: (state, action: PayloadAction<string>) => {
      state.activeNavItem = action.payload;
    },

    // Environment
    setActiveEnvironment: (state, action: PayloadAction<string>) => {
      state.activeEnvironment = action.payload;
    },

    // Modals
    setModalOpen: (state, action: PayloadAction<{ modal: keyof UiState['modals']; isOpen: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.isOpen;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setSidebarWidth,
  setActiveNavItem,
  setActiveEnvironment,
  setModalOpen,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
