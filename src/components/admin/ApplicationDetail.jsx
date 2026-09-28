import { useEffect, useRef, useState } from 'react';
import { STATUSES, getPosition } from '../../config/positions.js';
import { DETAIL_GROUPS, labelFor } from './columns.js';
import { IconClose } from '../common/Icons.jsx';
import StatusBadge, { titleCase } from './StatusBadge.jsx';

const fmt = (iso) => {
  try { return new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
};

export default function ApplicationDetail({ application, loading, error, onClose, onSave }) {
  const [status, setStatus] = useState('SUBMITTED');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const closeRef = useRef(null);

  // Initialise the editor once per application (not after every save).
  const appId = application?.applicationId;
  useEffect(() => {
    if (application) {
      setStatus(application.status || 'SUBMITTED');
      setNotes(application.adminNotes || '');
      setSaved('');
    }
  }, [appId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); };
  }, [onClose]);

  const save = async () => {
    setSaving(true);
    setSaved('');
    try {
      await onSave({ status, adminNotes: notes });
      setSaved('Changes saved.');
    } catch (e) {
      setSaved(e.message || 'Changes could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const pos = application && getPosition(application.position);
  const dirty = application && (status !== (application.status || 'SUBMITTED') || notes !== (application.adminNotes || ''));

  return (
    <div className="drawer-wrap">
      <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer-head">
          <div>
            <p className="drawer-id">{application?.applicationId || 'Loading'}</p>
            <h2 id="drawer-title" className="drawer-title">{application?.fullName || 'Application'}</h2>
            {application && <p className="drawer-meta">{application.position}. Submitted {fmt(application.timestamp)}.</p>}
          </div>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose}>
            <IconClose /><span className="visually-hidden">Close application</span>
          </button>
        </header>

        <div className="drawer-body">
          {loading && <p className="muted">Loading application</p>}
          {error && <p className="notice notice--error" role="alert">{error}</p>}

          {application && (
            <>
              <section className="review-panel" aria-label="Review decision">
                <div className="review-panel-row">
                  <span>Current status</span>
                  <StatusBadge status={application.status} />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="adm-status">Change status</label>
                  <div className="select-wrap">
                    <select id="adm-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="adm-notes">Internal notes</label>
                  <textarea id="adm-notes" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <p className="field-hint">Visible to the electoral team only. Never shown to applicants.</p>
                </div>
                <div className="review-panel-actions">
                  <button type="button" className="btn btn--primary" onClick={save} disabled={saving || !dirty} aria-busy={saving}>
                    {saving ? 'Saving' : 'Save changes'}
                  </button>
                  <p className="save-msg" role="status">{saved}</p>
                </div>
              </section>

              {DETAIL_GROUPS.map((g) => (
                <section key={g.title} className="detail-group">
                  <h3 className="detail-group-title">{g.title}</h3>
                  <dl>
                    {g.keys.map((k, i) => {
                      const value = application[k];
                      if (g.positional && !value) return null;
                      const label = g.positional ? (pos?.questions[i] || labelFor(k)) : labelFor(k);
                      return (
                        <div key={k} className="detail-row">
                          <dt>{label}</dt>
                          <dd lang={k === 'frenchIntroduction' ? 'fr' : undefined}>
                            {typeof value === 'boolean' ? (value ? 'Confirmed' : 'Not confirmed') : (value || 'Not provided')}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </section>
              ))}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
