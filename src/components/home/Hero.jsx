import Logo from '../common/Logo.jsx';
import SunburstRays from './SunburstRays.jsx';
import { useNavigate } from '../../hooks/useRoute.js';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-club">
            <span className="hero-club-name">JKUAT French Club</span>
            <span className="hero-motto" lang="fr">L'Équipe Gagnante</span>
          </p>

          <p className="hero-kicker">
            Executive Leadership Application <span className="hero-term">2026/2027</span>
          </p>

          <h1 id="hero-title" className="hero-title">
            Shape the next chapter of the JKUAT French Club.
          </h1>

          <p className="hero-body">
            The JKUAT French Club invites eligible members to apply for executive leadership positions for the
            2026/2027 academic year. This is an opportunity to contribute, lead, organize, and help strengthen the
            club's French language and Francophone cultural activities.
          </p>

          <div className="hero-actions">
            <a className="btn btn--primary btn--lg" href="#/apply" onClick={(e) => { e.preventDefault(); navigate('/apply'); }}>
              Apply for a position
            </a>
            <a className="btn btn--ghost btn--lg" href="#/?s=positions" onClick={(e) => { e.preventDefault(); navigate('/', 'positions'); }}>
              View executive positions
            </a>
          </div>

          <dl className="hero-facts">
            <div><dt>Positions</dt><dd>6</dd></div>
            <div><dt>Seats per position</dt><dd>1</dd></div>
            <div><dt>Applications per candidate</dt><dd>1</dd></div>
          </dl>
        </div>

        <div className="hero-visual">
          <SunburstRays />
          <Logo className="hero-logo" eager />
        </div>
      </div>
    </section>
  );
}
