// Radio-based position selector: exactly one position can be chosen.
import { POSITIONS } from '../../config/positions.js';

export default function PositionPicker({ name, value, onChange, invalid }) {
  return (
    <div className="pos-picker">
      {POSITIONS.map((p) => {
        const selected = value === p.title;
        return (
          <label key={p.id} className={`pos-option ${selected ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name={name}
              value={p.title}
              checked={selected}
              onChange={() => onChange(p.title)}
              aria-invalid={invalid ? 'true' : 'false'}
              aria-describedby={`pos-desc-${p.id}`}
            />
            <span className="pos-option-mark" aria-hidden="true" />
            <span className="pos-option-body">
              <span className="pos-option-title">{p.title}</span>
              <span className="pos-option-desc" id={`pos-desc-${p.id}`}>{p.description}</span>
            </span>
            <span className="pos-option-seat">{selected ? 'Selected' : '1 seat'}</span>
          </label>
        );
      })}
    </div>
  );
}
