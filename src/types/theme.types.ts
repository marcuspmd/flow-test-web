// Theme Types
export interface Theme {
  brand: string;
  text: string;
  'primary-text': string;
  'primary-theme': string;
  'secondary-text': string;
  'sidebar-collection-item-active-indent-border': string;
  'sidebar-collection-item-active-background': string;
  'sidebar-background': string;
  'sidebar-bottom-bg': string;
  'request-dragbar-background': string;
  'request-dragbar-background-active': string;
  'tab-inactive': string;
  'tab-active-border': string;
  'layout-border': string;
  'codemirror-border': string;
  'codemirror-background': string;
  'text-link': string;
  'text-danger': string;
  'background-danger': string;
  'method-get': string;
  'method-post': string;
  'method-delete': string;
  'method-patch': string;
  'method-options': string;
  'method-head': string;
  'table-stripe': string;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}
