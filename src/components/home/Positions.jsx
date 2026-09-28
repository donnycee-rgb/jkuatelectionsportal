import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import { POSITIONS } from '../../config/positions.js';
import { IconArrowRight } from '../common/Icons.jsx';

export default function Positions() {
  return (
    <section id="positions" className="section section--soft" aria-labelledby="positions-title">
      <div className="container">
        <SectionHead
          id="positions-title"
          title="Executive positions"
          lead={<p>Six positions, one seat each. Each candidate may apply for one position.</p>}
        />
        <Reveal as="ul" className="position-grid">
          {POSITIONS.map((p, i) => (
            <li key={p.id} className="position-card" style={{ '--i': i }}>
              <h3 className="position-title">{p.title}</h3>
              <p className="position-desc">{p.description}</p>
              <div className="position-foot">
                <span className="seat-badge">
                  {p.seats} seat
                </span>
                <a
                  className="position-link"
                  href={`#/apply?position=${p.id}`}
                  aria-label={`Apply for ${p.title}`}
                >
                  Apply <IconArrowRight />
                </a>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
