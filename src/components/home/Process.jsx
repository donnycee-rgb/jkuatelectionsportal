import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import Photo from '../common/Photo.jsx';
import { PHOTOS } from '../../config/photos.js';

const STEPS = [
  { n: '01', label: 'Choose', title: 'Choose a position', text: 'Select ONE executive position you wish to contest.' },
  { n: '02', label: 'Apply', title: 'Complete your application', text: 'Provide your personal details, leadership experience and vision.' },
  { n: '03', label: 'Review', title: 'Application review', text: "The submitted information will be reviewed according to the club's election process." },
  { n: '04', label: 'Next steps', title: 'Next steps', text: 'Eligible candidates will be informed about subsequent stages.' },
];

export default function Process() {
  return (
    <section id="process" className="section section--white" aria-labelledby="process-title">
      <div className="container split split--text-image split--process">
        <div className="split-text">
          <SectionHead id="process-title" index="03" eyebrow="Process" title="Application process" />
          <Reveal as="ol" className="process">
            {STEPS.map((s, i) => (
              <li key={s.n} className="process-step" style={{ '--i': i }}>
                <span className="process-num" aria-hidden="true">{s.n}</span>
                <div>
                  <p className="process-label">{s.label}</p>
                  <h3 className="process-title">{s.title}</h3>
                  <p className="process-text">{s.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
        <Reveal variant="image" className="split-media split-media--strip" delay={150}>
          <Photo photo={PHOTOS.process} className="photo--strip" sizes="(min-width: 900px) 34vw, 100vw" />
        </Reveal>
      </div>
    </section>
  );
}
