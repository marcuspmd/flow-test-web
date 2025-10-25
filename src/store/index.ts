import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Reducers
import uiReducer from './slices/uiSlice';
import collectionsReducer from './slices/collectionsSlice';
import environmentsReducer from './slices/environmentsSlice';
import apiClientReducer from './slices/apiClientSlice';
import apiEnvironmentsReducer from './slices/apiEnvironmentsSlice';
import apiHistoryReducer from './slices/apiHistorySlice';
import sidebarReducer from './slices/sidebarSlice';
import testSuiteEditorReducer from './slices/testSuiteEditorSlice';

/**
 * Root Reducer - Combina todos os slices
 */
const rootReducer = combineReducers({
  ui: uiReducer,
  collections: collectionsReducer,
  environments: environmentsReducer,
  apiClient: apiClientReducer,
  apiEnvironments: apiEnvironmentsReducer,
  apiHistory: apiHistoryReducer,
  sidebar: sidebarReducer,
  testSuiteEditor: testSuiteEditorReducer,
});

/**
 * LocalStorage Middleware - Persiste estado no localStorage
 */
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  // Persiste apenas alguns slices específicos
  const state = storeAPI.getState() as RootState;
  const stateToSave = {
    ui: state.ui,
    collections: state.collections,
    environments: state.environments,
  };

  try {
    localStorage.setItem('flowtest-state', JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }

  return result;
};

/**
 * Load State from LocalStorage
 */
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('flowtest-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return undefined;
  }
};

/**
 * Configure Store
 */
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types or paths if needed
        ignoredActions: [],
      },
    }).concat(localStorageMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
