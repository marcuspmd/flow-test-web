import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Provider - Wrapper para disponibilizar o Redux store na aplicação
 *
 * @example
 * ```tsx
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 * ```
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
