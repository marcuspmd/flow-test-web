import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * API Environments Slice - Gerencia variáveis de ambiente para requisições
 */

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  secret?: boolean;
  description?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
  createdAt: number;
  updatedAt: number;
}

export interface APIEnvironmentsState {
  environments: Environment[];
  activeEnvironmentId: string | null;
  globalVariables: EnvironmentVariable[];
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'flow-test-api-environments';
const GLOBAL_VARS_KEY = 'flow-test-api-global-variables';

// Helper para carregar do localStorage
const loadEnvironments = (): Environment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadGlobalVariables = (): EnvironmentVariable[] => {
  try {
    const stored = localStorage.getItem(GLOBAL_VARS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper para salvar no localStorage
const saveEnvironments = (environments: Environment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(environments));
  } catch (error) {
    console.error('Error saving environments to storage:', error);
  }
};

const saveGlobalVariables = (variables: EnvironmentVariable[]) => {
  try {
    localStorage.setItem(GLOBAL_VARS_KEY, JSON.stringify(variables));
  } catch (error) {
    console.error('Error saving global variables to storage:', error);
  }
};

const initialState: APIEnvironmentsState = {
  environments: loadEnvironments(),
  activeEnvironmentId: null,
  globalVariables: loadGlobalVariables(),
  loading: false,
  error: null,
};

const apiEnvironmentsSlice = createSlice({
  name: 'apiEnvironments',
  initialState,
  reducers: {
    // Environments
    createEnvironment: (state, action: PayloadAction<{ name: string }>) => {
      const newEnvironment: Environment = {
        id: `env_${Date.now()}`,
        name: action.payload.name,
        variables: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.environments.push(newEnvironment);
      saveEnvironments(state.environments);
    },

    updateEnvironment: (
      state,
      action: PayloadAction<{ id: string; name?: string; variables?: EnvironmentVariable[] }>
    ) => {
      const environment = state.environments.find((e) => e.id === action.payload.id);
      if (environment) {
        if (action.payload.name) environment.name = action.payload.name;
        if (action.payload.variables) environment.variables = action.payload.variables;
        environment.updatedAt = Date.now();
        saveEnvironments(state.environments);
      }
    },

    deleteEnvironment: (state, action: PayloadAction<string>) => {
      state.environments = state.environments.filter((e) => e.id !== action.payload);
      if (state.activeEnvironmentId === action.payload) {
        state.activeEnvironmentId = null;
      }
      saveEnvironments(state.environments);
    },

    setActiveEnvironment: (state, action: PayloadAction<string | null>) => {
      state.activeEnvironmentId = action.payload;
    },

    duplicateEnvironment: (state, action: PayloadAction<string>) => {
      const environment = state.environments.find((e) => e.id === action.payload);
      if (environment) {
        const duplicate: Environment = {
          ...environment,
          id: `env_${Date.now()}`,
          name: `${environment.name} (Copy)`,
          variables: JSON.parse(JSON.stringify(environment.variables)),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.environments.push(duplicate);
        saveEnvironments(state.environments);
      }
    },

    // Variables within Environment
    addVariable: (
      state,
      action: PayloadAction<{
        environmentId: string;
        key: string;
        value: string;
        description?: string;
        secret?: boolean;
      }>
    ) => {
      const environment = state.environments.find((e) => e.id === action.payload.environmentId);
      if (environment) {
        const newVariable: EnvironmentVariable = {
          id: `var_${Date.now()}`,
          key: action.payload.key,
          value: action.payload.value,
          enabled: true,
          secret: action.payload.secret,
          description: action.payload.description,
        };
        environment.variables.push(newVariable);
        environment.updatedAt = Date.now();
        saveEnvironments(state.environments);
      }
    },

    updateVariable: (
      state,
      action: PayloadAction<{
        environmentId: string;
        variableId: string;
        key?: string;
        value?: string;
        enabled?: boolean;
        secret?: boolean;
        description?: string;
      }>
    ) => {
      const environment = state.environments.find((e) => e.id === action.payload.environmentId);
      if (environment) {
        const variable = environment.variables.find((v) => v.id === action.payload.variableId);
        if (variable) {
          if (action.payload.key !== undefined) variable.key = action.payload.key;
          if (action.payload.value !== undefined) variable.value = action.payload.value;
          if (action.payload.enabled !== undefined) variable.enabled = action.payload.enabled;
          if (action.payload.secret !== undefined) variable.secret = action.payload.secret;
          if (action.payload.description !== undefined) variable.description = action.payload.description;
          environment.updatedAt = Date.now();
          saveEnvironments(state.environments);
        }
      }
    },

    deleteVariable: (state, action: PayloadAction<{ environmentId: string; variableId: string }>) => {
      const environment = state.environments.find((e) => e.id === action.payload.environmentId);
      if (environment) {
        environment.variables = environment.variables.filter((v) => v.id !== action.payload.variableId);
        environment.updatedAt = Date.now();
        saveEnvironments(state.environments);
      }
    },

    // Global Variables
    addGlobalVariable: (
      state,
      action: PayloadAction<{
        key: string;
        value: string;
        description?: string;
        secret?: boolean;
      }>
    ) => {
      const newVariable: EnvironmentVariable = {
        id: `gvar_${Date.now()}`,
        key: action.payload.key,
        value: action.payload.value,
        enabled: true,
        secret: action.payload.secret,
        description: action.payload.description,
      };
      state.globalVariables.push(newVariable);
      saveGlobalVariables(state.globalVariables);
    },

    updateGlobalVariable: (
      state,
      action: PayloadAction<{
        variableId: string;
        key?: string;
        value?: string;
        enabled?: boolean;
        secret?: boolean;
        description?: string;
      }>
    ) => {
      const variable = state.globalVariables.find((v) => v.id === action.payload.variableId);
      if (variable) {
        if (action.payload.key !== undefined) variable.key = action.payload.key;
        if (action.payload.value !== undefined) variable.value = action.payload.value;
        if (action.payload.enabled !== undefined) variable.enabled = action.payload.enabled;
        if (action.payload.secret !== undefined) variable.secret = action.payload.secret;
        if (action.payload.description !== undefined) variable.description = action.payload.description;
        saveGlobalVariables(state.globalVariables);
      }
    },

    deleteGlobalVariable: (state, action: PayloadAction<string>) => {
      state.globalVariables = state.globalVariables.filter((v) => v.id !== action.payload);
      saveGlobalVariables(state.globalVariables);
    },

    clearAllGlobalVariables: (state) => {
      state.globalVariables = [];
      saveGlobalVariables(state.globalVariables);
    },

    // Import/Export
    importEnvironment: (state, action: PayloadAction<Environment>) => {
      const imported = {
        ...action.payload,
        id: `env_${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.environments.push(imported);
      saveEnvironments(state.environments);
    },

    clearAllEnvironments: (state) => {
      state.environments = [];
      state.activeEnvironmentId = null;
      saveEnvironments(state.environments);
    },
  },
});

export const {
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  setActiveEnvironment,
  duplicateEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  addGlobalVariable,
  updateGlobalVariable,
  deleteGlobalVariable,
  clearAllGlobalVariables,
  importEnvironment,
  clearAllEnvironments,
} = apiEnvironmentsSlice.actions;

export default apiEnvironmentsSlice.reducer;
