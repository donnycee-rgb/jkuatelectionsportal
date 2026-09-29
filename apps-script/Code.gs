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
 * Applicant emails (optional; see docs/SETUP.md, "Applicant emails")
 *   MAIL_ENABLED     "false" turns all applicant emails off. Default: on.
 *   MAIL_SENDER_NAME Name shown as the sender. Default: "JKUAT French Club".
 *   MAIL_REPLY_TO    The club's own address; applicants' replies go here.
 *   Emails are sent by the Google account that deploys this script. To show
 *   the club's own address as the sender, deploy from the club's account.
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
  ['Admin Notes', 'adminNotes'],
  ['Last Emailed Status', 'lastEmailedStatus'],
  ['Last Emailed At', 'lastEmailedAt']
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
    var rowNumber = sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // Confirmation email, sent outside the lock. A failed email never undoes
  // a recorded application.
  var email = notifyApplicant_(sheet, rowNumber, data, 'SUBMITTED');

  return json_({
    ok: true,
    applicationId: data.applicationId,
    timestamp: now.toISOString(),
    position: data.position,
    emailSent: email.sent
  });
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
    mail: mailStatus_(),
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
    var previous = found.record.status;
    var changed = false;

    if (body.status !== undefined) {
      var status = String(body.status).toUpperCase();
      if (STATUSES.indexOf(status) === -1) return fail_('Invalid status.', 'VALIDATION');
      sheet.getRange(found.rowNumber, colIndex_('status')).setValue(status);
      found.record.status = status;
      changed = status !== previous;
    }
    if (body.adminNotes !== undefined) {
      var notes = clean_(body.adminNotes, true).slice(0, LONG_MAX);
      sheet.getRange(found.rowNumber, colIndex_('adminNotes')).setValue(guard_(notes));
      found.record.adminNotes = notes;
    }

    // Email only on a real status change, only when the admin asked for it
    // (body.notify, on by default), and never twice for the same status.
    // body.sendEmail retries the email for the current status (for example
    // after the daily limit was reached); it is still sent at most once.
    var email = { sent: false, skipped: 'NO_CHANGE' };
    if (changed || body.sendEmail === true) {
      email = body.notify === false
        ? { sent: false, skipped: 'NOT_REQUESTED' }
        : notifyApplicant_(sheet, found.rowNumber, found.record, found.record.status);
    }
    return json_({ ok: true, application: found.record, email: email, mail: mailStatus_() });
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
  } else {
    ensureColumns_(sheet);
  }
  return sheet;
}

// Sheets created before a column was added get the new columns and headers,
// so reads and writes never go past the sheet's last column.
function ensureColumns_(sheet) {
  var have = sheet.getMaxColumns();
  if (have < COLUMNS.length) sheet.insertColumnsAfter(have, COLUMNS.length - have);
  var lastHeader = sheet.getRange(1, COLUMNS.length).getValue();
  if (lastHeader !== COLUMNS[COLUMNS.length - 1][0]) {
    for (var i = 0; i < COLUMNS.length; i++) {
      var cell = sheet.getRange(1, i + 1);
      if (!cell.getValue()) {
        cell.setValue(COLUMNS[i][0]).setFontWeight('bold').setBackground('#054AAB').setFontColor('#FFFFFF').setWrap(true);
      }
    }
  }
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

// ------------------------------------------------------------------
// Applicant emails
// ------------------------------------------------------------------

var TERM = '2026/2027';

// Statuses that email the applicant. "UNDER REVIEW" deliberately sends nothing.
var EMAIL_STATUSES = ['SUBMITTED', 'SHORTLISTED', 'NOT SHORTLISTED', 'INTERVIEW', 'ELECTED', 'NOT ELECTED'];

// Wording for each status. Deliberately free of dates, venues or promises:
// the club shares those details separately.
function emailContent_(status, a) {
  var position = a.position;
  switch (status) {
    case 'SUBMITTED':
      return {
        subject: 'Application received: ' + position + ' (' + a.applicationId + ')',
        heading: 'Application received',
        paragraphs: [
          'Thank you for applying for the position of ' + position + ' in the JKUAT French Club executive leadership for ' + TERM + '. Your application has been successfully recorded.',
          'Keep your reference number for any communication about your application. Eligible candidates will be informed about subsequent stages.'
        ]
      };
    case 'SHORTLISTED':
      return {
        subject: 'You have been shortlisted: ' + position + ' (' + a.applicationId + ')',
        heading: 'You have been shortlisted',
        paragraphs: [
          'Congratulations. Your application for the position of ' + position + ' has been reviewed and you have been shortlisted.',
          'The club will contact you with the next steps in the election process.'
        ]
      };
    case 'NOT SHORTLISTED':
      return {
        subject: 'Update on your application: ' + position + ' (' + a.applicationId + ')',
        heading: 'Update on your application',
        paragraphs: [
          'Thank you for applying for the position of ' + position + '. After review, your application has not been shortlisted for this election.',
          'We appreciate your interest in serving the club and hope you will stay active in French Club activities.'
        ]
      };
    case 'INTERVIEW':
      return {
        subject: 'Interview invitation: ' + position + ' (' + a.applicationId + ')',
        heading: 'You are invited to an interview',
        paragraphs: [
          'Your application for the position of ' + position + ' has progressed to the interview stage.',
          'The club will contact you with the interview details. If you have questions in the meantime, reply to this email.'
        ]
      };
    case 'ELECTED':
      return {
        subject: 'Congratulations: elected ' + position,
        heading: 'Congratulations',
        paragraphs: [
          'You have been elected as ' + position + ' of the JKUAT French Club for ' + TERM + '.',
          'Thank you for your commitment to the club. The club will contact you about the handover and your responsibilities.'
        ]
      };
    case 'NOT ELECTED':
      return {
        subject: 'Election result: ' + position,
        heading: 'Thank you for standing',
        paragraphs: [
          'Thank you for standing for the position of ' + position + '. On this occasion you were not elected.',
          'Your willingness to serve is valued, and we hope you will stay active in French Club activities.'
        ]
      };
  }
  return null;
}

// Sends the email for `status` and records it on the row. Returns
// { sent: true } or { sent: false, skipped | error }. Never throws.
function notifyApplicant_(sheet, rowNumber, record, status) {
  try {
    if (String(cfg_('MAIL_ENABLED', 'true')).toLowerCase() === 'false') return { sent: false, skipped: 'DISABLED' };
    if (EMAIL_STATUSES.indexOf(status) === -1) return { sent: false, skipped: 'NOT_EMAILED_STATUS' };
    if (record.lastEmailedStatus === status) return { sent: false, skipped: 'ALREADY_SENT' };
    if (!record.email || !RE_EMAIL.test(record.email)) return { sent: false, error: 'The application has no valid email address.' };
    if (MailApp.getRemainingDailyQuota() < 1) return { sent: false, error: 'The daily email limit has been reached. Try again tomorrow.' };

    var content = emailContent_(status, record);
    var message = buildEmail_(content, record);
    var options = {
      name: cfg_('MAIL_SENDER_NAME', 'JKUAT French Club'),
      htmlBody: message.html
    };
    var replyTo = cfg_('MAIL_REPLY_TO', '');
    if (replyTo) options.replyTo = replyTo;
    MailApp.sendEmail(record.email, content.subject, message.text, options);

    var at = new Date();
    sheet.getRange(rowNumber, colIndex_('lastEmailedStatus')).setValue(status);
    sheet.getRange(rowNumber, colIndex_('lastEmailedAt')).setValue(Utilities.formatDate(at, 'Africa/Nairobi', 'yyyy-MM-dd HH:mm'));
    record.lastEmailedStatus = status;
    record.lastEmailedAt = at.toISOString();
    return { sent: true };
  } catch (err) {
    console.error('Email to applicant failed: ' + err);
    return { sent: false, error: 'The email could not be sent: ' + String(err.message || err) };
  }
}

function mailStatus_() {
  var enabled = String(cfg_('MAIL_ENABLED', 'true')).toLowerCase() !== 'false';
  var quota = null;
  try { quota = MailApp.getRemainingDailyQuota(); } catch (e) { /* not yet authorised */ }
  return { enabled: enabled, remainingToday: quota };
}

function esc_(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Plain-text and HTML versions of one email. Inline styles only, because
// email clients ignore stylesheets.
function buildEmail_(content, a) {
  var firstName = String(a.fullName || '').split(/\s+/)[0] || 'Candidate';
  var details = [
    ['Reference number', a.applicationId],
    ['Position', a.position]
  ];

  var text = ['Dear ' + firstName + ',', ''].concat(content.paragraphs.reduce(function (acc, p) { return acc.concat([p, '']); }, []));
  details.forEach(function (d) { text.push(d[0] + ': ' + d[1]); });
  text.push('', 'JKUAT French Club', "L'Équipe Gagnante", 'Executive Leadership Application ' + TERM);

  var rows = details.map(function (d) {
    return '<tr><td style="padding:8px 0;color:#5F6675;font-size:13px;">' + esc_(d[0]) + '</td>' +
      '<td style="padding:8px 0;font-weight:600;text-align:right;font-size:14px;">' + esc_(d[1]) + '</td></tr>';
  }).join('');

  var html =
    '<div style="background:#F7F8FA;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#111111;">' +
      '<div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E1E5EC;">' +
        '<div style="height:4px;background:#054AAB;border-right:120px solid #EA352F;"></div>' +
        '<div style="padding:28px 28px 8px;">' +
          '<p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#3D4452;font-weight:bold;">JKUAT French Club</p>' +
          '<p style="margin:4px 0 0;font-family:Georgia,serif;font-style:italic;color:#C4231E;">L\'Équipe Gagnante</p>' +
          '<h1 style="margin:22px 0 0;font-family:Georgia,serif;font-weight:normal;font-size:26px;line-height:1.2;">' + esc_(content.heading) + '</h1>' +
        '</div>' +
        '<div style="padding:8px 28px 4px;font-size:15px;line-height:1.6;color:#3D4452;">' +
          '<p>Dear ' + esc_(firstName) + ',</p>' +
          content.paragraphs.map(function (p) { return '<p>' + esc_(p) + '</p>'; }).join('') +
        '</div>' +
        '<div style="padding:0 28px;">' +
          '<table role="presentation" width="100%" style="border-collapse:collapse;border-top:1px solid #E1E5EC;border-bottom:1px solid #E1E5EC;">' + rows + '</table>' +
        '</div>' +
        '<p style="padding:20px 28px 28px;margin:0;font-size:12px;color:#5F6675;line-height:1.5;">' +
          'Executive Leadership Application ' + TERM + '. You are receiving this email because you applied through the JKUAT French Club application portal.' +
        '</p>' +
      '</div>' +
    '</div>';

  return { text: text.join('\n'), html: html };
}

// Run from the Apps Script editor to see every email in your own inbox
// (the account running the script). No applicant is emailed.
function sendTestEmails() {
  var me = Session.getEffectiveUser().getEmail();
  var sample = { fullName: 'Test Candidate', applicationId: 'JFC-2026-0000', position: 'Secretary', email: me };
  EMAIL_STATUSES.forEach(function (status) {
    var content = emailContent_(status, sample);
    var message = buildEmail_(content, sample);
    var options = { name: cfg_('MAIL_SENDER_NAME', 'JKUAT French Club'), htmlBody: message.html };
    var replyTo = cfg_('MAIL_REPLY_TO', '');
    if (replyTo) options.replyTo = replyTo;
    MailApp.sendEmail(me, '[TEST] ' + content.subject, message.text, options);
  });
  Logger.log('Sent %s test emails to %s.', EMAIL_STATUSES.length, me);
}
