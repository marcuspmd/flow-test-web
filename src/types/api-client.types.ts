import { RequestData } from '../components/organisms/RequestPane';

/**
 * Representa uma requisição HTTP individual
 */
export interface Request {
  id: string;
  name: string;
  description?: string;
  data: RequestData;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Representa uma pasta para organizar requisições
 */
export interface Folder {
  id: string;
  name: string;
  description?: string;
  collectionId: string;
  parentFolderId?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Representa uma coleção de requisições
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  folders: Folder[];
  requests: Request[];
  createdAt: number;
  updatedAt: number;
}

/**
 * State do Redux para Collections
 */
export interface CollectionsState {
  collections: Collection[];
  activeCollectionId: string | null;
  activeRequestId: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Representa um environment (conjunto de variáveis)
 */
export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Variável de ambiente
 */
export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  secret?: boolean;
  description?: string;
}

/**
 * State do Redux para Environments
 */
export interface EnvironmentsState {
  environments: Environment[];
  activeEnvironmentId: string | null;
  globalVariables: EnvironmentVariable[];
  loading: boolean;
  error: string | null;
}

/**
 * Entrada no histórico de requisições
 */
export interface HistoryEntry {
  id: string;
  requestId: string;
  request: RequestData;
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    size: number;
    time: number;
  };
  timestamp: number;
  success: boolean;
}

/**
 * State do Redux para History
 */
export interface HistoryState {
  entries: HistoryEntry[];
  maxEntries: number;
  loading: boolean;
}
