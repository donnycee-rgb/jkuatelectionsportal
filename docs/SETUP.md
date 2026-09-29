# Setup and deployment

Allow about 20 minutes. You need a Google account that will own the application data
(ideally a club account, not a personal one) and Node.js 18 or newer.

---

## 1. Create the Google Sheet

1. Go to https://sheets.google.com and create a blank spreadsheet.
2. Name it, for example, `JKUAT French Club - Executive Applications 2026-2027`.
3. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_ID`**`/edit`
4. Keep sharing restricted to the electoral team only. The Web App does not need the
   sheet to be public.

You do not need to type headers. `setup()` creates them in step 3.

---

## 2. Create the Apps Script project

1. In the sheet, open **Extensions > Apps Script**.
2. Delete the placeholder code in `Code.gs` and paste the full contents of
   `apps-script/Code.gs` from this project.
3. Optional but recommended: click the gear icon (**Project Settings**), tick
   **Show "appsscript.json" manifest file in editor**, then replace its contents with
   `apps-script/appsscript.json` (sets the Nairobi time zone and V8 runtime).
4. Save (Ctrl/Cmd + S).

### Add the private configuration

**Project Settings > Script Properties > Add script property**

| Property | Value |
|---|---|
| `SPREADSHEET_ID` | The ID copied in step 1 |
| `SHEET_NAME` | `Applications` |
| `ADMIN_KEY` | A long random passphrase, at least 20 characters. Share it only with the electoral team. |
| `ID_YEAR` | `2026` (optional; used in reference numbers) |
| `MAIL_REPLY_TO` | The club's own email address. Applicants' replies go here (see "Applicant emails") |
| `MAIL_SENDER_NAME` | `JKUAT French Club` (optional; this is the default) |
| `MAIL_ENABLED` | Optional. Set to `false` to stop all applicant emails |

These values never leave Google's servers. They are not in the frontend code.

---

## 3. Initialise the sheet

1. In the editor toolbar choose the function **`setup`** and click **Run**.
2. Approve the permission prompt (the script needs access to your spreadsheets and
   permission to **send email as you**, for applicant emails).
   If you see "Google hasn't verified this app", choose **Advanced > Go to project**.
   This is normal for your own scripts.
3. Open the sheet. The `Applications` tab should now have 36 blue header cells, a frozen
   header row and a status dropdown in column AG.

---

## 4. Deploy the Web App

1. Click **Deploy > New deployment**.
2. Select type: **Web app**.
3. Settings:
   - Description: `Applications API v1`
   - **Execute as: Me** (the sheet owner)
   - **Who has access: Anyone**
4. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.

"Anyone" is required because applicants are not signed in to Google. The script
still validates every request, and admin actions require `ADMIN_KEY`.

**Test it:** open the `/exec` URL in a browser. You should see
`{"ok":true,"service":"JKUAT French Club applications",...}`.

### Updating the backend later

Edit `Code.gs`, then **Deploy > Manage deployments > (pencil) Edit > Version: New version > Deploy**.
This keeps the same URL. Creating a *new deployment* instead gives you a new URL that
you would have to put back into `.env`.

---

## 5. Connect the frontend

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfy.../exec
VITE_ADMIN_ROUTE=electoral-desk
```

Change `VITE_ADMIN_ROUTE` to a path only your team knows. It is not a security control
on its own (the key is), but it keeps the dashboard out of casual view.

Then:

```bash
npm install
npm run dev      # check a test submission appears in the sheet
npm run build    # production files in dist/
```

The URL is compiled into the build, so run `npm run build` again whenever it changes.

---

## Applicant emails

Applicants are emailed automatically:

| When | Email |
|---|---|
| They submit an application | Confirmation with their reference number |
| Status set to Shortlisted, Not shortlisted, Interview, Elected or Not elected **from the dashboard** | A short, neutral update for that status |
| Status set to Under review | Nothing |

- The emails never include internal notes, dates or venues. They say the club will
  share details separately.
- In the dashboard, **Email the applicant about this change** (ticked by default) lets
  you change a status quietly, for example to correct a mistake.
- Each status is emailed at most once per applicant. The sheet records it in
  **Last Emailed Status** and **Last Emailed At**, and the side panel shows it.
- If an email cannot be sent, the status is still saved and the panel says why. Use
  **Send email now** to retry later.
- Editing the status **directly in the Google Sheet does not send email**. Use the
  dashboard when the applicant should be told.

**Sender.** Emails are sent by the Google account that deployed the script, with
`MAIL_SENDER_NAME` (default "JKUAT French Club") as the display name. Replies go to
`MAIL_REPLY_TO`. To make the club's own address appear as the sender too, create and
deploy the Apps Script from the club's Google account.

**Daily limit.** About 100 emails a day on a personal Gmail account, about 1,500 on
Google Workspace. The dashboard shows how many are left today.

**Try it first.** In the Apps Script editor, run **`sendTestEmails`**. It sends one
example of every email to the account running the script. No applicant is emailed.

**After updating `Code.gs`,** publish a new version of the deployment (step 4,
"Updating the backend later") and approve the new "send email" permission when asked.

---

## 6. Host the site

`dist/` is a plain static site with relative paths, so it works at a domain root or in a
sub-folder.

**Netlify** — drag the `dist` folder onto https://app.netlify.com/drop, or connect the
repository with build command `npm run build` and publish directory `dist`. Add
`VITE_APPS_SCRIPT_URL` under Site settings > Environment variables.

**Vercel** — import the repository; framework preset **Vite**; add the environment
variable; deploy.

**GitHub Pages** — build locally and publish `dist/` (for example with the
`gh-pages` package: `npx gh-pages -d dist`), or use a GitHub Actions workflow that
runs `npm ci && npm run build` with the variable stored as a repository secret.

**cPanel / university web space / Firebase Hosting** — upload the contents of `dist/`
to the web root (or `firebase deploy` with `public: "dist"`).

No server rewrites are needed because the app uses hash routes (`#/apply`).

---

## 7. Go-live checklist

- [ ] Submit a test application from a phone and a laptop; confirm both rows appear.
- [ ] Submit the same registration number again; confirm it is rejected as a duplicate.
- [ ] Open `#/<your admin route>`, sign in with `ADMIN_KEY`, change a status, add a note,
      export CSV.
- [ ] Delete the test rows from the sheet. If you want numbering to restart at 0001,
      delete the `ID_SEQ` script property as well.
- [ ] Confirm the six positions and all wording with the club executive / electoral
      committee before sharing the link.

---

## Using the admin dashboard

| Task | How |
|---|---|
| Totals | Summary cards at the top; click a position card to filter by it |
| Search | Name, registration number or reference number |
| Filter | Position and status dropdowns |
| Review | **View** opens the full application in a side panel |
| Decide | Change the status and add internal notes, then **Save changes**. The applicant is emailed unless you untick the box |
| Export | **Export CSV** downloads every column, including notes |

The team can also work directly in the Google Sheet. Status cells have a dropdown with
the permitted values. Changes made there do not email the applicant.

---

## Security notes and limits

- **Shared key model.** The dashboard uses one shared `ADMIN_KEY`. Anyone with the key
  can read all applications, so share it only with the electoral team and rotate it
  (edit the script property) after the election or if a member leaves. No redeploy is
  needed to rotate.
- **Brute-force protection.** Ten wrong keys within 15 minutes lock the admin API for
  everyone for 15 minutes.
- **Stronger option.** For stricter control, keep the public Web App for submissions
  only (remove the `admin.*` cases in `doPost`) and let the electoral team work in the
  Google Sheet itself, which is protected by Google sign-in and sheet sharing.
- **Rate limits.** Apps Script quotas comfortably cover a club election (tens to
  hundreds of submissions). Submissions are serialised with a lock so reference
  numbers never collide.
- **Data protection.** Applications contain personal data. Keep the sheet private,
  export only when needed, and delete the data when the election records are no longer
  required under the club's and university's rules.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Dashboard shows applications but the sheet is empty, or the admin login says "Preview mode" | The site was built without `VITE_APPS_SCRIPT_URL`, so it runs in preview mode and stores submissions only in each visitor's own browser. Add the variable in your host's settings (Netlify: Site configuration > Environment variables) and redeploy. |
| Applicants do not receive emails | Run `sendTestEmails` in the editor. Check spam folders, `MAIL_ENABLED`, and that a new version was deployed after updating `Code.gs`. |
| "Could not reach the application server" | Check `VITE_APPS_SCRIPT_URL` ends in `/exec`, that access is **Anyone**, and rebuild. |
| Submissions work but nothing appears in the sheet | `SPREADSHEET_ID` is wrong, or the sheet belongs to a different account from the one that deployed. |
| "The admin key has not been configured" | Add `ADMIN_KEY` (12+ characters) in Script Properties. |
| Changes to `Code.gs` have no effect | Publish a **new version** of the existing deployment (see step 4). |
| Phone numbers lost their leading zero | Run `setup()` again to reapply plain-text formatting. |
