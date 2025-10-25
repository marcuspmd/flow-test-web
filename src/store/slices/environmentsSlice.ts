import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Environments Slice - Gerencia variáveis de ambiente
 * Permite criar múltiplos ambientes (dev, staging, prod) com suas próprias variáveis
 */

export interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'text' | 'secret';
  enabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  displayName: string;
  variables: EnvironmentVariable[];
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentsState {
  environments: Environment[];
  activeEnvironmentId: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: EnvironmentsState = {
  environments: [
    {
      id: 'dev',
      name: 'dev',
      displayName: 'Development',
      variables: [
        { key: 'API_BASE_URL', value: 'http://localhost:3000', type: 'text', enabled: true },
        { key: 'API_KEY', value: 'dev-api-key-123', type: 'secret', enabled: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'staging',
      name: 'staging',
      displayName: 'Staging',
      variables: [
        { key: 'API_BASE_URL', value: 'https://staging-api.example.com', type: 'text', enabled: true },
        { key: 'API_KEY', value: 'staging-api-key-456', type: 'secret', enabled: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod',
      name: 'prod',
      displayName: 'Production',
      variables: [
        { key: 'API_BASE_URL', value: 'https://api.example.com', type: 'text', enabled: true },
        { key: 'API_KEY', value: 'prod-api-key-789', type: 'secret', enabled: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  activeEnvironmentId: 'dev',
  isLoading: false,
  error: null,
};

const environmentsSlice = createSlice({
  name: 'environments',
  initialState,
  reducers: {
    // Environment CRUD
    addEnvironment: (state, action: PayloadAction<Environment>) => {
      state.environments.push(action.payload);
    },
    updateEnvironment: (state, action: PayloadAction<{ id: string; updates: Partial<Environment> }>) => {
      const index = state.environments.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.environments[index] = {
          ...state.environments[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteEnvironment: (state, action: PayloadAction<string>) => {
      state.environments = state.environments.filter((e) => e.id !== action.payload);
      if (state.activeEnvironmentId === action.payload && state.environments.length > 0) {
        state.activeEnvironmentId = state.environments[0].id;
      }
    },

    // Variables CRUD
    addVariable: (state, action: PayloadAction<{ environmentId: string; variable: EnvironmentVariable }>) => {
      const env = state.environments.find((e) => e.id === action.payload.environmentId);
      if (env) {
        env.variables.push(action.payload.variable);
        env.updatedAt = new Date().toISOString();
      }
    },
    updateVariable: (
      state,
      action: PayloadAction<{ environmentId: string; key: string; updates: Partial<EnvironmentVariable> }>
    ) => {
      const env = state.environments.find((e) => e.id === action.payload.environmentId);
      if (env) {
        const index = env.variables.findIndex((v) => v.key === action.payload.key);
        if (index !== -1) {
          env.variables[index] = { ...env.variables[index], ...action.payload.updates };
          env.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteVariable: (state, action: PayloadAction<{ environmentId: string; key: string }>) => {
      const env = state.environments.find((e) => e.id === action.payload.environmentId);
      if (env) {
        env.variables = env.variables.filter((v) => v.key !== action.payload.key);
        env.updatedAt = new Date().toISOString();
      }
    },
    toggleVariable: (state, action: PayloadAction<{ environmentId: string; key: string }>) => {
      const env = state.environments.find((e) => e.id === action.payload.environmentId);
      if (env) {
        const variable = env.variables.find((v) => v.key === action.payload.key);
        if (variable) {
          variable.enabled = !variable.enabled;
          env.updatedAt = new Date().toISOString();
        }
      }
    },

    // Active Environment
    setActiveEnvironment: (state, action: PayloadAction<string>) => {
      state.activeEnvironmentId = action.payload;
    },

    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  toggleVariable,
  setActiveEnvironment,
  setLoading,
  setError,
} = environmentsSlice.actions;

export default environmentsSlice.reducer;
