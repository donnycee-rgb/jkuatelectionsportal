# Google Sheet column structure

Tab name: `Applications` (configurable with the `SHEET_NAME` script property).
Row 1 holds headers; one row per application from row 2. `setup()` in `Code.gs`
writes these headers for you, freezes them, formats columns as plain text and adds a
status dropdown.

| # | Column | Payload key | Notes |
|---|---|---|---|
| A | Timestamp | `timestamp` | Server time of submission (Africa/Nairobi) |
| B | Application ID | `applicationId` | Server-generated, e.g. `JFC-2026-0001` |
| C | Full Name | `fullName` | |
| D | Registration Number | `registrationNumber` | Upper-cased; used for duplicate check |
| E | Course | `course` | |
| F | Year | `year` | Year 1 to Year 6 |
| G | Phone | `phone` | Stored as text, spaces removed |
| H | Email | `email` | Lower-cased; used for duplicate check |
| I | Club Membership | `membership` | Yes / No |
| J | Membership Duration | `membershipDuration` | |
| K | Position Applied For | `position` | One of the six positions |
| L | Leadership Motivation | `leadershipMotivation` | |
| M | Position Motivation | `positionMotivation` | |
| N | Leadership Definition | `leadershipDefinition` | |
| O | Leadership Experience | `leadershipExperience` | |
| P | Leadership Qualities | `leadershipQualities` | |
| Q | Conflict Resolution | `conflictResolution` | |
| R | Academic/Club Balance | `academicBalance` | |
| S | Club Vision | `clubVision` | |
| T | Three Proposed Activities | `proposedActivities` | |
| U | Member Engagement Strategy | `engagementStrategy` | |
| V | French/Francophone Importance | `francophoneImportance` | |
| W | Position-Specific Answer 1 | `positionAnswer1` | |
| X | Position-Specific Answer 2 | `positionAnswer2` | |
| Y | Position-Specific Answer 3 | `positionAnswer3` | President only (the President seat has three questions) |
| Z | French Proficiency | `frenchProficiency` | |
| AA | French Introduction | `frenchIntroduction` | |
| AB | Francophone Culture Interest | `cultureInterest` | |
| AC | Meeting Commitment | `meetingCommitment` | Yes / No |
| AD | Activity Commitment | `activityCommitment` | Yes / No |
| AE | Leadership Commitment | `leadershipCommitment` | |
| AF | Declaration | `declaration` | `Confirmed` |
| AG | Application Status | `status` | Starts as `SUBMITTED` |
| AH | Admin Notes | `adminNotes` | Internal only |

## Position-specific questions per answer column

| Position | Answer 1 | Answer 2 | Answer 3 |
|---|---|---|---|
| President | Main priorities as President | Ensuring the executive works as a team | Major initiative to introduce |
| Secretary | Maintaining records and minutes | Improving executive–member communication | — |
| Deputy Chairperson | Supporting the President and executive | Continuity and coordination | — |
| Organising Secretary | Organising a successful event | Handling preparations behind schedule | — |
| Treasurer | Transparency and accountability | Financial records a club should keep | — |
| Social Media Manager | Using social media for awareness | French/English event caption | — |

## Application Status values

`SUBMITTED` · `UNDER REVIEW` · `SHORTLISTED` · `NOT SHORTLISTED` · `INTERVIEW` · `ELECTED` · `NOT ELECTED`

Status and Admin Notes are never returned to applicants. They are only readable through
the key-protected admin actions.

> Do not reorder, rename or insert columns after going live. The script reads and writes
> by column position. If you need an extra column, add it at the far right and extend
> `COLUMNS` in `Code.gs` and `src/components/admin/columns.js` together.
