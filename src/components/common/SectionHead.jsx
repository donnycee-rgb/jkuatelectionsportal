import Reveal from './Reveal.jsx';

// A section heading: large Bodoni title with the blue/red double rule
// taken from the two figures in the logo.
export default function SectionHead({ id, title, lead, align = 'left' }) {
  return (
    <Reveal className={`section-head section-head--${align}`}>
      <span className="duo-rule" aria-hidden="true"><i /><i /></span>
      <h2 id={id} className="section-title">{title}</h2>
      {lead && <div className="section-lead">{lead}</div>}
    </Reveal>
  );
}
