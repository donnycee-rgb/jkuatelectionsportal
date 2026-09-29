import { useEffect, useRef, useState } from 'react';
import { STATUSES, EMAIL_STATUSES, getPosition } from '../../config/positions.js';
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
  const [notify, setNotify] = useState(true);
  const closeRef = useRef(null);

  // Initialise the editor once per application (not after every save).
  const appId = application?.applicationId;
  useEffect(() => {
    if (application) {
      setStatus(application.status || 'SUBMITTED');
      setNotes(application.adminNotes || '');
      setSaved('');
      setNotify(true);
    }
  }, [appId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); };
  }, [onClose]);

  const describe = (email) => {
    if (!email) return '';
    if (email.sent) return email.preview ? 'Applicant would be emailed (preview mode: nothing sent).' : 'Applicant emailed.';
    if (email.error) return email.error;
    if (email.skipped === 'ALREADY_SENT') return 'The applicant was already emailed about this status.';
    if (email.skipped === 'DISABLED') return 'Applicant emails are turned off.';
    return '';
  };

  const run = async (changes, okText) => {
    setSaving(true);
    setSaved('');
    try {
      const res = await onSave(changes);
      setSaved([okText, describe(res?.email)].filter(Boolean).join(' '));
    } catch (e) {
      setSaved(e.message || 'Changes could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const save = () => run({ status, adminNotes: notes, notify }, 'Changes saved.');
  const sendNow = () => run({ sendEmail: true }, '');

  const pos = application && getPosition(application.position);
  const current = application?.status || 'SUBMITTED';
  const dirty = application && (status !== current || notes !== (application.adminNotes || ''));
  const statusChanging = application && status !== current;
  const willEmail = statusChanging && EMAIL_STATUSES.includes(status) && application.lastEmailedStatus !== status;
  // The current status could have been emailed but was not (e.g. the daily limit was reached).
  const owed = application && !statusChanging && EMAIL_STATUSES.includes(current) && application.lastEmailedStatus !== current;

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
                <div className="review-panel-row">
                  <span>Applicant last emailed</span>
                  <span className="mail-last">
                    {application.lastEmailedStatus
                      ? `${titleCase(application.lastEmailedStatus)}${application.lastEmailedAt ? `, ${fmt(application.lastEmailedAt)}` : ''}`
                      : 'Not yet'}
                  </span>
                </div>
                {statusChanging && (
                  willEmail ? (
                    <label className={`check check--compact ${notify ? 'is-selected' : ''}`}>
                      <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
                      <span className="check-box" aria-hidden="true" />
                      <span className="check-text">Email the applicant about this change</span>
                    </label>
                  ) : (
                    <p className="field-hint">
                      {EMAIL_STATUSES.includes(status)
                        ? 'The applicant was already emailed about this status, so no email will be sent.'
                        : `No email is sent for ${titleCase(status)}.`}
                    </p>
                  )
                )}
                <div className="field">
                  <label className="field-label" htmlFor="adm-notes">Internal notes</label>
                  <textarea id="adm-notes" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <p className="field-hint">Visible to the electoral team only. Never shown to applicants.</p>
                </div>
                <div className="review-panel-actions">
                  <button type="button" className="btn btn--primary" onClick={save} disabled={saving || !dirty} aria-busy={saving}>
                    {saving ? 'Saving' : 'Save changes'}
                  </button>
                  {owed && !dirty && (
                    <button type="button" className="btn btn--ghost" onClick={sendNow} disabled={saving}>
                      Send email now
                    </button>
                  )}
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
