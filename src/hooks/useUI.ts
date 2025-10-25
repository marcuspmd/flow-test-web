import { useAppSelector, useAppDispatch } from '../store';
import {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setSidebarWidth,
  setActiveNavItem,
  setActiveEnvironmentUI,
  ThemeMode,
} from '../store/store.exports';

/**
 * Hook customizado para gerenciar estado da UI
 * Encapsula lógica comum de UI (theme, sidebar, navigation)
 */
export const useUI = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.ui);

  return {
    // State
    theme: uiState.theme,
    sidebar: uiState.sidebar,
    activeNavItem: uiState.activeNavItem,
    activeEnvironment: uiState.activeEnvironment,
    modals: uiState.modals,

    // Actions
    setTheme: (theme: ThemeMode) => dispatch(setTheme(theme)),
    toggleTheme: () => dispatch(toggleTheme()),
    setSidebarCollapsed: (collapsed: boolean) => dispatch(setSidebarCollapsed(collapsed)),
    toggleSidebar: () => dispatch(toggleSidebar()),
    setSidebarWidth: (width: number) => dispatch(setSidebarWidth(width)),
    setActiveNavItem: (item: string) => dispatch(setActiveNavItem(item)),
    setActiveEnvironment: (env: string) => dispatch(setActiveEnvironmentUI(env)),
  };
};
