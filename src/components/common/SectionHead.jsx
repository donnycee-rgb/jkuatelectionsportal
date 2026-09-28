import Reveal from './Reveal.jsx';

// Section heading: a small numbered eyebrow in DM Sans above a Cormorant
// Garamond title, led in by the blue/red double rule taken from the two
// figures in the logo.
export default function SectionHead({ id, index, eyebrow, title, lead, align = 'left', className = '' }) {
  return (
    <Reveal className={`section-head section-head--${align} ${className}`}>
      {eyebrow && (
        <p className="section-eyebrow">
          {index && <span className="section-index" aria-hidden="true">{index}</span>}
          <span className="duo-rule" aria-hidden="true"><i /><i /></span>
          <span className="eyebrow">{eyebrow}</span>
        </p>
      )}
      <h2 id={id} className="section-title">{title}</h2>
      {lead && <div className="section-lead">{lead}</div>}
    </Reveal>
  );
}
