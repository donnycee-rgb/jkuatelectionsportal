import Logo from '../common/Logo.jsx';
import { useNavigate } from '../../hooks/useRoute.js';

const LINKS = [
  { label: 'The Election', section: 'about' },
  { label: 'Positions', section: 'positions' },
  { label: 'Process', section: 'process' },
  { label: 'Requirements', section: 'requirements' },
];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="site-footer">
      <div className="footer-rule" aria-hidden="true"><i /><i /><i /></div>
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={64} decorative />
          <div>
            <p className="footer-name">JKUAT French Club</p>
            <p className="footer-motto" lang="fr">L'Équipe Gagnante</p>
            <p className="footer-term">Leadership Application 2026/2027</p>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <p className="footer-heading">The portal</p>
          <ul>
            {LINKS.map((l) => (
              <li key={l.section}>
                <a href={`#/?s=${l.section}`} onClick={(e) => { e.preventDefault(); navigate('/', l.section); }}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-apply">
          <p className="footer-heading">Applications</p>
          <p className="footer-note">
            All elections are conducted subject to the JKUAT French Club constitution and applicable election
            guidelines.
          </p>
          <a className="btn btn--primary btn--sm" href="#/apply" onClick={(e) => { e.preventDefault(); navigate('/apply'); }}>
            Apply for a position
          </a>
        </div>
      </div>
      <div className="container footer-base">
        <span>&copy; 2026 JKUAT French Club &middot; Jomo Kenyatta University of Agriculture and Technology</span>
        <span>Executive Leadership Application Portal</span>
      </div>
    </footer>
  );
}
