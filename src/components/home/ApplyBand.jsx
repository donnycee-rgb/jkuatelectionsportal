import Reveal from '../common/Reveal.jsx';
import { useNavigate } from '../../hooks/useRoute.js';

export default function ApplyBand() {
  const navigate = useNavigate();
  return (
    <section className="apply-band" aria-labelledby="band-title">
      <div className="container apply-band-inner">
        <Reveal>
          <p className="band-accent" lang="fr" aria-hidden="true">Candidature</p>
          <h2 id="band-title" className="band-title">Ready to serve the club?</h2>
          <p className="band-text">
            The application takes about 20 to 30 minutes. Your progress is saved on this device while you work.
          </p>
        </Reveal>
        <a className="btn btn--light btn--lg" href="#/apply" onClick={(e) => { e.preventDefault(); navigate('/apply'); }}>
          Apply for a position
        </a>
      </div>
    </section>
  );
}
