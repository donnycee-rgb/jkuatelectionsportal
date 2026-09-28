/**
 * JKUAT French Club - Executive Leadership Application backend
 * Google Apps Script Web App  ->  Google Sheets
 *
 * PRIVATE CONFIGURATION (never in the frontend)
 * ---------------------------------------------
 * Set these in Apps Script: Project Settings > Script Properties
 *   SPREADSHEET_ID   ID of the Google Sheet (from its URL)
 *   SHEET_NAME       Tab name, e.g. "Applications"
 *   ADMIN_KEY        Long random passphrase for the electoral desk (20+ characters)
 *   ID_YEAR          Optional. Year used in reference numbers. Defaults to 2026.
 *
 * Run setup() once from the editor after setting the properties.
 */

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------

var PROPS = PropertiesService.getScriptProperties();

function cfg_(name, fallback) {
  var v = PROPS.getProperty(name);
  return v === null || v === '' ? fallback : v;
}

var POSITIONS = [
  'President',
  'Secretary',
  'Deputy Chairperson',
  'Organising Secretary',
  'Treasurer',
  'Social Media Manager'
];

var QUESTION_COUNT = {
  'President': 3,
  'Secretary': 2,
  'Deputy Chairperson': 2,
  'Organising Secretary': 2,
  'Treasurer': 2,
  'Social Media Manager': 2
};

var STATUSES = ['SUBMITTED', 'UNDER REVIEW', 'SHORTLISTED', 'NOT SHORTLISTED', 'INTERVIEW', 'ELECTED', 'NOT ELECTED'];
var YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
var MEMBERSHIP = ['Yes', 'No'];
var DURATIONS = ['Less than 6 months', '6 months\u20131 year', '1\u20132 years', 'More than 2 years', 'New member'];
var PROFICIENCY = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Fluent'];
var YES_NO = ['Yes', 'No'];

var SHORT_MAX = 120;
var LONG_MAX = 2000;

// Column order of the sheet. [header, payloadKey]
var COLUMNS = [
  ['Timestamp', 'timestamp'],
  ['Application ID', 'applicationId'],
  ['Full Name', 'fullName'],
  ['Registration Number', 'registrationNumber'],
  ['Course', 'course'],
  ['Year', 'year'],
  ['Phone', 'phone'],
  ['Email', 'email'],
  ['Club Membership', 'membership'],
  ['Membership Duration', 'membershipDuration'],
  ['Position Applied For', 'position'],
  ['Leadership Motivation', 'leadershipMotivation'],
  ['Position Motivation', 'positionMotivation'],
  ['Leadership Definition', 'leadershipDefinition'],
  ['Leadership Experience', 'leadershipExperience'],
  ['Leadership Qualities', 'leadershipQualities'],
  ['Conflict Resolution', 'conflictResolution'],
  ['Academic/Club Balance', 'academicBalance'],
  ['Club Vision', 'clubVision'],
  ['Three Proposed Activities', 'proposedActivities'],
  ['Member Engagement Strategy', 'engagementStrategy'],
  ['French/Francophone Importance', 'francophoneImportance'],
  ['Position-Specific Answer 1', 'positionAnswer1'],
  ['Position-Specific Answer 2', 'positionAnswer2'],
  ['Position-Specific Answer 3', 'positionAnswer3'],
  ['French Proficiency', 'frenchProficiency'],
  ['French Introduction', 'frenchIntroduction'],
  ['Francophone Culture Interest', 'cultureInterest'],
  ['Meeting Commitment', 'meetingCommitment'],
  ['Activity Commitment', 'activityCommitment'],
  ['Leadership Commitment', 'leadershipCommitment'],
  ['Declaration', 'declaration'],
  ['Application Status', 'status'],
  ['Admin Notes', 'adminNotes']
];

var SUMMARY_KEYS = ['applicationId', 'timestamp', 'fullName', 'registrationNumber', 'course', 'year', 'position', 'status'];

// Field rules: [key, kind, required, options]
// kind: 'short' | 'long' | 'choice'
var FIELD_RULES = [
  ['fullName', 'short', true],
  ['registrationNumber', 'short', true],
  ['course', 'short', true],
  ['year', 'choice', true, YEARS],
  ['phone', 'short', true],
  ['email', 'short', true],
  ['membership', 'choice', true, MEMBERSHIP],
  ['membershipDuration', 'choice', true, DURATIONS],
  ['position', 'choice', true, POSITIONS],
  ['leadershipMotivation', 'long', true],
  ['positionMotivation', 'long', true],
  ['leadershipDefinition', 'long', true],
  ['leadershipExperience', 'long', true],
  ['leadershipQualities', 'long', true],
  ['conflictResolution', 'long', true],
  ['academicBalance', 'long', true],
  ['clubVision', 'long', true],
  ['proposedActivities', 'long', true],
  ['engagementStrategy', 'long', true],
  ['francophoneImportance', 'long', true],
  ['positionAnswer1', 'long', false],
  ['positionAnswer2', 'long', false],
  ['positionAnswer3', 'long', false],
  ['frenchProficiency', 'choice', true, PROFICIENCY],
  ['frenchIntroduction', 'long', true],
  ['cultureInterest', 'long', true],
  ['meetingCommitment', 'choice', true, YES_NO],
  ['activityCommitment', 'choice', true, YES_NO],
  ['leadershipCommitment', 'long', true]
];

var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var RE_PHONE = /^(?:\+?254|0)(?:7|1)\d{8}$/;
var RE_REGNO = /^(?=.*\d)[A-Z0-9][A-Z0-9\-\/]{4,29}$/;

// ------------------------------------------------------------------
// HTTP entry points
// ------------------------------------------------------------------

function doGet() {
  return json_({ ok: true, service: 'JKUAT French Club applications', time: new Date().toISOString() });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return fail_('Empty request.', 'BAD_REQUEST');
    if (e.postData.contents.length > 100000) return fail_('Request is too large.', 'BAD_REQUEST');

    var body;
    try { body = JSON.parse(e.postData.contents); }
    catch (err) { return fail_('Request body must be valid JSON.', 'BAD_REQUEST'); }

    switch (body.action) {
      case 'submit':       return handleSubmit_(body.data || {});
      case 'admin.list':   return withAdmin_(body, adminList_);
      case 'admin.get':    return withAdmin_(body, adminGet_);
      case 'admin.update': return withAdmin_(body, adminUpdate_);
      case 'admin.export': return withAdmin_(body, adminExport_);
      default:             return fail_('Unknown action.', 'BAD_REQUEST');
    }
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return fail_('The server could not process the request. Try again in a few minutes.', 'SERVER_ERROR');
  }
}

// ------------------------------------------------------------------
// Submission
// ------------------------------------------------------------------

function handleSubmit_(raw) {
  // Honeypot: real users never fill this hidden field.
  if (raw.website) return fail_('Submission rejected.', 'REJECTED');

  var data = {};
  var fields = {};

  FIELD_RULES.forEach(function (rule) {
    var key = rule[0], kind = rule[1], required = rule[2], options = rule[3];
    var value = clean_(raw[key], kind === 'long');
    var max = kind === 'long' ? LONG_MAX : SHORT_MAX;

    if (required && !value) { fields[key] = 'Required.'; }
    else if (value.length > max) { fields[key] = 'Too long (max ' + max + ' characters).'; }
    else if (options && value && options.indexOf(value) === -1) { fields[key] = 'Invalid option.'; }
    else if (kind === 'long' && required && value.length < 10) { fields[key] = 'Answer is too short.'; }
    data[key] = value;
  });

  data.registrationNumber = data.registrationNumber.toUpperCase().replace(/\s/g, '');
  data.email = data.email.toLowerCase();
  data.phone = data.phone.replace(/[\s\-()]/g, '');

  if (data.email && !RE_EMAIL.test(data.email)) fields.email = 'Invalid email address.';
  if (data.phone && !RE_PHONE.test(data.phone)) fields.phone = 'Invalid phone number.';
  if (data.registrationNumber && !RE_REGNO.test(data.registrationNumber)) fields.registrationNumber = 'Invalid registration number.';

  // Position-specific answers: exactly the number of questions for the chosen position.
  var n = QUESTION_COUNT[data.position] || 0;
  for (var i = 1; i <= 3; i++) {
    var k = 'positionAnswer' + i;
    if (i <= n) {
      if (!data[k] || data[k].length < 10) fields[k] = 'Position-specific answer ' + i + ' is required.';
    } else {
      data[k] = ''; // ignore answers for questions that do not exist for this position
    }
  }

  if (raw.declaration !== true) fields.declaration = 'The declaration must be confirmed.';

  if (Object.keys(fields).length) {
    return fail_('Some answers are missing or invalid. Review the highlighted fields and submit again.', 'VALIDATION', fields);
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return fail_('The server is busy. Wait a moment and submit again.', 'BUSY');
  }

  try {
    var sheet = getSheet_();

    // Duplicate check on registration number and email.
    if (isDuplicate_(sheet, data.registrationNumber, data.email)) {
      return fail_('An application with this registration number or email address has already been submitted. One candidate may submit one application.', 'DUPLICATE');
    }

    var now = new Date();
    data.applicationId = nextId_();
    data.timestamp = now;
    data.declaration = 'Confirmed';
    data.status = 'SUBMITTED';
    data.adminNotes = '';

    var row = COLUMNS.map(function (c) {
      var v = data[c[1]];
      return c[1] === 'timestamp' ? v : guard_(v);
    });
    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return json_({
      ok: true,
      applicationId: data.applicationId,
      timestamp: now.toISOString(),
      position: data.position
    });
  } finally {
    lock.releaseLock();
  }
}

function nextId_() {
  // Called inside the script lock, so the counter cannot be read twice.
  var year = cfg_('ID_YEAR', '2026');
  var seq = parseInt(PROPS.getProperty('ID_SEQ') || '0', 10) + 1;
  PROPS.setProperty('ID_SEQ', String(seq));
  return 'JFC-' + year + '-' + ('0000' + seq).slice(-Math.max(4, String(seq).length));
}

function isDuplicate_(sheet, regNo, email) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var regCol = colIndex_('registrationNumber');
  var emailCol = colIndex_('email');
  var regs = sheet.getRange(2, regCol, last - 1, 1).getValues();
  var emails = sheet.getRange(2, emailCol, last - 1, 1).getValues();
  for (var i = 0; i < regs.length; i++) {
    if (String(regs[i][0]).toUpperCase() === regNo) return true;
    if (String(emails[i][0]).toLowerCase() === email) return true;
  }
  return false;
}

// ------------------------------------------------------------------
// Admin
// ------------------------------------------------------------------

function withAdmin_(body, handler) {
  var cache = CacheService.getScriptCache();
  var failures = parseInt(cache.get('admin_failures') || '0', 10);
  if (failures >= 10) {
    return fail_('Too many incorrect attempts. Try again in 15 minutes.', 'LOCKED');
  }

  var expected = cfg_('ADMIN_KEY', '');
  if (!expected || expected.length < 12) {
    return fail_('The admin key has not been configured on the server.', 'NOT_CONFIGURED');
  }
  if (!safeEqual_(String(body.key || ''), expected)) {
    cache.put('admin_failures', String(failures + 1), 900);
    Utilities.sleep(800);
    return fail_('The access key is not correct.', 'UNAUTHORISED');
  }
  return handler(body);
}

function adminList_() {
  var rows = readAll_();
  return json_({
    ok: true,
    applications: rows.map(function (r) {
      var o = {};
      SUMMARY_KEYS.forEach(function (k) { o[k] = r[k]; });
      return o;
    })
  });
}

function adminGet_(body) {
  var found = findRow_(String(body.id || ''));
  if (!found) return fail_('Application not found.', 'NOT_FOUND');
  return json_({ ok: true, application: found.record });
}

function adminUpdate_(body) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return fail_('The server is busy. Try again.', 'BUSY');
  try {
    var found = findRow_(String(body.id || ''));
    if (!found) return fail_('Application not found.', 'NOT_FOUND');
    var sheet = getSheet_();

    if (body.status !== undefined) {
      var status = String(body.status).toUpperCase();
      if (STATUSES.indexOf(status) === -1) return fail_('Invalid status.', 'VALIDATION');
      sheet.getRange(found.rowNumber, colIndex_('status')).setValue(status);
      found.record.status = status;
    }
    if (body.adminNotes !== undefined) {
      var notes = clean_(body.adminNotes, true).slice(0, LONG_MAX);
      sheet.getRange(found.rowNumber, colIndex_('adminNotes')).setValue(guard_(notes));
      found.record.adminNotes = notes;
    }
    return json_({ ok: true, application: found.record });
  } finally {
    lock.releaseLock();
  }
}

function adminExport_() {
  return json_({ ok: true, applications: readAll_() });
}

// ------------------------------------------------------------------
// Sheet helpers
// ------------------------------------------------------------------

function getSheet_() {
  var id = cfg_('SPREADSHEET_ID', '');
  if (!id) throw new Error('SPREADSHEET_ID script property is not set.');
  var ss = SpreadsheetApp.openById(id);
  var name = cfg_('SHEET_NAME', 'Applications');
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    writeHeaders_(sheet);
  }
  return sheet;
}

function colIndex_(key) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i][1] === key) return i + 1;
  throw new Error('Unknown column ' + key);
}

function readAll_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, COLUMNS.length).getValues();
  return values
    .filter(function (row) { return row[1]; })
    .map(toRecord_);
}

function findRow_(id) {
  if (!id) return null;
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return null;
  var ids = sheet.getRange(2, colIndex_('applicationId'), last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      var rowNumber = i + 2;
      var row = sheet.getRange(rowNumber, 1, 1, COLUMNS.length).getValues()[0];
      return { rowNumber: rowNumber, record: toRecord_(row) };
    }
  }
  return null;
}

function toRecord_(row) {
  var o = {};
  COLUMNS.forEach(function (c, i) {
    var v = row[i];
    o[c[1]] = v instanceof Date ? v.toISOString() : String(v === null || v === undefined ? '' : v);
  });
  if (!o.status) o.status = 'SUBMITTED';
  return o;
}

// ------------------------------------------------------------------
// Sanitising
// ------------------------------------------------------------------

function clean_(value, multiline) {
  if (value === null || value === undefined) return '';
  var s = String(value);
  // Remove control characters (keep newlines and tabs in long answers).
  s = multiline ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
                : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
  // Strip HTML tags; the dashboard renders text only, this is defence in depth.
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/\r\n?/g, '\n');
  return s.trim();
}

// Prevent spreadsheet formula injection: text starting with = + - @ is stored as literal text.
function guard_(value) {
  var s = value === null || value === undefined ? '' : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function fail_(message, code, fields) {
  var out = { ok: false, error: message, code: code || 'ERROR' };
  if (fields) out.fields = fields;
  return json_(out);
}

// ------------------------------------------------------------------
// One-time setup (run manually from the Apps Script editor)
// ------------------------------------------------------------------

function setup() {
  var sheet = getSheet_();
  writeHeaders_(sheet);
  Logger.log('Sheet "%s" is ready with %s columns.', sheet.getName(), COLUMNS.length);
  if (!cfg_('ADMIN_KEY', '')) Logger.log('WARNING: ADMIN_KEY is not set. The admin dashboard will not work until it is.');
}

function writeHeaders_(sheet) {
  var headers = COLUMNS.map(function (c) { return c[0]; });
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#054AAB')
    .setFontColor('#FFFFFF')
    .setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  var maxRows = sheet.getMaxRows();
  // Store everything except the timestamp as plain text so phone numbers
  // keep their leading zero and registration numbers are not reformatted.
  sheet.getRange(2, 2, maxRows - 1, COLUMNS.length - 1).setNumberFormat('@');
  sheet.getRange(2, 1, maxRows - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

  // Status dropdown so the electoral team can also edit status directly in the sheet.
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, colIndex_('status'), maxRows - 1, 1).setDataValidation(statusRule);

  // Continue the ID counter from existing rows if the property was reset.
  var last = sheet.getLastRow();
  if (last >= 2 && !PROPS.getProperty('ID_SEQ')) {
    PROPS.setProperty('ID_SEQ', String(last - 1));
  }
}
