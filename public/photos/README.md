# Club photographs

Put the JKUAT French Club's own photographs in this folder. Use real club
photographs only: no stock images, AI-generated images or illustrations.

The file names each slot expects, with its alt text, crop and optional caption,
are listed in `src/config/photos.js`:

| File | Where it appears |
|---|---|
| `hero-1.jpg` … `hero-5.jpg` | Homepage carousel (4–6 images, landscape) |
| `election.jpg` | "The election" section, horizontal |
| `positions.jpg` | "Executive positions", portrait crop on desktop |
| `process.jpg` | "Application process", tall strip |
| `requirements.jpg` | "Who should apply?", vertical |
| `experience-1.jpg` … `experience-4.jpg` | "The French Club experience" arrangement |
| `cta.jpg` | Final call to action, behind a dark gradient |
| `apply.jpg` | Narrow panel beside the application form (wide screens only) |

About 2000px on the long side, JPG or WebP, under ~400 KB each. After adding a
photograph, rewrite its `alt` text in `src/config/photos.js` to describe what is
actually in it. Until a file is added, its slot shows a plain neutral panel.

## Current placeholder images

The images in this folder now are general placeholders, not photographs of the
JKUAT French Club: `team-hands.webp`, `vive-la-france.webp` and
`leadership-silhouettes.png` (hero carousel), `table-discussion.webp` (The
Election) and `conversation.png` (application form panel). Replace them with
real club photographs when available. Slots set to `null` in
`src/config/photos.js` show a text-only layout until a photograph is added.
