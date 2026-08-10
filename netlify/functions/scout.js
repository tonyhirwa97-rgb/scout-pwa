// Scout backend — Netlify Function
// ----------------------------------
// Replaces the old Google Apps Script Web App. Deploys automatically
// alongside the frontend, so there's no more manual copy-paste into
// a browser code editor for backend changes.
//
// Requires three environment variables, set once in Netlify's
// dashboard (Site configuration -> Environment variables):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GOOGLE_SHEET_ID
//
// See README.md for the one-time Google Cloud setup steps.

import { google } from "googleapis";

const SHEET_NAMES = {
  visit: "Visits",
  interest: "Interested",
  submission: "Submissions",
  circle: "Circles",
};

const HEADERS = {
  Visits: ["Timestamp", "Session"],
  Interested: ["Timestamp", "Session"],
  Submissions: ["Timestamp", "Categories", "Details", "Budget", "Name", "Phone", "Area", "CircleCode"],
  Circles: ["Code", "Name", "CreatorName", "CreatorPhone", "CreatedAt", "FoundingNumber"],
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(statusCode, body) {
  return { statusCode, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

let cachedSheets = null;
let cachedCreds = null;

function getCredentials() {
  if (cachedCreds) return cachedCreds;

  const rawKeyVar = (process.env.GOOGLE_PRIVATE_KEY || "").trim();
  const emailVar = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "").trim();

  // Accept EITHER the full downloaded service-account JSON file pasted
  // whole into GOOGLE_PRIVATE_KEY, OR just the raw private_key string.
  // Pasting the whole file removes any need for precise mobile text
  // selection - copy the entire file, paste it, done.
  if (rawKeyVar.startsWith("{")) {
    try {
      const parsed = JSON.parse(rawKeyVar);
      cachedCreds = {
        email: parsed.client_email || emailVar,
        key: (parsed.private_key || "").trim(),
      };
      return cachedCreds;
    } catch {
      // fall through to raw-key handling below if JSON parsing fails
    }
  }

  let key = rawKeyVar;
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();

  cachedCreds = { email: emailVar, key };
  return cachedCreds;
}

async function getSheets() {
  if (cachedSheets) return cachedSheets;
  const { email, key } = getCredentials();
  const auth = new google.auth.JWT(email, null, key, ["https://www.googleapis.com/auth/spreadsheets"]);
  await auth.authorize();
  cachedSheets = google.sheets({ version: "v4", auth });
  return cachedSheets;
}

const SHEET_ID = () => process.env.GOOGLE_SHEET_ID;

function colLetter(n) {
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function ensureSheetExists(sheets, tabName) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID() });
  const exists = (meta.data.sheets || []).some((s) => s.properties.title === tabName);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID(),
      requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID(),
      range: `${tabName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS[tabName]] },
    });
  }
}

async function appendRow(sheets, tabName, row) {
  await ensureSheetExists(sheets, tabName);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID(),
    range: `${tabName}!A:Z`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

async function readRows(sheets, tabName, numCols) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID(),
      range: `${tabName}!A2:${colLetter(numCols)}`,
    });
    return res.data.values || [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------

async function handleStats(sheets) {
  const visitRows = await readRows(sheets, SHEET_NAMES.visit, 2);
  const interestRows = await readRows(sheets, SHEET_NAMES.interest, 2);
  const subRows = await readRows(sheets, SHEET_NAMES.submission, 8);

  const catCounts = {};
  const budgetCounts = {};
  subRows.forEach((row) => {
    String(row[1] || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => {
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    if (row[3]) budgetCounts[row[3]] = (budgetCounts[row[3]] || 0) + 1;
  });

  return { visits: visitRows.length, interested: interestRows.length, total: subRows.length, catCounts, budgetCounts };
}

function generateCircleCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

async function handleCreateCircle(sheets, params) {
  await ensureSheetExists(sheets, SHEET_NAMES.circle);
  const existingRows = await readRows(sheets, SHEET_NAMES.circle, 6);
  const foundingNumber = existingRows.length + 1;

  let code = generateCircleCode();
  const existingCodes = existingRows.map((r) => r[0]);
  while (existingCodes.includes(code)) code = generateCircleCode();

  const name = (params.name || "My Scout Circle").toString().slice(0, 80);
  const creatorName = (params.creatorName || "").toString().slice(0, 80);
  const creatorPhone = (params.creatorPhone || "").toString().slice(0, 40);

  await appendRow(sheets, SHEET_NAMES.circle, [
    code, name, creatorName, creatorPhone, new Date().toISOString(), foundingNumber,
  ]);

  return { ok: true, code, name, foundingNumber, isFounding: foundingNumber <= 100 };
}

async function handleGetCircle(sheets, params) {
  const code = (params.code || "").toString().toUpperCase().trim();
  if (!code) return { found: false };

  const circleRows = await readRows(sheets, SHEET_NAMES.circle, 6);
  const match = circleRows.find((r) => String(r[0]).toUpperCase() === code);
  if (!match) return { found: false };

  const [, name, creatorName, , , foundingNumber] = match;

  const subRows = await readRows(sheets, SHEET_NAMES.submission, 8);
  const catCounts = {};
  let memberCount = 0;
  subRows.forEach((row) => {
    if (String(row[7] || "").toUpperCase() === code) {
      memberCount += 1;
      String(row[1] || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => {
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
    }
  });

  return {
    found: true,
    code,
    name,
    creatorName,
    foundingNumber: Number(foundingNumber),
    isFounding: Number(foundingNumber) <= 100,
    memberCount,
    catCounts,
  };
}

async function sendNotificationEmail(body) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return; // Optional — skip silently if not configured

  const lines = [
    "A new shopping request just came in.",
    "",
    `Categories: ${(body.categories || []).join(", ")}`,
    `Details: ${body.want || "—"}`,
    `Budget: ${body.budget || "—"}`,
    `Name: ${body.name || "—"}`,
    `Phone: ${body.phone || "—"}`,
    `Area: ${body.area || "—"}`,
    `Circle: ${body.circleCode || "— (not part of a circle)"}`,
  ];

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Scout <onboarding@resend.dev>",
        to: [to],
        subject: `New Scout request: ${(body.categories || []).join(", ")}`,
        text: lines.join("\n"),
      }),
    });
  } catch {
    // Don't let a failed email break the submission
  }
}

// ---------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  try {
    const sheets = await getSheets();

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const type = body.type;

      if (type === "visit") {
        await appendRow(sheets, SHEET_NAMES.visit, [new Date().toISOString(), body.sessionId || ""]);
      } else if (type === "interest") {
        await appendRow(sheets, SHEET_NAMES.interest, [new Date().toISOString(), body.sessionId || ""]);
      } else if (type === "submission") {
        await appendRow(sheets, SHEET_NAMES.submission, [
          new Date().toISOString(),
          (body.categories || []).join(", "),
          body.want || "",
          body.budget || "",
          body.name || "",
          body.phone || "",
          body.area || "",
          body.circleCode || "",
        ]);
        await sendNotificationEmail(body);
      }

      return json(200, { ok: true });
    }

    if (event.httpMethod === "GET") {
      const params = event.queryStringParameters || {};
      const action = params.action || "stats";

      if (action === "stats") return json(200, await handleStats(sheets));
      if (action === "create_circle") return json(200, await handleCreateCircle(sheets, params));
      if (action === "circle") return json(200, await handleGetCircle(sheets, params));

      return json(400, { ok: false, error: "unknown action" });
    }

    return json(405, { ok: false, error: "method not allowed" });
  } catch (err) {
    return json(500, { ok: false, error: String(err && err.message ? err.message : err) });
  }
};
