import { lazy, ComponentType } from 'react';
import { VscFiles, VscSettings, VscHistory } from 'react-icons/vsc';
import { MdOutlineSettingsApplications } from 'react-icons/md';
import type { SidebarView } from '../../../../types';

export interface SidebarViewConfig {
  id: SidebarView;
  title: string;
  icon: ComponentType;
  component: ComponentType;
  defaultProps?: Record<string, unknown>;
}

/**
 * Registry of all available sidebar views
 * Each view is lazy-loaded for optimal performance
 */
const viewsRegistry: SidebarViewConfig[] = [
  {
    id: 'collections',
    title: 'Collections',
    icon: VscFiles,
    component: lazy(() =>
      import('../CollectionsView').then((module) => ({ default: module.CollectionsView }))
    ),
  },
  {
    id: 'environments',
    title: 'Environments',
    icon: MdOutlineSettingsApplications,
    component: lazy(() =>
      import('../EnvironmentsView').then((module) => ({ default: module.EnvironmentsView }))
    ),
  },
  {
    id: 'history',
    title: 'History',
    icon: VscHistory,
    component: lazy(() => import('../HistoryView').then((module) => ({ default: module.HistoryView }))),
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: VscSettings,
    component: lazy(() => import('../SettingsView').then((module) => ({ default: module.SettingsView }))),
  },
];

/**
 * Get a view configuration by its ID
 * @param id - The view ID to retrieve
 * @returns The view configuration or undefined if not found
 */
export function getViewById(id: SidebarView): SidebarViewConfig | undefined {
  return viewsRegistry.find((view) => view.id === id);
}

/**
 * Get all registered views
 * @returns Array of all view configurations
 */
export function getAllViews(): SidebarViewConfig[] {
  return viewsRegistry;
}

/**
 * Check if a view ID is valid
 * @param id - The view ID to validate
 * @returns True if the view exists
 */
export function isValidViewId(id: string): id is SidebarView {
  return viewsRegistry.some((view) => view.id === id);
}
