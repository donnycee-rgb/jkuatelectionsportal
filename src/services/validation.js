// Frontend validation. The Apps Script backend repeats every one of these
// checks independently, so this layer exists for fast, friendly feedback only.

import { LIMITS } from '../config/formSchema.js';
import { POSITION_TITLES, getPosition } from '../config/positions.js';

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  // Kenyan numbers: 07XX / 01XX / +2547XX / +2541XX, spaces and dashes allowed.
  phone: /^(?:\+?254|0)(?:7|1)\d{8}$/,
  // Lenient registration number check: letters, digits, dashes and slashes,
  // containing at least one digit (e.g. SCT211-0123/2023).
  regNo: /^(?=.*\d)[A-Z0-9][A-Z0-9\-/]{4,29}$/,
};

const MESSAGES = {
  required: 'This field is required.',
  choose: 'Choose one option to continue.',
  email: 'Enter a valid email address, for example name@students.jkuat.ac.ke.',
  phone: 'Enter a Kenyan phone number, for example 0712 345 678 or +254 712 345 678.',
  regNo: 'Enter your registration number as it appears on your student ID.',
  declaration: 'Tick the declaration to confirm your information is accurate.',
};

export const normalisePhone = (v) => String(v || '').replace(/[\s-()]/g, '');

export function validateField(field, value) {
  const isChoice = ['radio', 'select', 'position'].includes(field.type);

  if (field.type === 'checkbox') {
    return field.required && !value ? MESSAGES.declaration : '';
  }

  const text = String(value ?? '').trim();
  if (field.required && !text) return isChoice ? MESSAGES.choose : MESSAGES.required;
  if (!text) return '';

  if (field.options && !field.options.includes(text)) return MESSAGES.choose;

  const max = field.type === 'textarea' ? LIMITS.long : LIMITS.short;
  if (text.length > max) return `Keep this under ${max} characters (currently ${text.length}).`;

  if (field.type === 'textarea' && field.required && text.length < 10) {
    return 'Add a little more detail so the reviewers can understand your answer.';
  }

  switch (field.validate) {
    case 'email':
      return PATTERNS.email.test(text) ? '' : MESSAGES.email;
    case 'phone':
      return PATTERNS.phone.test(normalisePhone(text)) ? '' : MESSAGES.phone;
    case 'regNo':
      return PATTERNS.regNo.test(text.toUpperCase().replace(/\s/g, '')) ? '' : MESSAGES.regNo;
    default:
      return '';
  }
}

export function validateStep(fields, values) {
  const errors = {};
  fields.forEach((f) => {
    const msg = validateField(f, values[f.key]);
    if (msg) errors[f.key] = msg;
  });
  return errors;
}

// Builds the position-specific fields for the selected position.
export function positionFields(positionTitle) {
  const pos = getPosition(positionTitle);
  if (!pos) return [];
  return pos.questions.map((q, i) => ({
    key: `positionAnswer${i + 1}`,
    label: q,
    type: 'textarea',
    required: true,
  }));
}

export const isValidPosition = (p) => POSITION_TITLES.includes(p);
