import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import { IconCheck } from '../common/Icons.jsx';

const ITEMS = [
  { text: "Must be a member of the JKUAT French Club or otherwise meet the club's eligibility requirements.", constitutional: true },
  { text: 'Must provide accurate personal and academic information.' },
  { text: 'Must demonstrate commitment to the club.' },
  { text: 'Must be willing to participate actively in club activities.' },
  { text: 'Must be prepared to fulfill the responsibilities of the position applied for.' },
  { text: 'Must respect the constitution, rules and values of the JKUAT French Club.', constitutional: true },
];

export default function Requirements() {
  return (
    <section id="requirements" className="section section--tint" aria-labelledby="requirements-title">
      <div className="container req-grid">
        <SectionHead id="requirements-title" title="Who should apply?" />
        <Reveal as="ul" className="req-list">
          {ITEMS.map((item) => (
            <li key={item.text} className="req-item">
              <span className="req-icon" aria-hidden="true"><IconCheck /></span>
              <div>
                <p>{item.text}</p>
                {item.constitutional && (
                  <p className="req-note">Subject to the JKUAT French Club constitution and applicable election guidelines.</p>
                )}
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
