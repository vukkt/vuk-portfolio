import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, useTheme } from './theme-context';
import type { Theme, ThemeMode } from './theme-context';
import { daylightWindow, msUntilNextDaylightChange, resolveDaylightTheme } from './daylight';

const STORAGE_KEY = 'vuk-portfolio-theme';

const CYCLE: ThemeMode[] = ['auto', 'light', 'dark'];

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
  return 'auto';
}

function formatHour(hour: number): string {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60);
  const carry = m === 60;
  return `${String(carry ? (h + 1) % 24 : h).padStart(2, '0')}:${String(carry ? 0 : m).padStart(2, '0')}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [autoTheme, setAutoTheme] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'dark' : resolveDaylightTheme()
  );

  const theme: Theme = mode === 'auto' ? autoTheme : mode;

  // In auto mode, re-resolve at the next sunrise/sunset (and whenever the
  // tab comes back into view, since timers stall while it's hidden).
  useEffect(() => {
    if (mode !== 'auto') return;

    let timer: number;

    const tick = () => {
      setAutoTheme(resolveDaylightTheme());
      timer = window.setTimeout(tick, msUntilNextDaylightChange());
    };

    tick();

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer);
        tick();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, theme]);

  const cycleTheme = useCallback(() => {
    setMode(prev => CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length]);
  }, []);

  const value = useMemo(
    () => ({ mode, theme, cycleTheme, setMode }),
    [mode, theme, cycleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const ICONS: Record<ThemeMode, ReactNode> = {
  auto: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 1.75v2M10 16.25v2M1.75 10h2M16.25 10h2M4.17 4.17l1.41 1.41M14.42 14.42l1.41 1.41M4.17 15.83l1.41-1.41M14.42 5.58l1.41-1.41" />
      </g>
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1z" fill="currentColor" />
    </svg>
  ),
};

const LABELS: Record<ThemeMode, string> = { auto: 'Auto', light: 'Light', dark: 'Dark' };

export function ThemeToggle() {
  const { mode, theme, setMode } = useTheme();

  const autoHint = useMemo(() => {
    const { sunrise, sunset } = daylightWindow();
    const daylight =
      sunrise === null || sunset === null
        ? theme === 'light'
          ? 'midnight sun where you are'
          : 'polar night where you are'
        : `sunrise ${formatHour(sunrise)}, sunset ${formatHour(sunset)} where you are`;
    return `Auto: follows daylight (${daylight})`;
  }, [theme]);

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Appearance">
      {CYCLE.map(option => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={mode === option}
          aria-label={option === 'auto' ? autoHint : LABELS[option]}
          title={option === 'auto' ? autoHint : LABELS[option]}
          className="theme-toggle__option"
          onClick={() => setMode(option)}
        >
          {ICONS[option]}
        </button>
      ))}
    </div>
  );
}
