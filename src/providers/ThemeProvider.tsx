import { createContext, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { Theme, ThemeMode, ThemeContextValue } from '../types/theme.types';
import { lightTheme, darkTheme } from '../themes';
import { useUI } from '../hooks/useUI';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Usar Redux state em vez de useState local
  const { theme: mode, setTheme: setModeRedux, toggleTheme: toggleThemeRedux } = useUI();

  const theme: Theme = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    toggleThemeRedux();
  };

  const setTheme = (newMode: ThemeMode) => {
    setModeRedux(newMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const value: ThemeContextValue = {
    theme,
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
