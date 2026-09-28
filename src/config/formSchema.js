// Declarative definition of the multi-step application form.
// Field "key" values match the payload keys expected by the Apps Script backend.

import { POSITION_TITLES } from './positions.js';

export const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
export const MEMBERSHIP = ['Yes', 'No'];
export const DURATIONS = [
  'Less than 6 months',
  '6 months–1 year',
  '1–2 years',
  'More than 2 years',
  'New member',
];
export const PROFICIENCY = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Fluent'];
export const YES_NO = ['Yes', 'No'];

export const LIMITS = { short: 120, long: 2000 };

export const STEPS = [
  {
    id: 'personal',
    title: 'Personal information',
    accent: 'Bienvenue',
    intro: 'Tell us who you are. Use the details registered with the university.',
    fields: [
      { key: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name', required: true },
      {
        key: 'registrationNumber',
        label: 'Registration number',
        type: 'text',
        placeholder: 'e.g. SCT211-0000/2023',
        autoComplete: 'off',
        required: true,
        validate: 'regNo',
        transform: 'upper',
      },
      { key: 'course', label: 'Course / programme', type: 'text', required: true },
      { key: 'year', label: 'Year of study', type: 'select', options: YEARS, required: true },
      {
        key: 'phone',
        label: 'Phone number',
        type: 'tel',
        placeholder: 'e.g. 0712 345 678',
        autoComplete: 'tel',
        inputMode: 'tel',
        required: true,
        validate: 'phone',
      },
      {
        key: 'email',
        label: 'Email address',
        type: 'email',
        autoComplete: 'email',
        inputMode: 'email',
        required: true,
        validate: 'email',
      },
    ],
  },
  {
    id: 'club',
    title: 'Club information',
    intro: 'Your connection to the JKUAT French Club.',
    fields: [
      { key: 'membership', label: 'Are you currently a member of the French Club?', type: 'radio', options: MEMBERSHIP, required: true },
      { key: 'membershipDuration', label: 'How long have you been involved with the club?', type: 'radio', options: DURATIONS, required: true },
    ],
  },
  {
    id: 'position',
    title: 'Position',
    accent: 'Candidature',
    intro: 'Select the executive position you wish to contest.',
    fields: [
      { key: 'position', label: 'Which executive position are you applying for?', type: 'position', options: POSITION_TITLES, required: true },
    ],
  },
  {
    id: 'leadership',
    title: 'Leadership',
    accent: 'Leadership',
    intro: 'Answer in your own words. Clear, specific answers are more useful than long ones.',
    fields: [
      { key: 'leadershipMotivation', label: 'Why are you interested in becoming a JKUAT French Club leader?', type: 'textarea', required: true },
      { key: 'positionMotivation', label: 'Why are you applying for this particular position?', type: 'textarea', required: true },
      { key: 'leadershipDefinition', label: 'What does good leadership mean to you?', type: 'textarea', required: true },
      { key: 'leadershipExperience', label: 'Describe a situation where you demonstrated leadership or took initiative.', type: 'textarea', required: true },
      { key: 'leadershipQualities', label: 'What three qualities would you bring to the executive team?', type: 'textarea', rows: 3, required: true },
      { key: 'conflictResolution', label: 'How would you handle disagreement between two club members?', type: 'textarea', required: true },
      { key: 'academicBalance', label: 'How would you balance academic responsibilities with club leadership?', type: 'textarea', required: true },
    ],
  },
  {
    id: 'vision',
    title: 'Vision for the club',
    intro: 'Where you would like to take the club during your term.',
    fields: [
      { key: 'clubVision', label: 'What would you like the JKUAT French Club to achieve during your term?', type: 'textarea', required: true },
      { key: 'proposedActivities', label: 'Mention three activities or projects you would introduce to make the club more active.', type: 'textarea', required: true },
      { key: 'engagementStrategy', label: 'How would you encourage more students to participate in the club?', type: 'textarea', required: true },
      { key: 'francophoneImportance', label: 'Why do you believe French and Francophone culture are valuable to university students?', type: 'textarea', required: true },
    ],
  },
  {
    id: 'specific',
    title: 'Position-specific questions',
    intro: 'These questions depend on the position you selected.',
    dynamic: true, // fields are generated from the selected position
    fields: [],
  },
  {
    id: 'french',
    title: 'French language and culture',
    intro: 'All levels are welcome. Write the introduction at whatever level you are comfortable with.',
    fields: [
      { key: 'frenchProficiency', label: 'French proficiency', type: 'radio', options: PROFICIENCY, required: true },
      { key: 'frenchIntroduction', label: 'Write a short introduction about yourself in French.', type: 'textarea', lang: 'fr', required: true },
      { key: 'cultureInterest', label: 'What aspect of French or Francophone culture interests you most?', type: 'textarea', required: true },
    ],
  },
  {
    id: 'commitment',
    title: 'Commitment',
    intro: 'Executive roles need time and consistency.',
    fields: [
      { key: 'meetingCommitment', label: 'Are you willing to attend regular executive meetings?', type: 'radio', options: YES_NO, required: true },
      { key: 'activityCommitment', label: 'Are you willing to participate actively in French Club activities?', type: 'radio', options: YES_NO, required: true },
      { key: 'leadershipCommitment', label: 'What commitment can members expect from you if you are elected?', type: 'textarea', required: true },
    ],
  },
  {
    id: 'declaration',
    title: 'Declaration',
    intro: 'Review your answers, then confirm and submit.',
    fields: [
      { key: 'declaration', label: 'I confirm that the information I have provided is accurate.', type: 'checkbox', required: true },
    ],
  },
];

export const DECLARATION_TEXT =
  'I declare that the information provided in this application is accurate and truthful. If elected, I agree to carry out my responsibilities diligently, work collaboratively with other executive members, respect club members, and uphold the values and applicable rules of the JKUAT French Club.';

export const INITIAL_VALUES = {
  fullName: '', registrationNumber: '', course: '', year: '', phone: '', email: '',
  membership: '', membershipDuration: '',
  position: '',
  leadershipMotivation: '', positionMotivation: '', leadershipDefinition: '', leadershipExperience: '',
  leadershipQualities: '', conflictResolution: '', academicBalance: '',
  clubVision: '', proposedActivities: '', engagementStrategy: '', francophoneImportance: '',
  positionAnswer1: '', positionAnswer2: '', positionAnswer3: '',
  frenchProficiency: '', frenchIntroduction: '', cultureInterest: '',
  meetingCommitment: '', activityCommitment: '', leadershipCommitment: '',
  declaration: false,
  website: '', // honeypot: must stay empty
};
