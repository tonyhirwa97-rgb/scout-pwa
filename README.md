# Scout

Your personal shopping agent — a PWA that lets people ask for what they
need, tells them Scout will find it, and only asks for payment after
delivery.

## Stack

- **Frontend**: React + Vite + Tailwind CSS, animated with Framer Motion,
  icons via lucide-react, charts via Recharts
- **Backend**: Google Apps Script Web App → Google Sheet
  (`apps-script/Code.gs`)
- **Hosting**: Netlify, connected to this GitHub repo — every push to
  `main` triggers an automatic build and deploy
- **Notifications**: email alert on every completed request, sent from
  the Google account that owns the Apps Script deployment

## How updates work now

You don't need to do anything to deploy a change. Whoever is editing
the code (including Claude, working from this same repo) pushes to
`main`, and Netlify automatically:

1. Runs `npm install`
2. Runs `npm run build`
3. Publishes the `dist/` folder to your live site

No zip files, no manual uploads.

## The one file you might still want to edit yourself

`public/config.js` holds two values that don't require touching any
code:

```js
window.SCOUT_CONFIG = {
  SCRIPT_URL: "...",           // your Apps Script Web App URL
  WHATSAPP_GROUP_LINK: "...",  // your WhatsApp group invite link
};
```

Changing either of these still requires a redeploy to take effect —
same as any other code change: push to `main` and Netlify rebuilds
automatically.

## Local development (optional — not required for deployment)

```
npm install
npm run dev
```

This is only useful if you're working from a computer. On mobile,
changes are made by editing files directly and pushing — Netlify does
the building for you.

## Backend setup

See `apps-script/Code.gs` for the full backend. If you ever need to
redeploy it fresh:

1. Create a Google Sheet
2. Extensions → Apps Script
3. Paste in `Code.gs`
4. Deploy → New deployment → Web app
   - Execute as: Me
   - Who has access: Anyone
5. Copy the Web App URL into `public/config.js` as `SCRIPT_URL`

Data lands in three tabs: Visits, Interested, Submissions.
