// Hairline rays that continue the logo's black sunburst outward, drawn in
// once on load. Two rays carry the logo's red and blue. Purely decorative.

const RAYS = (() => {
  const rays = [];
  const count = 23;
  for (let i = 0; i < count; i++) {
    // Fan across the upper half, matching the logo's burst (about 190 to 350 degrees).
    const t = i / (count - 1);
    const deg = 188 + t * 164;
    const long = i % 3 === 0;
    rays.push({
      deg,
      inner: long ? 250 : 275,
      outer: long ? 470 : 380 + ((i * 37) % 60),
      width: long ? 1.4 : 0.9,
      tone: i === 6 ? 'red' : i === 16 ? 'blue' : 'ink',
      delay: 380 + Math.abs(i - (count - 1) / 2) * 45,
    });
  }
  return rays;
})();

export default function SunburstRays() {
  return (
    <svg className="rays" viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      {RAYS.map((r, i) => {
        const a = (r.deg * Math.PI) / 180;
        const x1 = Math.cos(a) * r.inner;
        const y1 = Math.sin(a) * r.inner;
        const x2 = Math.cos(a) * r.outer;
        const y2 = Math.sin(a) * r.outer;
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={i}
            className={`ray ray--${r.tone}`}
            x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)}
            strokeWidth={r.width}
            style={{ '--len': len.toFixed(1), '--d': `${r.delay}ms` }}
          />
        );
      })}
      <circle className="rays-orbit" cx="0" cy="0" r="490" />
    </svg>
  );
}
