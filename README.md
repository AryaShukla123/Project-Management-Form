# Project Register

> A console-styled Project Management Form that reads and writes project records straight to a JsonPowerDB database — no backend server required.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-3.4.1-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JsonPowerDB](https://img.shields.io/badge/Database-JsonPowerDB-1B2A4A?style=flat)
![Status](https://img.shields.io/badge/status-active-34D399?style=flat)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat)

Project Register is a single-page form for tracking college projects — `Project-ID`, `Project-Name`, `Assigned-To`, `Assignment-Date` and `Deadline` — stored in the `PROJECT-TABLE` relation of a `COLLEGE-DB` JsonPowerDB database. The primary key (`Project-ID`) drives the whole interaction: type an ID and the form automatically switches between **create mode** (new record, `Save` enabled) and **edit mode** (existing record loaded, `Update` enabled), enforcing the ID as a true primary key with no separate lookup step needed. It was built for the Login2Explore JsonPowerDB micro-internship using nothing but HTML, JavaScript/jQuery and Bootstrap on the front end.

## Example Screenshot

![Project Register screenshot](https://github.com/user-attachments/assets/738f6363-1d39-4a2c-b599-91b99a28612b)


---

## Table of Contents

- [Illustrations](#illustrations)
- [Scope of Functionalities](#scope-of-functionalities)
- [Installation](#installation)
  - [Windows](#windows)
  - [OS X & Linux](#os-x--linux)
- [Development Setup](#development-setup)
- [Usage Example](#usage-example)
- [Benefits of Using JsonPowerDB](#benefits-of-using-jsonpowerdb)
- [Project Status](#project-status)
- [Release History](#release-history)
- [Sources](#sources)
- [Other Information](#other-information)

---

## Illustrations

| Empty form (Step 1) | Existing record loaded | New record ready to save |
|---|---|---|
| Only `Project ID` active, cursor focused, all buttons disabled | `ON_FILE` status, ID locked, `Update` enabled | `NEW_ENTRY` status, `Save` + `Reset` enabled |


---

## Scope of Functionalities

- Primary-key–driven lookup: entering a `Project ID` automatically checks JsonPowerDB via `GET_BY_KEY` and switches the form's mode.
- **Create flow** — new ID → all fields unlock, `Save` writes a new record with `PUT`.
- **Edit flow** — existing ID → record loads into the form, `Project ID` locks, `Update` modifies the record in place.
- **Reset** — returns the form to its initial state at any point.
- Client-side validation blocks empty fields before any write.
- Live status indicator (`NEW_ENTRY` / `ON_FILE` / `FILED`) reflects the current record state at a glance.
- No page reloads — all reads/writes happen asynchronously via jQuery AJAX against the JPDB REST API.

---

## Installation

### Windows

1. Install [NetBeans IDE](https://netbeans.apache.org/) (or any static file server / Live Server extension).
2. Clone or download this repository:
   ```
   git clone https://github.com/<your-username>/project-register.git
   ```
3. Open the folder as a project in NetBeans (**File → Open Project**).
4. Open `js/index.js` and set your JsonPowerDB connection token (see [Development Setup](#development-setup)).
5. Right-click `index.html` → **Run File** to launch it on NetBeans' built-in server.

### OS X & Linux

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/project-register.git
   cd project-register/ProjectManagementForm
   ```
2. Set your connection token in `js/index.js` (see [Development Setup](#development-setup)).
3. Serve the folder with any static server, for example:
   ```bash
   python3 -m http.server 8383
   ```
4. Open `http://localhost:8383/index.html` in your browser.

> ⚠️ Don't open `index.html` directly via `file://` — some browsers block the AJAX calls to the JPDB API from the local filesystem. Always serve it over HTTP.

---

## Development Setup

1. Sign up for a free account at [login2explore.com](https://login2explore.com/jpdb/) and generate a **connection token**.
2. In `js/index.js`, update:
   ```javascript
   var connToken = "PUT_YOUR_CONNECTION_TOKEN_HERE";
   var dbName    = "COLLEGE-DB";
   var relName   = "PROJECT-TABLE";
   ```
3. No manual database setup is needed — `COLLEGE-DB` and `PROJECT-TABLE` are created automatically on the first successful `Save`.
4. All API calls go through `jpdb-commons.js`, loaded via CDN in `index.html`:
   ```html
   <script src="https://login2explore.com/jpdb/resources/js/0.0.4/jpdb-commons.js"></script>
   ```
5. No build step, package manager, or bundler is involved — edit the files and refresh the browser.

---

## Usage Example

**Creating a new project:**
1. Type a new `Project ID` (e.g. `PRJ-2026-004`) and tab out of the field.
2. Since it doesn't exist yet, the form unlocks and status shows `NEW_ENTRY`.
3. Fill in `Project Name`, `Assigned To`, `Assignment Date`, `Deadline`.
4. Click **Save** — the record is written with a `PUT` command, and the form resets.

**Editing an existing project:**
1. Type an existing `Project ID` and tab out.
2. The record loads automatically, `Project ID` locks, status shows `ON_FILE`.
3. Change any of the other fields.
4. Click **Update** — the record is modified with an `UPDATE` command, and the form resets.

Underlying request built for a save, for reference:
```javascript
var record = {
  "Project-ID": "PRJ-2026-004",
  "Project-Name": "Library Management System",
  "Assigned-To": "Arya Shukla",
  "Assignment-Date": "2026-07-01",
  "Deadline": "2026-08-15"
};
var putReq = createPUTRequest(connToken, JSON.stringify(record), dbName, relName);
executeCommandAtGivenBaseUrl(putReq, baseUrl, imlPartUrl);
```

---

## Benefits of Using JsonPowerDB

- **No backend code required** — the browser talks directly to JPDB's REST API over HTTP/HTTPS, so a form like this needs zero server-side scripting.
- **Schema-less, JSON-native storage** — records are stored and returned as plain JSON, matching how the form already represents data in JavaScript.
- **Built-in primary-key semantics** — `PUT`, `GET_BY_KEY`, and `UPDATE` map cleanly onto standard create/read/update flows without extra query logic.
- **Auto-created relations** — no separate database-provisioning step; the first `PUT` creates the database/relation if they don't already exist.
- **Lightweight client library** — `jpdb-commons.js` wraps request-building and AJAX calls, keeping application code focused on UI/UX rather than HTTP plumbing.
- **Fast for small-to-medium apps and prototypes** — well suited to coursework, micro-projects, and internal tools where spinning up a full backend would be overkill.

---

## Project Status

**Active** — core Create / Read / Update / Reset flow is complete and functional. Styling uses a dark console/terminal theme.

Planned next steps:
- [ ] Add a Delete/Archive action
- [ ] Add client-side date validation (deadline must be after assignment date)
- [ ] Capture real screenshots for the Illustrations section
- [ ] Add a loading state during AJAX calls

---

## Release History

| Version | Date | Notes |
|---|---|---|
| `v0.1.0` | 2026-07-02 | Initial working form: Save / Update / Reset against `COLLEGE-DB.PROJECT-TABLE`. |
| `v0.2.0` | 2026-07-03 | Restyled UI as a dark console/terminal dashboard; added live status indicator. |


---

## Sources

- [JsonPowerDB Documentation](https://login2explore.com/jpdb/docs.html)
- [JsonPowerDB API Reference (`jpdb-commons.js`)](https://login2explore.com/jpdb/resources/js/0.0.4/jpdb-commons.js)
- [Bootstrap 3.4.1 Documentation](https://getbootstrap.com/docs/3.4/)
- Login2Explore Micro-Internship assignment brief (Project Management Form)

---

## Other Information

- **Author:** Arya Shukla
- **Built for:** Login2Explore JsonPowerDB Micro-Internship
- **Tech stack:** HTML5, CSS3, JavaScript (ES5), jQuery 3.5.1, Bootstrap 3.4.1, JsonPowerDB
- **License:** MIT — free to use and adapt for learning purposes.
