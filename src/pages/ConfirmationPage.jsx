import { useEffect, useRef } from 'react';
import { useNavigate } from '../hooks/useRoute.js';
import { IconCheck } from '../components/common/Icons.jsx';

const fmt = (iso) => {
  try {
    return new Intl.DateTimeFormat('en-KE', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Nairobi' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export default function ConfirmationPage({ receipt }) {
  const navigate = useNavigate();
  const headingRef = useRef(null);

  useEffect(() => { headingRef.current?.focus(); }, []);

  if (!receipt) {
    return (
      <section className="confirm-page">
        <div className="container container--narrow confirm-card">
          <h1 className="confirm-title" tabIndex={-1} ref={headingRef}>No application to show</h1>
          <p className="confirm-text">
            This page shows your reference number straight after you submit. If you already submitted, keep the
            reference number you were given.
          </p>
          <a className="btn btn--primary" href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Return to home</a>
        </div>
      </section>
    );
  }

  return (
    <section className="confirm-page" aria-labelledby="confirm-title">
      <div className="container container--narrow">
        <div className="confirm-card">
          <div className="confirm-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle className="seal-ring seal-ring--blue" cx="60" cy="60" r="54" />
              <circle className="seal-ring seal-ring--red" cx="60" cy="60" r="46" />
            </svg>
            <span className="seal-check"><IconCheck /></span>
          </div>

          <h1 id="confirm-title" className="confirm-title" tabIndex={-1} ref={headingRef}>Application received</h1>
          <p className="confirm-text">Thank you for submitting your JKUAT French Club Executive Leadership Application.</p>
          <p className="confirm-text">Your application has been successfully recorded.</p>

          <dl className="receipt">
            <div className="receipt-row receipt-row--id">
              <dt>Application reference number</dt>
              <dd>{receipt.applicationId}</dd>
            </div>
            <div className="receipt-row">
              <dt>Date submitted</dt>
              <dd>{fmt(receipt.timestamp)}</dd>
            </div>
            <div className="receipt-row">
              <dt>Position applied for</dt>
              <dd>{receipt.position}</dd>
            </div>
          </dl>

          <p className="confirm-note">
            Keep your reference number for any communication about your application. Eligible candidates will be
            informed about subsequent stages.
          </p>

          <div className="confirm-actions">
            <a className="btn btn--primary btn--lg" href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              Return to home
            </a>
            <button type="button" className="btn btn--ghost btn--lg" onClick={() => window.print()}>
              Print this page
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
