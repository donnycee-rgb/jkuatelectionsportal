// Renders one form field from the schema with an accessible label,
// hint, live character count and error message.

import { LIMITS } from '../../config/formSchema.js';
import PositionPicker from './PositionPicker.jsx';
import { IconAlert } from '../common/Icons.jsx';

export default function Field({ field, value, error, onChange, onBlur }) {
  const id = `f-${field.key}`;
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy = [field.hint && hintId, error && errId].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name: field.key,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': describedBy,
    'aria-required': field.required ? 'true' : undefined,
  };

  const errorEl = error && (
    <p id={errId} className="field-error" role="alert">
      <IconAlert /> {error}
    </p>
  );

  if (field.type === 'position') {
    return (
      <fieldset className={`field ${error ? 'has-error' : ''}`} aria-describedby={describedBy}>
        <legend className="field-label">{field.label}{field.required && <Req />}</legend>
        <p className="field-hint" id={hintId}>One candidate may apply for one executive position.</p>
        <PositionPicker name={field.key} value={value} onChange={(v) => onChange(field.key, v)} invalid={!!error} />
        {errorEl}
      </fieldset>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className={`field ${error ? 'has-error' : ''}`} aria-describedby={describedBy}>
        <legend className="field-label">{field.label}{field.required && <Req />}</legend>
        <div className={`choice-group ${field.options.length <= 2 ? 'choice-group--pair' : ''}`}>
          {field.options.map((opt) => (
            <label key={opt} className={`choice ${value === opt ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name={field.key}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(field.key, opt)}
                aria-invalid={error ? 'true' : 'false'}
              />
              <span className="choice-mark" aria-hidden="true" />
              <span className="choice-text">{opt}</span>
            </label>
          ))}
        </div>
        {errorEl}
      </fieldset>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div className={`field ${error ? 'has-error' : ''}`}>
        <label className={`check ${value ? 'is-selected' : ''}`} htmlFor={id}>
          <input
            {...common}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(field.key, e.target.checked)}
          />
          <span className="check-box" aria-hidden="true" />
          <span className="check-text">{field.label}{field.required && <Req />}</span>
        </label>
        {errorEl}
      </div>
    );
  }

  const label = (
    <label className="field-label" htmlFor={id}>
      {field.label}{field.required && <Req />}
    </label>
  );

  if (field.type === 'select') {
    return (
      <div className={`field ${error ? 'has-error' : ''}`}>
        {label}
        <div className="select-wrap">
          <select {...common} value={value} onChange={(e) => onChange(field.key, e.target.value)} onBlur={() => onBlur(field)}>
            <option value="">Select</option>
            {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {errorEl}
      </div>
    );
  }

  if (field.type === 'textarea') {
    const count = (value || '').length;
    return (
      <div className={`field ${error ? 'has-error' : ''}`}>
        {label}
        <textarea
          {...common}
          rows={field.rows || 5}
          lang={field.lang}
          maxLength={LIMITS.long}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          onBlur={() => onBlur(field)}
        />
        <div className="field-meta">
          {errorEl || <span />}
          <span className={`counter ${count > LIMITS.long * 0.9 ? 'is-near' : ''}`} aria-live="polite">
            {count} / {LIMITS.long}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      {label}
      <input
        {...common}
        type={field.type}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        maxLength={LIMITS.short}
        value={value}
        onChange={(e) => onChange(field.key, field.transform === 'upper' ? e.target.value.toUpperCase() : e.target.value)}
        onBlur={() => onBlur(field)}
      />
      {errorEl}
    </div>
  );
}

function Req() {
  return (
    <span className="req-mark">
      <span aria-hidden="true"> *</span>
      <span className="visually-hidden"> (required)</span>
    </span>
  );
}
