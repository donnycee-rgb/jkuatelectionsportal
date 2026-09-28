// Step progress: an animated bar plus a step list that lets candidates
// jump back to any step they have already completed.

export default function Progress({ steps, current, furthest, onJump }) {
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <div className="progress">
      <div className="progress-top">
        <p className="progress-count">
          Step <strong>{current + 1}</strong> of {steps.length}
        </p>
        <p className="progress-name">{steps[current].title}</p>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Application progress"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
        aria-valuetext={`Step ${current + 1} of ${steps.length}: ${steps[current].title}`}
      >
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="progress-steps">
        {steps.map((s, i) => {
          const state = i === current ? 'current' : i <= furthest ? 'done' : 'todo';
          return (
            <li key={s.id} className={`progress-step is-${state}`}>
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={i > furthest || i === current}
                aria-current={i === current ? 'step' : undefined}
              >
                <span className="progress-dot" aria-hidden="true">{i + 1}</span>
                <span className="progress-label">{s.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
