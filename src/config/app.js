// Public, non-secret frontend configuration.
// The Apps Script URL is an endpoint, not a credential. Never put the
// Spreadsheet ID, admin key or any Google credential in this file.

export const APP_CONFIG = {
  clubName: 'JKUAT French Club',
  motto: "L'Équipe Gagnante",
  term: '2026/2027',
  apiUrl: (import.meta.env.VITE_APPS_SCRIPT_URL || '').trim(),
  adminRoute: (import.meta.env.VITE_ADMIN_ROUTE || 'electoral-desk').trim(),
  draftKey: 'jfc-application-draft-v1',
};

// When no Apps Script URL is configured, the app runs in local preview mode:
// submissions are kept in this browser only so the interface can be tested.
export const IS_PREVIEW_MODE = !APP_CONFIG.apiUrl;
