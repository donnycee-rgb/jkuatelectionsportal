// Light/dark theme. Follows the system setting until the visitor chooses,
// then remembers the choice (index.html applies it before first paint).

import { useCallback, useEffect, useState } from 'react';

const KEY = 'jfc-theme';
const mq = () => window.matchMedia('(prefers-color-scheme: dark)');

const current = () => {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return mq().matches ? 'dark' : 'light';
};

export function useTheme() {
  const [theme, setTheme] = useState(current);

  useEffect(() => {
    const m = mq();
    const on = () => setTheme(current());
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);

  const toggle = useCallback(() => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
