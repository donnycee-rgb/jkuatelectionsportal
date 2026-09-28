// Minimal hash router. Hash routes work on every static host without
// server rewrite rules (GitHub Pages, Netlify, cPanel, Firebase, etc).

import { useEffect, useState, useCallback } from 'react';

const parse = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(query) };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // Move focus for keyboard and screen-reader users without a second scroll.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}

export function useNavigate() {
  return useCallback((path, section) => {
    const target = `#${path}${section ? `?s=${section}` : ''}`;
    if (window.location.hash === target && section) {
      scrollToSection(section);
      return;
    }
    window.location.hash = target;
  }, []);
}
