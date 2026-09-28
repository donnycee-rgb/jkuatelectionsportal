import SectionHead from '../common/SectionHead.jsx';
import Reveal from '../common/Reveal.jsx';

const STEPS = [
  { n: '01', title: 'Choose a position', text: 'Select ONE executive position you wish to contest.' },
  { n: '02', title: 'Complete your application', text: 'Provide your personal details, leadership experience and vision.' },
  { n: '03', title: 'Application review', text: "The submitted information will be reviewed according to the club's election process." },
  { n: '04', title: 'Next steps', text: 'Eligible candidates will be informed about subsequent stages.' },
];

export default function Process() {
  return (
    <section id="process" className="section section--white" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" title="Application process" />
        <Reveal as="ol" className="process">
          {STEPS.map((s, i) => (
            <li key={s.n} className="process-step" style={{ '--i': i }}>
              <span className="process-num" aria-hidden="true">{s.n}</span>
              <h3 className="process-title">{s.title}</h3>
              <p className="process-text">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
