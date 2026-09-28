import { useEffect, useState } from 'react';
import Logo from '../common/Logo.jsx';
import { IconMenu, IconClose } from '../common/Icons.jsx';
import { useNavigate } from '../../hooks/useRoute.js';

const LINKS = [
  { label: 'The Election', section: 'about' },
  { label: 'Positions', section: 'positions' },
  { label: 'Process', section: 'process' },
  { label: 'Requirements', section: 'requirements' },
];

export default function Header({ variant = 'public' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  const go = (path, section) => {
    setOpen(false);
    navigate(path, section);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className={`container header-inner ${variant === 'admin' ? 'container--wide' : ''}`}>
        <a
          href="#/"
          className="brand"
          onClick={(e) => { e.preventDefault(); go('/'); }}
          aria-label="JKUAT French Club, home"
        >
          <Logo className="brand-logo" eager />
          <span className="brand-text">
            <span className="brand-name">JKUAT French Club</span>
            <span className="brand-sub">{variant === 'admin' ? 'Electoral desk' : 'Leadership application 2026/2027'}</span>
          </span>
        </a>

        {variant === 'public' && (
          <>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <IconClose /> : <IconMenu />}
              <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            </button>

            <nav id="site-nav" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main">
              <ul>
                {LINKS.map((l) => (
                  <li key={l.section}>
                    <a href={`#/?s=${l.section}`} onClick={(e) => { e.preventDefault(); go('/', l.section); }}>
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="nav-cta">
                  <a className="btn btn--primary btn--sm" href="#/apply" onClick={(e) => { e.preventDefault(); go('/apply'); }}>
                    Apply for a position
                  </a>
                </li>
              </ul>
            </nav>
            {open && <div className="nav-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
          </>
        )}
      </div>
    </header>
  );
}
