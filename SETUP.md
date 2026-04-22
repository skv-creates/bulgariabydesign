# Setup

## Local development

```bash
npm install
cp .env.example .env.local
# fill GOOGLE_SHEET_WEBHOOK_URL — see below
npm run dev
```

## Google Sheet for the "Подкрепи" form

The support form submits emails to a Google Sheet via a Google Apps Script
web app. No third-party service, no API keys.

### 1. Create the sheet

1. Go to https://sheets.new and name it (e.g. `BBD — Supporters`).
2. In row 1, add headers: `Timestamp` | `Email` | `Source`.

### 2. Add the script

1. In the sheet: `Extensions → Apps Script`.
2. Replace the default code with:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const body = JSON.parse(e.postData.contents);
  sheet.appendRow([
    body.submittedAt || new Date().toISOString(),
    body.email || "",
    body.source || "",
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Save (disk icon).

### 3. Deploy as a web app

1. `Deploy → New deployment`.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Click `Deploy`, authorize when prompted.
6. Copy the **Web app URL**.

### 4. Add the URL to env

Local: put it in `.env.local`:

```
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec
```

Production (Vercel):

```bash
vercel env add GOOGLE_SHEET_WEBHOOK_URL production
```

Or via the Vercel dashboard → Project → Settings → Environment Variables.

### Notes

- Apps Script web apps allow anonymous POST. There is no auth on the endpoint
  — rate-limit spam with `BotID` or a simple honeypot field if abuse appears.
- Each code change in Apps Script requires creating a **new deployment version**
  (or managing the existing one from `Deploy → Manage deployments`) for the
  live URL to reflect it.
