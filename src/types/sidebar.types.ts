/**
 * Tipos para o sistema de Sidebar tipo Postman
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type SidebarTab = 'collections' | 'environments' | 'flows' | 'history';

export type SidebarView = 'collections' | 'environments' | 'history' | 'settings';

export interface SidebarRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url?: string;
  collectionId: string;
  folderId?: string;
}

export interface SidebarFolder {
  id: string;
  name: string;
  collectionId: string;
  parentId?: string;
  requests: SidebarRequest[];
  subfolders: SidebarFolder[];
  isExpanded?: boolean;
}

export interface SidebarCollection {
  id: string;
  name: string;
  description?: string;
  folders: SidebarFolder[];
  requests: SidebarRequest[];
  isExpanded?: boolean;
}

export interface SidebarEnvironment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
}

export interface SidebarHistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  timestamp: Date;
  status?: number;
}

export interface SidebarState {
  activeTab: SidebarTab;
  activeView: SidebarView;
  searchQuery: string;
  collections: SidebarCollection[];
  environments: SidebarEnvironment[];
  history: SidebarHistoryItem[];
  expandedCollections: Set<string>;
  expandedFolders: Set<string>;
  selectedRequestId?: string;
  sidebarWidth: number;
  isCollapsed: boolean;
}

export interface SidebarTabConfig {
  id: SidebarTab;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
}
