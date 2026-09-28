import { useEffect, useMemo, useRef, useState } from 'react';
import { STEPS, INITIAL_VALUES, DECLARATION_TEXT } from '../../config/formSchema.js';
import { APP_CONFIG } from '../../config/app.js';
import { validateField, validateStep, positionFields, normalisePhone } from '../../services/validation.js';
import { submitApplication } from '../../services/api.js';
import Field from './Field.jsx';
import Progress from './Progress.jsx';
import Review from './Review.jsx';
import { IconArrowLeft, IconArrowRight, IconAlert } from '../common/Icons.jsx';

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(APP_CONFIG.draftKey);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return { values: { ...INITIAL_VALUES, ...d.values, declaration: false, website: '' }, step: d.step || 0, furthest: d.furthest || 0 };
  } catch {
    return null;
  }
};

export default function ApplicationForm({ initialPosition, onSubmitted }) {
  const draft = useMemo(loadDraft, []);
  const [values, setValues] = useState(() => {
    const v = draft?.values || INITIAL_VALUES;
    return initialPosition && !v.position ? { ...v, position: initialPosition } : v;
  });
  const [step, setStep] = useState(draft?.step || 0);
  const [furthest, setFurthest] = useState(draft?.furthest || 0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [restored] = useState(!!draft);
  const headingRef = useRef(null);
  const summaryRef = useRef(null);
  const firstRender = useRef(true);

  // Resolve the fields of the current step (position-specific fields are dynamic).
  const stepFields = (i) => (STEPS[i].dynamic ? positionFields(values.position) : STEPS[i].fields);
  const fields = stepFields(step);
  const current = STEPS[step];

  // Autosave the draft on this device (declaration is never saved).
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const { declaration, website, ...rest } = values; // eslint-disable-line no-unused-vars
        localStorage.setItem(APP_CONFIG.draftKey, JSON.stringify({ values: rest, step, furthest }));
      } catch { /* storage may be unavailable in private browsing */ }
    }, 400);
    return () => clearTimeout(t);
  }, [values, step, furthest]);

  // Move focus to the step heading whenever the step changes.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
    const top = headingRef.current?.closest('.apply-shell')?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 90, behavior: 'auto' });
  }, [step]);

  const setValue = (key, value) => {
    setValues((v) => {
      const next = { ...v, [key]: value };
      // Changing position clears answers to the previous position's questions.
      if (key === 'position' && v.position && v.position !== value) {
        next.positionAnswer1 = ''; next.positionAnswer2 = ''; next.positionAnswer3 = '';
      }
      return next;
    });
    if (errors[key]) {
      const f = fields.find((x) => x.key === key);
      const msg = f ? validateField(f, value) : '';
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  };

  const onBlur = (field) => {
    if (!values[field.key]) return; // do not shout at empty fields on blur
    setErrors((e) => ({ ...e, [field.key]: validateField(field, values[field.key]) }));
  };

  const checkCurrent = () => {
    const errs = validateStep(fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    return true;
  };

  const next = () => {
    if (!checkCurrent()) return;
    const n = Math.min(step + 1, STEPS.length - 1);
    setStep(n);
    setFurthest((f) => Math.max(f, n));
    setErrors({});
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const jump = (i) => {
    if (i > furthest) return;
    setErrors({});
    setStep(i);
  };

  const clearDraft = () => {
    try { localStorage.removeItem(APP_CONFIG.draftKey); } catch { /* ignore */ }
    setValues(INITIAL_VALUES);
    setStep(0);
    setFurthest(0);
    setErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!checkCurrent()) return;

    // Re-validate every step before sending, in case a draft was edited elsewhere.
    for (let i = 0; i < STEPS.length; i++) {
      const errs = validateStep(stepFields(i), values);
      if (Object.keys(errs).length) {
        setStep(i);
        setErrors(errs);
        setServerError(`Some answers in "${STEPS[i].title}" need attention before you can submit.`);
        return;
      }
    }

    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );
    payload.phone = normalisePhone(payload.phone);
    payload.registrationNumber = payload.registrationNumber.toUpperCase().replace(/\s/g, '');
    payload.email = payload.email.toLowerCase();

    setSubmitting(true);
    try {
      const res = await submitApplication(payload);
      try { localStorage.removeItem(APP_CONFIG.draftKey); } catch { /* ignore */ }
      onSubmitted({ applicationId: res.applicationId, timestamp: res.timestamp, position: res.position || payload.position, name: payload.fullName });
    } catch (err) {
      setServerError(err.message || 'Your application could not be submitted. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const errorList = Object.entries(errors).filter(([, m]) => m);
  const isLast = step === STEPS.length - 1;

  return (
    <div className="apply-shell">
      <Progress steps={STEPS} current={step} furthest={furthest} onJump={jump} />

      {restored && step === (draft?.step || 0) && furthest > 0 && (
        <div className="notice notice--info" role="status">
          <p>Your saved progress on this device has been restored.</p>
          <button type="button" className="link-btn" onClick={clearDraft}>Start over</button>
        </div>
      )}

      <form className="form-card" onSubmit={isLast ? submit : (e) => { e.preventDefault(); next(); }} noValidate>
        {/* Honeypot field for bots. Hidden from people and assistive technology. */}
        <div className="hp" aria-hidden="true">
          <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))} /></label>
        </div>

        <div key={current.id} className="step-panel">
          <header className="step-head">
            {current.accent && <p className="step-accent" lang="fr" aria-hidden="true">{current.accent}</p>}
            <h2 className="step-title" tabIndex={-1} ref={headingRef}>{current.title}</h2>
            {current.intro && <p className="step-intro">{current.intro}</p>}
          </header>

          {errorList.length > 0 && (
            <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
              <p className="error-summary-title">
                <IconAlert /> {errorList.length === 1 ? '1 answer needs' : `${errorList.length} answers need`} attention
              </p>
              <ul>
                {errorList.map(([key, msg]) => (
                  <li key={key}>
                    <a href={`#f-${key}`} onClick={(e) => { e.preventDefault(); focusField(key); }}>{msg}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {current.dynamic && (
            <p className="position-context">
              Applying for <strong>{values.position || 'no position selected'}</strong>
              {!values.position && (
                <>. <button type="button" className="link-btn" onClick={() => jump(2)}>Choose a position</button></>
              )}
            </p>
          )}

          {current.id === 'declaration' && (
            <>
              <Review values={values} onEdit={jump} />
              <blockquote className="declaration">{DECLARATION_TEXT}</blockquote>
            </>
          )}

          <div className="fields">
            {fields.map((f) => (
              <Field key={f.key} field={f} value={values[f.key]} error={errors[f.key]} onChange={setValue} onBlur={onBlur} />
            ))}
          </div>

          {serverError && (
            <div className="notice notice--error" role="alert">
              <IconAlert />
              <p>{serverError}</p>
            </div>
          )}
        </div>

        <div className="form-nav">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={back} disabled={submitting}>
              <IconArrowLeft /> Back
            </button>
          ) : <span />}

          {isLast ? (
            <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} aria-busy={submitting}>
              {submitting ? <><span className="spinner" aria-hidden="true" /> Submitting application</> : 'Submit application'}
            </button>
          ) : (
            <button type="submit" className="btn btn--primary">
              Continue <IconArrowRight />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function focusField(key) {
  const el = document.getElementById(`f-${key}`) || document.querySelector(`[name="${key}"]`);
  if (!el) return;
  el.scrollIntoView({ block: 'center' });
  el.focus({ preventScroll: true });
}
