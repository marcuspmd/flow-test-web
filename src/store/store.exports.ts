/**
 * Store Exports - Centralized exports for Redux store
 */

// Store
export { store, useAppDispatch, useAppSelector } from './index';
export type { RootState, AppDispatch } from './index';

// UI Slice
export {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setSidebarWidth,
  setActiveNavItem,
  setActiveEnvironment as setActiveEnvironmentUI,
  setModalOpen,
  closeAllModals,
} from './slices/uiSlice';
export type { ThemeMode, UiState } from './slices/uiSlice';

// Collections Slice
export {
  addCollection,
  updateCollection,
  deleteCollection,
  addTestSuite,
  updateTestSuite,
  deleteTestSuite,
  setActiveCollection,
  setActiveSuite,
  setActiveStep,
  setLoading as setCollectionsLoading,
  setError as setCollectionsError,
} from './slices/collectionsSlice';
export type { Variable, TestStep, TestSuite, Collection, CollectionsState } from './slices/collectionsSlice';

// Environments Slice
export {
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  toggleVariable,
  setActiveEnvironment,
  setLoading as setEnvironmentsLoading,
  setError as setEnvironmentsError,
} from './slices/environmentsSlice';
export type { EnvironmentVariable, Environment, EnvironmentsState } from './slices/environmentsSlice';
