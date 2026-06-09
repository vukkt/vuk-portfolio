import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, useTheme } from './theme-context';
import type { Theme } from './theme-context';

const STORAGE_KEY = 'vuk-portfolio-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-strong)',
        color: 'var(--text-secondary)',
        fontFamily: 'inherit',
        fontSize: 'var(--font-size-xs)',
        letterSpacing: 'var(--letter-spacing-wider)',
        textTransform: 'uppercase',
        padding: '0.4rem 0.7rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, color 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {theme === 'dark' ? '[ light ]' : '[ dark ]'}
    </button>
  );
}
