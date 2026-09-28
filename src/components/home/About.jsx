import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';

const STAGES = [
  { title: 'Application', text: 'Candidate submits application' },
  { title: 'Review', text: 'Applications are reviewed for eligibility and completeness' },
  { title: 'Shortlisting', text: "Eligible candidates proceed according to the club's election process" },
  { title: 'Election', text: 'Members participate in the official leadership selection process' },
];

export default function About() {
  return (
    <section id="about" className="section section--white" aria-labelledby="about-title">
      <div className="container about-grid">
        <div>
          <SectionHead id="about-title" title="The next leadership team" />
          <Reveal className="prose">
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

        <Reveal as="ol" className="timeline" aria-label="Election timeline">
          {STAGES.map((s, i) => (
            <li key={s.title} className="timeline-item" style={{ '--i': i }}>
              <span className="timeline-node" aria-hidden="true" />
              <h3 className="timeline-title">{s.title}</h3>
              <p className="timeline-text">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
