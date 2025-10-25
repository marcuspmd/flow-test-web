import { useAppSelector, useAppDispatch } from '../store';
import {
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  toggleVariable,
  setActiveEnvironment,
  Environment,
  EnvironmentVariable,
} from '../store/store.exports';

/**
 * Hook customizado para gerenciar ambientes e variáveis
 * Fornece acesso fácil ao estado de environments e suas actions
 */
export const useEnvironments = () => {
  const dispatch = useAppDispatch();
  const environmentsState = useAppSelector((state) => state.environments);

  return {
    // State
    environments: environmentsState.environments,
    activeEnvironmentId: environmentsState.activeEnvironmentId,
    isLoading: environmentsState.isLoading,
    error: environmentsState.error,

    // Computed
    activeEnvironment: environmentsState.environments.find((e) => e.id === environmentsState.activeEnvironmentId),
    activeVariables:
      environmentsState.environments.find((e) => e.id === environmentsState.activeEnvironmentId)?.variables || [],

    // Actions - Environments
    addEnvironment: (environment: Environment) => dispatch(addEnvironment(environment)),
    updateEnvironment: (id: string, updates: Partial<Environment>) => dispatch(updateEnvironment({ id, updates })),
    deleteEnvironment: (id: string) => dispatch(deleteEnvironment(id)),
    setActiveEnvironment: (id: string) => dispatch(setActiveEnvironment(id)),

    // Actions - Variables
    addVariable: (environmentId: string, variable: EnvironmentVariable) =>
      dispatch(addVariable({ environmentId, variable })),
    updateVariable: (environmentId: string, key: string, updates: Partial<EnvironmentVariable>) =>
      dispatch(updateVariable({ environmentId, key, updates })),
    deleteVariable: (environmentId: string, key: string) => dispatch(deleteVariable({ environmentId, key })),
    toggleVariable: (environmentId: string, key: string) => dispatch(toggleVariable({ environmentId, key })),
  };
};
