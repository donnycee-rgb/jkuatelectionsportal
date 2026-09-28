// Compact horizontal bar breakdown used for year of study and status counts.
export default function BarList({ title, data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <section className="barlist" aria-label={title}>
      <h2 className="panel-title">{title}</h2>
      <ul>
        {data.map((d) => (
          <li key={d.label}>
            <span className="barlist-label">{d.label}</span>
            <span className="barlist-track" aria-hidden="true">
              <span className="barlist-fill" style={{ width: `${(d.value / max) * 100}%` }} />
            </span>
            <span className="barlist-value">{d.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
