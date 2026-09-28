# JKUAT French Club — Executive Leadership Application Portal 2026/2027

Official application portal for the six executive seats of the JKUAT French Club
(*L'Équipe Gagnante*). Built with **React 18 + Vite**, backed by a **Google Apps
Script Web App** that writes one row per application to **Google Sheets**.

```
React (static site)  ──POST JSON──▶  Google Apps Script Web App  ──▶  Google Sheets
```

## What is included

| Part | Where |
|---|---|
| React frontend (landing, election info, positions, process, requirements, 9-step form, confirmation, admin dashboard) | `src/` |
| Google Apps Script backend (validation, sanitising, duplicate check, server-side IDs, admin API) | `apps-script/Code.gs` |
| Apps Script manifest | `apps-script/appsscript.json` |
| Google Sheet column structure | `docs/SHEET_COLUMNS.md` |
| Setup, deployment and connection guide | `docs/SETUP.md` |
| Official logo (cropped, unaltered) | `public/jfc-logo.png` |
| Club photographs (add your own, see the guide in the folder) | `public/photos/`, listed in `src/config/photos.js` |

## Quick start (local)

```bash
npm install
npm run dev          # http://localhost:5173
```

With no `.env` file the app runs in **preview mode**: submissions are stored in
your browser only, so you can click through the whole flow. The admin dashboard
is at `#/electoral-desk` and the preview access key is `preview`.

To connect the real backend, follow `docs/SETUP.md`, then:

```bash
cp .env.example .env         # paste your Apps Script Web App URL
npm run build                # output in dist/
```

Upload the contents of `dist/` to any static host.

## Link previews and SEO

`index.html` carries the page description, Open Graph and X (Twitter) card tags,
and schema.org data, so a shared link shows the election title, a short
description and `public/og-image.png` (1200 x 630).

These tags need the site's full public address. It defaults to
`https://jkuat-french-club-elections.netlify.app`; if the site moves (for example
to a custom domain), set `VITE_SITE_URL` in `.env` or in the host's environment
variables and rebuild. The admin route is marked `noindex`.

## Project structure

```
src/
  config/        app.js (public config), positions.js (the six seats), formSchema.js (all questions), photos.js (every public photograph)
  services/      api.js (Apps Script client), validation.js, csv.js, previewStore.js
  hooks/         useRoute.js (hash router), useReveal.js (scroll reveal)
  components/
    layout/      Header, Footer
    common/      Logo, Photo, Icons (line icons, no emojis), Reveal, SectionHead
    home/        Hero, HeroCarousel, About, Positions, Process, Experience, Requirements, ApplyBand
    form/        ApplicationForm, Field, PositionPicker, Progress, Review
    admin/       AdminLogin, ApplicationDetail, BarList, StatusBadge, columns
  pages/         HomePage, ApplyPage, ConfirmationPage, AdminPage, NotFoundPage
  styles/        tokens.css, base.css, layout.css, home.css, form.css, admin.css
apps-script/     Code.gs, appsscript.json
docs/            SETUP.md, SHEET_COLUMNS.md
```

## Routes

| Route | Page |
|---|---|
| `#/` | Landing page with all information sections |
| `#/apply` | Application form (`#/apply?position=treasurer` preselects a seat) |
| `#/submitted` | Submission confirmation |
| `#/<VITE_ADMIN_ROUTE>` | Admin dashboard. Not linked anywhere in the public site. Default `electoral-desk`. |

Hash routing is used so the site works on every static host without rewrite rules.

## Key behaviours

- **Exactly six positions, one seat each**: President, Secretary, Deputy Chairperson,
  Organising Secretary, Treasurer, Social Media Manager. Defined once in
  `src/config/positions.js` and mirrored in `Code.gs`.
- **One position per candidate**: the picker is a radio group; the backend also rejects
  a second application with the same registration number or email.
- **Position-specific questions** appear automatically for the selected seat
  (three for President, two for the others).
- **Draft autosave** keeps progress on the candidate's device until they submit.
  The declaration is never pre-ticked from a saved draft.
- **Reference numbers** (`JFC-2026-0001`, …) are generated on the server inside a lock.
- **Admin dashboard**: totals by position, year and status; search by name, registration
  number or reference; filter by position and status; full application view; status
  changes; internal notes; CSV export. Contact details appear only inside an opened
  application, not in the table.

## Security summary

- No Google credentials, Spreadsheet ID or admin key exist in the frontend. They live in
  Apps Script **Script Properties**.
- The Web App URL in `.env` is a public endpoint, not a secret.
- Every field is validated and sanitised again on the server; frontend checks are for
  convenience only.
- Spreadsheet formula injection is neutralised on write (sheet) and on CSV export.
- Admin requests need the access key; repeated wrong keys lock the admin API for 15 minutes.
- The admin key is held in `sessionStorage` only and is cleared when the tab closes.
- A hidden honeypot field rejects simple bots.

See `docs/SETUP.md` for the limits of a shared-key admin model and how to tighten it.

## Accessibility and motion

Semantic landmarks, labelled fields, error summary with links to each problem field,
focus moved to each new step, visible focus rings, 48px+ touch targets, 16px inputs (no
iOS zoom), status shown by text and shape not colour alone. All motion is disabled under
`prefers-reduced-motion`.
