import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import Photo from '../common/Photo.jsx';
import { POSITIONS } from '../../config/positions.js';
import { PHOTOS } from '../../config/photos.js';
import { IconArrowRight } from '../common/Icons.jsx';

export default function Positions() {
  return (
    <section id="positions" className="section section--soft" aria-labelledby="positions-title">
      <div className="container split split--image-text split--wide-list">
        <Reveal variant="image" className="split-media split-media--sticky">
          <Photo photo={PHOTOS.positions} className="photo--portrait" sizes="(min-width: 900px) 40vw, 100vw" />
        </Reveal>

        <div className="split-text">
          <SectionHead
            id="positions-title"
            index="02"
            eyebrow="Positions"
            title="Executive positions"
            lead={<p>Six positions, one seat each. Each candidate may apply for one position.</p>}
          />
          <Reveal as="ol" className="position-list">
            {POSITIONS.map((p, i) => (
              <li key={p.id} className="position-row" style={{ '--i': i }}>
                <span className="position-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="position-body">
                  <h3 className="position-title">{p.title}</h3>
                  <p className="position-desc">{p.description}</p>
                </div>
                <div className="position-meta">
                  <span className="seat-badge">{p.seats} seat</span>
                  <a className="position-link" href={`#/apply?position=${p.id}`} aria-label={`Apply for ${p.title}`}>
                    Apply <IconArrowRight />
                  </a>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
