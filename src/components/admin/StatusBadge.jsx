// Status is communicated with text and a shape marker, never colour alone.
const TONE = {
  SUBMITTED: 'neutral',
  'UNDER REVIEW': 'blue',
  SHORTLISTED: 'green',
  'NOT SHORTLISTED': 'muted',
  INTERVIEW: 'blue',
  ELECTED: 'green',
  'NOT ELECTED': 'muted',
};
const titleCase = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export default function StatusBadge({ status }) {
  const s = status || 'SUBMITTED';
  return <span className={`status status--${TONE[s] || 'neutral'}`}>{titleCase(s)}</span>;
}
export { titleCase };
