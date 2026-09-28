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
// Use only real club photographs. No stock, AI-generated or illustrative
// images. A slot whose file is missing renders a plain neutral panel, so the
// layout holds until the photograph is supplied.
//
// Each photograph should appear in one slot only.

const photo = (file, alt, position = '50% 50%', caption = null) => ({
  src: `./photos/${file}`,
  alt,
  position,
  caption,
});

export const PHOTOS = {
  // Homepage hero carousel: 4 to 6 photographs, landscape works best.
  hero: [
    photo('hero-1.jpg', 'Members of the JKUAT French Club together at a club gathering', '50% 40%'),
    photo('hero-2.jpg', 'Students taking part in a JKUAT French Club activity', '50% 45%'),
    photo('hero-3.jpg', 'Club members in conversation during a French Club session', '50% 40%'),
    photo('hero-4.jpg', 'JKUAT French Club members at a cultural event', '50% 45%'),
    photo('hero-5.jpg', 'A group photograph of JKUAT French Club members', '50% 35%'),
  ],

  // "The election" section: one strong horizontal photograph.
  election: photo('election.jpg', 'JKUAT French Club members gathered for a club meeting', '50% 45%'),

  // "Executive positions" section: one large editorial photograph (portrait crop on desktop).
  positions: photo('positions.jpg', 'Members of the JKUAT French Club leading a club activity', '50% 40%'),

  // "Application process" section: a tall photographic strip beside the steps.
  process: photo('process.jpg', 'Students working together during a JKUAT French Club session', '50% 50%'),

  // "Who should apply?" section: a large vertical photograph.
  requirements: photo('requirements.jpg', 'A JKUAT French Club member taking part in a club event', '50% 35%'),

  // "The French Club experience": four photographs in an asymmetric arrangement.
  experience: [
    photo('experience-1.jpg', 'JKUAT French Club members at a club gathering', '50% 45%'),
    photo('experience-2.jpg', 'Students during a French language activity', '50% 45%'),
    photo('experience-3.jpg', 'Club members together at a French Club event', '50% 40%'),
    photo('experience-4.jpg', 'JKUAT French Club members collaborating on a club activity', '50% 45%'),
  ],

  // Final call to action: a strong photograph used behind a dark gradient.
  cta: photo('cta.jpg', 'JKUAT French Club members together at a club event', '50% 40%'),

  // Application form: a narrow portrait panel shown on wide screens only.
  apply: photo('apply.jpg', 'A JKUAT French Club member at a club activity', '50% 35%'),
};
