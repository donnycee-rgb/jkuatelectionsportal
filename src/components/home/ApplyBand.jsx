import Reveal from '../common/Reveal.jsx';
import Photo from '../common/Photo.jsx';
import { PHOTOS } from '../../config/photos.js';
import { useNavigate } from '../../hooks/useRoute.js';
import { IconArrowRight } from '../common/Icons.jsx';

export default function ApplyBand() {
  const navigate = useNavigate();
  return (
    <section className={`apply-band ${PHOTOS.cta ? '' : 'apply-band--plain'}`} aria-labelledby="band-title">
      {PHOTOS.cta && <Photo photo={PHOTOS.cta} className="apply-band-photo" sizes="100vw" />}
      <div className="container apply-band-inner">
        <Reveal className="apply-band-copy">
          <p className="eyebrow eyebrow--light">Ready to serve?</p>
          <h2 id="band-title" className="band-title">
            Apply for the 2026/2027 JKUAT French Club executive leadership.
          </h2>
          <p className="band-text">
            The application takes about 20 to 30 minutes. Your progress is saved on this device while you work.
          </p>
          <a className="btn btn--light btn--lg" href="#/apply" onClick={(e) => { e.preventDefault(); navigate('/apply'); }}>
            Start your application <IconArrowRight />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
