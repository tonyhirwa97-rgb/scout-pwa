# Scout

Your personal shopping agent — a PWA that lets people (and groups, via
Scout Circles) ask for what they need, and only pay after delivery.

## Stack

- **Frontend**: React + Vite + Tailwind CSS, Framer Motion, lucide-react, Recharts
- **Backend**: a Netlify Function (`netlify/functions/scout.js`) talking
  directly to the Google Sheets API — no more Apps Script
- **Data store**: a Google Sheet, exactly as before (Visits, Interested,
  Submissions, Circles tabs)
- **Hosting**: Netlify, connected to this GitHub repo. Every push to
  `main` deploys the frontend *and* the backend function automatically.

## Why this changed from Apps Script

The old backend lived in Google Apps Script, which isn't part of any
git repository — every backend change meant manually pasting code into
a browser editor and redeploying by hand. Now the backend is just
another file in this repo. Push once, both sides update.

## One-time setup this version needs

The Google Sheets API requires a **service account** — a machine
identity Google issues so code (rather than a person) can read and
write to a specific Sheet. This is a one-time setup:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
   and create a new project (or reuse one).
2. **APIs & Services → Library** → search "Google Sheets API" → **Enable**.
3. **APIs & Services → Credentials → Create Credentials → Service account**.
   Give it any name (e.g. "scout-backend").
4. Open the service account you just created → **Keys** tab → **Add key
   → Create new key → JSON**. This downloads a `.json` file — keep it
   private, never commit it to GitHub.
5. Inside that JSON file, find `client_email` and `private_key`.
6. Open your **Scout Data** Google Sheet → **Share** → paste in the
   `client_email` value (looks like
   `something@project-id.iam.gserviceaccount.com`) → give it **Editor**
   access → Share. This is what actually grants the function access.
7. Copy your Sheet's ID from its URL:
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

### Setting the environment variables in Netlify

Netlify → your site → **Site configuration → Environment variables → Add a variable**, three times:

| Key | Value |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | the `client_email` from the JSON file |
| `GOOGLE_PRIVATE_KEY` | the `private_key` from the JSON file (paste it exactly as-is, including `-----BEGIN PRIVATE KEY-----` and the `\n` characters) |
| `GOOGLE_SHEET_ID` | the Sheet ID from step 7 |

After adding these, trigger one deploy (Netlify → Deploys → **Trigger
deploy → Deploy site**) so the function picks them up.

## Optional: email notifications

The old Apps Script version emailed you on every completed request
using Gmail directly. Netlify Functions don't have a built-in mail
sender, so this version supports an optional free provider instead
([Resend](https://resend.com), no card required for low volume):

1. Sign up at resend.com, verify your email, grab an API key.
2. Add two more environment variables in Netlify:
   - `RESEND_API_KEY`
   - `NOTIFY_EMAIL` (your own email address)

If these aren't set, the app still works fine — it just won't send
email alerts.

## The one file you edit directly

`public/config.js` — just your WhatsApp group link. Change it, push,
done.

## Local development (optional)

```
npm install
npm run dev
```

Note: `npm run dev` won't run the backend function locally without the
[Netlify CLI](https://docs.netlify.com/cli/get-started/) (`netlify dev`
instead of `vite` directly). Not required — pushing to `main` and
testing on the live site works fine without it.
