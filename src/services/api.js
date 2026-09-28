// Thin client for the Google Apps Script Web App.
//
// Requests are sent as "text/plain" so the browser treats them as simple
// requests and skips the CORS preflight that Apps Script cannot answer.
// The body is still JSON and is parsed server-side.

import { APP_CONFIG, IS_PREVIEW_MODE } from '../config/app.js';
import * as preview from './previewStore.js';

const TIMEOUT_MS = 30000;

async function call(action, body = {}) {
  if (IS_PREVIEW_MODE) return preview.handle(action, body);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(APP_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...body }),
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`The server responded with status ${res.status}.`);

    const json = await res.json();
    if (!json || json.ok !== true) {
      const err = new Error(json?.error || 'The request could not be completed.');
      err.code = json?.code;
      err.fields = json?.fields;
      throw err;
    }
    return json;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The connection timed out. Check your internet connection and try again.');
    }
    if (err instanceof TypeError) {
      throw new Error('Could not reach the application server. Check your internet connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const submitApplication = (data) => call('submit', { data });

export const adminList = (key) => call('admin.list', { key });
export const adminGet = (key, id) => call('admin.get', { key, id });
export const adminUpdate = (key, id, changes) => call('admin.update', { key, id, ...changes });
export const adminExport = (key) => call('admin.export', { key });
