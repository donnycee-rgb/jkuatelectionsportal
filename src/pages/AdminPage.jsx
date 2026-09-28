import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import ApplicationDetail from '../components/admin/ApplicationDetail.jsx';
import BarList from '../components/admin/BarList.jsx';
import StatusBadge, { titleCase } from '../components/admin/StatusBadge.jsx';
import { SHEET_COLUMNS } from '../components/admin/columns.js';
import { POSITIONS, STATUSES } from '../config/positions.js';
import { YEARS } from '../config/formSchema.js';
import { adminList, adminGet, adminUpdate, adminExport } from '../services/api.js';
import { toCsv, downloadCsv } from '../services/csv.js';
import { IconSearch, IconDownload, IconRefresh } from '../components/common/Icons.jsx';

const KEY_STORE = 'jfc-admin-key';

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return iso; }
};

export default function AdminPage() {
  // The access key lives in sessionStorage only: it disappears when the tab closes.
  const [key, setKey] = useState(() => { try { return sessionStorage.getItem(KEY_STORE) || ''; } catch { return ''; } });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState({ app: null, loading: false, error: '' });
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async (k) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminList(k);
      setRows(res.applications || []);
      setKey(k);
      try { sessionStorage.setItem(KEY_STORE, k); } catch { /* ignore */ }
    } catch (e) {
      if (e.code === 'UNAUTHORISED') {
        try { sessionStorage.removeItem(KEY_STORE); } catch { /* ignore */ }
        setKey('');
      }
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (key) load(key); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeDetail = useCallback(() => setOpenId(null), []);

  const signOut = () => {
    try { sessionStorage.removeItem(KEY_STORE); } catch { /* ignore */ }
    setKey(''); setRows([]); setOpenId(null);
  };

  const open = async (id) => {
    setOpenId(id);
    setDetail({ app: null, loading: true, error: '' });
    try {
      const res = await adminGet(key, id);
      setDetail({ app: res.application, loading: false, error: '' });
    } catch (e) {
      setDetail({ app: null, loading: false, error: e.message });
    }
  };

  const save = async (changes) => {
    const res = await adminUpdate(key, openId, changes);
    setDetail((d) => ({ ...d, app: { ...d.app, ...res.application } }));
    setRows((rs) => rs.map((r) => (r.applicationId === openId ? { ...r, status: res.application.status } : r)));
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await adminExport(key);
      const csv = toCsv(res.applications || [], SHEET_COLUMNS);
      downloadCsv(`jfc-applications-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    } catch (e) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      (!position || r.position === position) &&
      (!status || (r.status || 'SUBMITTED') === status) &&
      (!q || r.fullName?.toLowerCase().includes(q) || r.registrationNumber?.toLowerCase().includes(q) || r.applicationId?.toLowerCase().includes(q))
    );
  }, [rows, query, position, status]);

  const byPosition = useMemo(() => Object.fromEntries(POSITIONS.map((p) => [p.title, rows.filter((r) => r.position === p.title).length])), [rows]);
  const byYear = useMemo(() => YEARS.map((y) => ({ label: y, value: rows.filter((r) => r.year === y).length })).filter((d, i) => d.value || i < 4), [rows]);
  const byStatus = useMemo(() => STATUSES.map((s) => ({ label: titleCase(s), value: rows.filter((r) => (r.status || 'SUBMITTED') === s).length })), [rows]);

  if (!key || (!rows.length && error && !loading)) {
    return <AdminLogin onSubmit={load} error={error} loading={loading} />;
  }

  return (
    <div className="admin">
      <div className="container container--wide">
        <header className="admin-head">
          <div>
            <h1 className="admin-title">Applications</h1>
            <p className="admin-sub">Executive leadership 2026/2027. Personal contact details are shown only inside each application.</p>
          </div>
          <div className="admin-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => load(key)} disabled={loading} aria-busy={loading}>
              <IconRefresh /> {loading ? 'Refreshing' : 'Refresh'}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={exportCsv} disabled={exporting || !rows.length}>
              <IconDownload /> {exporting ? 'Preparing CSV' : 'Export CSV'}
            </button>
            <button type="button" className="btn btn--text btn--sm" onClick={signOut}>Sign out</button>
          </div>
        </header>

        {error && <p className="notice notice--error" role="alert">{error}</p>}

        <section className="stat-grid" aria-label="Applications by position">
          <div className="stat stat--total">
            <span className="stat-label">Total applications</span>
            <span className="stat-value">{rows.length}</span>
          </div>
          {POSITIONS.map((p) => (
            <button
              type="button"
              key={p.id}
              className={`stat ${position === p.title ? 'is-active' : ''}`}
              onClick={() => setPosition((cur) => (cur === p.title ? '' : p.title))}
              aria-pressed={position === p.title}
            >
              <span className="stat-label">{p.title}</span>
              <span className="stat-value">{byPosition[p.title]}</span>
            </button>
          ))}
        </section>

        <div className="admin-panels">
          <BarList title="By year of study" data={byYear} />
          <BarList title="By status" data={byStatus} />
        </div>

        <section className="table-panel" aria-labelledby="table-title">
          <div className="filters">
            <h2 id="table-title" className="panel-title">
              {filtered.length} of {rows.length} applications
            </h2>
            <div className="filter-row">
              <div className="search">
                <IconSearch />
                <label className="visually-hidden" htmlFor="adm-search">Search by name, registration number or reference</label>
                <input id="adm-search" type="search" placeholder="Search name, reg. number or reference" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="select-wrap">
                <label className="visually-hidden" htmlFor="adm-pos">Filter by position</label>
                <select id="adm-pos" value={position} onChange={(e) => setPosition(e.target.value)}>
                  <option value="">All positions</option>
                  {POSITIONS.map((p) => <option key={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="select-wrap">
                <label className="visually-hidden" htmlFor="adm-status-f">Filter by status</label>
                <select id="adm-status-f" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty">
              {rows.length ? 'No applications match these filters. Clear the search or choose a different position or status.' : 'No applications have been submitted yet. New submissions appear here after a refresh.'}
            </p>
          ) : (
            <div className="table-scroll">
              <table className="app-table">
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Name</th>
                    <th scope="col">Reg. number</th>
                    <th scope="col">Position</th>
                    <th scope="col">Year</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.applicationId}>
                      <td className="cell-ref">{r.applicationId}</td>
                      <td>{r.fullName}</td>
                      <td>{r.registrationNumber}</td>
                      <td>{r.position}</td>
                      <td>{r.year}</td>
                      <td>{fmtDate(r.timestamp)}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <button type="button" className="link-btn" onClick={() => open(r.applicationId)}>
                          View<span className="visually-hidden"> application from {r.fullName}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {openId && (
        <ApplicationDetail
          application={detail.app}
          loading={detail.loading}
          error={detail.error}
          onClose={closeDetail}
          onSave={save}
        />
      )}
    </div>
  );
}
