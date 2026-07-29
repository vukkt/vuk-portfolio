import { createContext, useContext } from 'react';

/** The theme actually painted. */
export type Theme = 'dark' | 'light';

/** What the visitor chose: a fixed theme, or follow their local daylight. */
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeContextValue {
  /** Current selection — 'auto' follows sunrise/sunset where the visitor is. */
  mode: ThemeMode;
  /** Resolved theme for the current mode. */
  theme: Theme;
  /** auto -> light -> dark -> auto */
  cycleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
