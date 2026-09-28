import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';
import Photo from '../common/Photo.jsx';
import { PHOTOS } from '../../config/photos.js';

const STAGES = [
  { title: 'Application', text: 'Candidate submits application' },
  { title: 'Review', text: 'Applications are reviewed for eligibility and completeness' },
  { title: 'Shortlisting', text: "Eligible candidates proceed according to the club's election process" },
  { title: 'Election', text: 'Members participate in the official leadership selection process' },
];

export default function About() {
  return (
    <section id="about" className="section section--white" aria-labelledby="about-title">
      <div className="container">
        <div className="split split--text-image">
          <div className="split-text">
            <SectionHead id="about-title" index="01" eyebrow="The election" title="The next leadership team" />
            <Reveal className="prose" delay={120}>
              <p>
                The JKUAT French Club is seeking committed members who are ready to serve, collaborate, organize
                activities, and contribute to the growth of the club.
              </p>
              <p>
                Applicants should demonstrate responsibility, integrity, teamwork, initiative, communication skills,
                and genuine interest in French language and Francophone culture.
              </p>
            </Reveal>
          </div>
          <Reveal variant="image" className="split-media">
            <Photo photo={PHOTOS.election} className="photo--landscape" sizes="(min-width: 900px) 45vw, 100vw" />
          </Reveal>
        </div>

        <Reveal as="ol" className="stages" aria-label="Election timeline">
          {STAGES.map((s, i) => (
            <li key={s.title} className="stage" style={{ '--i': i }}>
              <span className="stage-node" aria-hidden="true" />
              <h3 className="stage-title">{s.title}</h3>
              <p className="stage-text">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
