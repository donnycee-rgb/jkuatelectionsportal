// Exactly six executive positions. One seat each. Do not add positions here.

export const POSITIONS = [
  {
    id: 'president',
    title: 'President',
    seats: 1,
    description: 'Provides overall leadership and coordination of the French Club.',
    questions: [
      'What would be your main priorities as President?',
      'How would you ensure that the executive works effectively as a team?',
      'What major initiative would you like to introduce?',
    ],
  },
  {
    id: 'secretary',
    title: 'Secretary',
    seats: 1,
    description: 'Coordinates official records, communication, minutes and administrative documentation.',
    questions: [
      'How would you ensure that club records and minutes are properly maintained?',
      'How would you improve communication between the executive and members?',
    ],
  },
  {
    id: 'deputy-chairperson',
    title: 'Deputy Chairperson',
    seats: 1,
    description: 'Supports the leadership of the club and assists with coordination of executive responsibilities.',
    questions: [
      'How would you support the President and other executive members?',
      'How would you contribute to continuity and effective coordination within the executive?',
    ],
  },
  {
    id: 'organising-secretary',
    title: 'Organising Secretary',
    seats: 1,
    description: 'Coordinates meetings, activities, events and logistical arrangements.',
    questions: [
      'How would you organize a successful French Club event?',
      'What would you do if an important event was approaching and preparations were behind schedule?',
    ],
  },
  {
    id: 'treasurer',
    title: 'Treasurer',
    seats: 1,
    description: 'Supports responsible financial management, budgeting and financial accountability.',
    questions: [
      'How would you promote transparency and accountability in club finances?',
      'What financial records should a club maintain?',
    ],
  },
  {
    id: 'social-media-manager',
    title: 'Social Media Manager',
    seats: 1,
    description: "Manages the club's digital presence, publicity and social media communication.",
    questions: [
      'How would you use social media to increase awareness and participation in French Club activities?',
      'Write a short French/English social media caption promoting a French Club event.',
    ],
  },
];

export const POSITION_TITLES = POSITIONS.map((p) => p.title);

export const getPosition = (title) => POSITIONS.find((p) => p.title === title);

export const STATUSES = [
  'SUBMITTED',
  'UNDER REVIEW',
  'SHORTLISTED',
  'NOT SHORTLISTED',
  'INTERVIEW',
  'ELECTED',
  'NOT ELECTED',
];
