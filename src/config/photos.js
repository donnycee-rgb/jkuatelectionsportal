// Club photography. Every image on the public site is listed here, and only
// here, so the real JKUAT French Club photographs can be dropped in without
// touching any component.
//
// HOW TO ADD THE PHOTOGRAPHS
//   1. Copy the club's own photographs into public/photos/ using the file
//      names below (JPG or WebP, about 2000px on the long side, under ~400 KB).
//   2. Rewrite each `alt` so it describes what is actually in that photograph.
//   3. Adjust `position` (CSS object-position) if a crop cuts off faces.
//   4. `caption` stays null unless the event, date or place is confirmed.
//
// A slot set to null is left out: its section switches to a text-only
// layout. A slot whose file is missing renders a plain neutral panel.
// Each photograph should appear in one slot only.
//
// CURRENT IMAGES ARE PLACEHOLDERS. They are general images, not photographs
// of the JKUAT French Club, so their alt text describes only what is shown
// and no captions are used. Replace them with real club photographs as soon
// as they are available, and fill the null slots at the same time.

const photo = (file, alt, position = '50% 50%', caption = null) => ({
  src: `./photos/${file}`,
  alt,
  position,
  caption,
});

export const PHOTOS = {
  // Homepage hero carousel: 4 to 6 photographs, landscape works best.
  hero: [
    photo('team-hands.webp', 'A group of people standing in a circle with their hands stacked together in the centre', '50% 50%'),
    photo('vive-la-france.webp', "A blue, white and red balloon arch above a banner reading 'Vive la France!' with two Eiffel Tower motifs", '50% 55%'),
    photo('leadership-silhouettes.png', 'Silhouettes of people in business dress standing together, in blue tones', '50% 60%'),
  ],

  // "The election" section: one strong horizontal photograph.
  election: photo('table-discussion.webp', 'Students seated around a round table in discussion, seen from above', '50% 42%'),

  // "Executive positions" section: one large editorial photograph (portrait crop on desktop).
  positions: null,

  // "Application process" section: a tall photographic strip beside the steps.
  process: null,

  // "Who should apply?" section: a large vertical photograph.
  requirements: null,

  // "The French Club experience": three or four photographs in an asymmetric
  // arrangement. The section is hidden until at least three are supplied.
  experience: [],

  // Final call to action: a strong photograph used behind a dark gradient.
  // Without one, the band uses the club blue.
  cta: null,

  // Application form: a narrow portrait panel shown on wide screens only.
  apply: photo('conversation.png', 'Two people seated facing each other in conversation', '50% 50%'),
};

export const SHOW_EXPERIENCE = PHOTOS.experience.filter(Boolean).length >= 3;
