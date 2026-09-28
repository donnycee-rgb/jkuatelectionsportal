import { useState } from 'react';
import { IconLock } from '../common/Icons.jsx';
import { IS_PREVIEW_MODE } from '../../config/app.js';

export default function AdminLogin({ onSubmit, error, loading }) {
  const [key, setKey] = useState('');
  return (
    <div className="admin-login">
      <form
        className="login-card"
        onSubmit={(e) => { e.preventDefault(); if (key.trim()) onSubmit(key.trim()); }}
      >
        <span className="login-icon" aria-hidden="true"><IconLock /></span>
        <h1 className="login-title">Electoral desk</h1>
        <p className="login-text">
          Restricted to the club's electoral team. Enter the access key issued by the returning officer.
        </p>
        <div className="field">
          <label className="field-label" htmlFor="admin-key">Access key</label>
          <input
            id="admin-key"
            type="password"
            autoComplete="current-password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'admin-key-err' : undefined}
          />
          {error && <p id="admin-key-err" className="field-error" role="alert">{error}</p>}
        </div>
        <button className="btn btn--primary btn--block" type="submit" disabled={loading || !key.trim()} aria-busy={loading}>
          {loading ? <><span className="spinner" aria-hidden="true" /> Checking</> : 'Open dashboard'}
        </button>
        {IS_PREVIEW_MODE && <p className="login-hint">Preview mode: the access key is <code>preview</code>.</p>}
      </form>
    </div>
  );
}
