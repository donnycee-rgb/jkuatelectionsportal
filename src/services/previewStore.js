// Local preview backend used ONLY when VITE_APPS_SCRIPT_URL is not set.
// It mimics the Apps Script responses so the whole flow can be tested
// before deployment. Data never leaves this browser. Admin key: "preview".

import { EMAIL_STATUSES } from '../config/positions.js';

const KEY = 'jfc-preview-applications';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};
const write = (rows) => {
  try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* storage unavailable */ }
};

const SUMMARY_FIELDS = ['applicationId', 'timestamp', 'fullName', 'registrationNumber', 'course', 'year', 'position', 'status'];
const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));

export async function handle(action, body) {
  await wait(700);
  const rows = read();

  if (action === 'submit') {
    const d = body.data;
    const reg = d.registrationNumber.toUpperCase();
    const email = d.email.toLowerCase();
    if (rows.some((r) => r.registrationNumber === reg || r.email === email)) {
      const e = new Error('An application with this registration number or email address has already been submitted. One candidate may submit one application.');
      e.code = 'DUPLICATE';
      throw e;
    }
    const applicationId = `JFC-2026-${String(rows.length + 1).padStart(4, '0')}`;
    const timestamp = new Date().toISOString();
    rows.push({ ...d, registrationNumber: reg, email, applicationId, timestamp, status: 'SUBMITTED', adminNotes: '', lastEmailedStatus: 'SUBMITTED', lastEmailedAt: timestamp });
    write(rows);
    // Preview mode never sends real email.
    return { ok: true, applicationId, timestamp, position: d.position, emailSent: false };
  }

  if (body.key !== 'preview') {
    const e = new Error('The access key is not correct.');
    e.code = 'UNAUTHORISED';
    throw e;
  }

  if (action === 'admin.list') {
    return { ok: true, mail: { enabled: true, remainingToday: null, preview: true }, applications: rows.map((r) => pick(r, SUMMARY_FIELDS)) };
  }
  if (action === 'admin.export') {
    return { ok: true, applications: rows };
  }
  if (action === 'admin.get') {
    const app = rows.find((r) => r.applicationId === body.id);
    if (!app) throw new Error('Application not found.');
    return { ok: true, application: app };
  }
  if (action === 'admin.update') {
    const i = rows.findIndex((r) => r.applicationId === body.id);
    if (i < 0) throw new Error('Application not found.');
    const changed = Boolean(body.status) && body.status !== rows[i].status;
    if (body.status) rows[i].status = body.status;
    if (typeof body.adminNotes === 'string') rows[i].adminNotes = body.adminNotes;
    // Mirror the server's email rules without sending anything.
    let email = { sent: false, skipped: 'NO_CHANGE' };
    if (changed || body.sendEmail === true) {
      const s = rows[i].status;
      if (body.notify === false) email = { sent: false, skipped: 'NOT_REQUESTED' };
      else if (!EMAIL_STATUSES.includes(s)) email = { sent: false, skipped: 'NOT_EMAILED_STATUS' };
      else if (rows[i].lastEmailedStatus === s) email = { sent: false, skipped: 'ALREADY_SENT' };
      else {
        rows[i].lastEmailedStatus = s;
        rows[i].lastEmailedAt = new Date().toISOString();
        email = { sent: true, preview: true };
      }
    }
    write(rows);
    return { ok: true, application: rows[i], email, mail: { enabled: true, remainingToday: null, preview: true } };
  }
  throw new Error('Unknown action.');
}
