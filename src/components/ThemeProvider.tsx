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

export function ThemeToggle() {
  const { mode, theme, cycleTheme } = useTheme();
  const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length];

  const hint = useMemo(() => {
    if (mode !== 'auto') return `Theme: ${mode}. Switch to ${next}.`;
    const { sunrise, sunset } = daylightWindow();
    const daylight =
      sunrise === null || sunset === null
        ? theme === 'light'
          ? 'midnight sun where you are'
          : 'polar night where you are'
        : `sunrise ${formatHour(sunrise)} · sunset ${formatHour(sunset)} where you are`;
    return `Theme: auto (${theme} — ${daylight}). Switch to ${next}.`;
  }, [mode, next, theme]);

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={hint}
      aria-label={hint}
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
      {mode === 'auto' ? `[ auto·${theme} ]` : `[ ${mode} ]`}
    </button>
  );
}
