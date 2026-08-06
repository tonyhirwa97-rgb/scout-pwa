# Scout — deployment guide

Everything here is free. No credit card, no npm install, no terminal
commands required. Two short setup steps, then you're live.

---

## Step 1 — Set up the backend (Google Apps Script)

This is where submissions get stored and where your email alerts come from.

1. Go to [sheets.new](https://sheets.new) and create a blank spreadsheet.
   Name it "Scout Data" (or anything you like).
2. In the sheet, click **Extensions → Apps Script**.
3. Delete whatever's in the code editor and paste in the entire contents
   of `apps-script/Code.gs` (included in this folder).
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**. Google will ask you to authorize — click through
   (you'll see a warning screen since this is your own unverified
   script; click "Advanced" → "Go to [project name] (unsafe)" → Allow).
8. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

Keep that URL — you'll need it in Step 3.

---

## Step 2 — Set your WhatsApp group link

Open your WhatsApp group → group info → **Invite to group via link** →
copy the link. It looks like `https://chat.whatsapp.com/XXXXXXXXXXXX`.

---

## Step 3 — Fill in config.js

Open `config.js` in this folder in any text editor (even Notepad) and
replace the two placeholder values:

```js
window.SCOUT_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/.../exec",   // from Step 1
  WHATSAPP_GROUP_LINK: "https://chat.whatsapp.com/XXXXXXXXXXXX", // from Step 2
};
```

Save the file.

---

## Step 4 — Host it (Netlify, free, drag-and-drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this **entire folder** onto the page
3. Netlify gives you a live URL in seconds, e.g. `random-name-123.netlify.app`
4. (Optional) In Netlify's site settings, click "Change site name" to
   get a nicer URL, e.g. `scout-zambia.netlify.app` — still free

That's it. That URL is now your live Scout PWA. Anyone who opens it on
their phone can tap "Add to Home Screen" and it behaves like an app.

---

## How you'll actually see who's interested

- **Live numbers in the app itself**: tap the small chart icon on the
  landing page (top-right corner) — it shows visits, taps, and
  completions pulled live from your Sheet.
- **The raw data**: open your "Scout Data" Google Sheet any time. Three
  tabs — Visits, Interested, Submissions — fill in automatically.
- **Instant alerts**: every time someone completes a request, you get
  an email automatically (sent to the Google account you used to set
  up the script). No extra setup needed for this — it's built in.

---

## Updating the app later

If you want to change copy, categories, or budgets, edit `app.js` —
everything is near the top of the file in plain arrays (`CATEGORIES`,
`BUDGETS`). Save the file, drag the folder onto Netlify Drop again to
redeploy.

---

## A note on limits (all still free)

- Google Apps Script: 20,000 web app requests/day on a personal
  account — far more than a validation-phase app needs.
- Gmail sending via MailApp: 100 emails/day on a personal Google
  account — one email per completed request, so this covers roughly
  100 requests/day for free.
- Netlify free tier: 100GB bandwidth/month — a lightweight app like
  this would need tens of thousands of visits to get close.

If you ever outgrow these, it means the validation worked — a good
problem to have, and a sign it's time to invest in real infrastructure.
