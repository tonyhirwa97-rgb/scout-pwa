/**
 * Scout — Google Apps Script backend (v2, with Scout Circles)
 * -------------------------------------------------------------
 * Adds shopping "Circles": a group can share one invite link,
 * everyone's requests get tagged with the same circle code, and
 * anyone with the link can see a live summary of what the circle
 * has asked for so far.
 *
 * UPDATING AN EXISTING DEPLOYMENT (keeps the same URL):
 * 1. Open your existing Apps Script project (script.google.com).
 * 2. Select all the code in Code.gs and replace it with this file.
 * 3. Save (the disk icon).
 * 4. Deploy -> Manage deployments -> click the pencil/edit icon on
 *    your existing deployment -> Version: "New version" -> Deploy.
 * This keeps your Web App URL exactly the same, so config.js does
 * not need to change.
 */

const SHEET_NAMES = {
  visit: "Visits",
  interest: "Interested",
  submission: "Submissions",
  circle: "Circles",
};

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------
// POST — visits, interest taps, and completed submissions
// ---------------------------------------------------------------

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const type = body.type;

    if (type === "visit") {
      const sheet = getOrCreateSheet(SHEET_NAMES.visit, ["Timestamp", "Session"]);
      sheet.appendRow([new Date(), body.sessionId || ""]);
    } else if (type === "interest") {
      const sheet = getOrCreateSheet(SHEET_NAMES.interest, ["Timestamp", "Session"]);
      sheet.appendRow([new Date(), body.sessionId || ""]);
    } else if (type === "submission") {
      const sheet = getOrCreateSheet(SHEET_NAMES.submission, [
        "Timestamp", "Categories", "Details", "Budget", "Name", "Phone", "Area", "CircleCode",
      ]);
      sheet.appendRow([
        new Date(),
        (body.categories || []).join(", "),
        body.want || "",
        body.budget || "",
        body.name || "",
        body.phone || "",
        body.area || "",
        body.circleCode || "",
      ]);
      notifyNewRequest(body);
    }

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function notifyNewRequest(body) {
  try {
    const to = Session.getActiveUser().getEmail();
    if (!to) return;
    const subject = "New Scout request: " + (body.categories || []).join(", ");
    const lines = [
      "A new shopping request just came in.",
      "",
      "Categories: " + (body.categories || []).join(", "),
      "Details: " + (body.want || "—"),
      "Budget: " + (body.budget || "—"),
      "Name: " + (body.name || "—"),
      "Phone: " + (body.phone || "—"),
      "Area: " + (body.area || "—"),
      "Circle: " + (body.circleCode || "— (not part of a circle)"),
    ];
    MailApp.sendEmail(to, subject, lines.join("\n"));
  } catch (err) {
    // Don't let a failed email break the submission
  }
}

// ---------------------------------------------------------------
// GET — stats dashboard, circle creation, circle lookup
// ---------------------------------------------------------------

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || "stats";

  if (action === "stats") return handleStats();
  if (action === "create_circle") return handleCreateCircle(e.parameter);
  if (action === "circle") return handleGetCircle(e.parameter);

  return jsonOut({ ok: false, error: "unknown action" });
}

function countRows(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;
  return Math.max(0, sheet.getLastRow() - 1);
}

function handleStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const visits = countRows(SHEET_NAMES.visit);
  const interested = countRows(SHEET_NAMES.interest);

  const subSheet = ss.getSheetByName(SHEET_NAMES.submission);
  const catCounts = {};
  const budgetCounts = {};
  let total = 0;

  if (subSheet && subSheet.getLastRow() > 1) {
    const rows = subSheet.getRange(2, 1, subSheet.getLastRow() - 1, 8).getValues();
    total = rows.length;
    rows.forEach((row) => {
      String(row[1] || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => {
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      if (row[3]) budgetCounts[row[3]] = (budgetCounts[row[3]] || 0) + 1;
    });
  }

  return jsonOut({ visits, interested, total, catCounts, budgetCounts });
}

function generateCircleCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function handleCreateCircle(params) {
  const sheet = getOrCreateSheet(SHEET_NAMES.circle, [
    "Code", "Name", "CreatorName", "CreatorPhone", "CreatedAt", "FoundingNumber",
  ]);

  const existingCount = Math.max(0, sheet.getLastRow() - 1);
  const foundingNumber = existingCount + 1;

  let code = generateCircleCode();
  // Extremely unlikely to collide at this scale, but check anyway.
  const existingCodes = existingCount > 0
    ? sheet.getRange(2, 1, existingCount, 1).getValues().map((r) => r[0])
    : [];
  while (existingCodes.indexOf(code) !== -1) {
    code = generateCircleCode();
  }

  const name = (params.name || "My Scout Circle").toString().slice(0, 80);
  const creatorName = (params.creatorName || "").toString().slice(0, 80);
  const creatorPhone = (params.creatorPhone || "").toString().slice(0, 40);

  sheet.appendRow([code, name, creatorName, creatorPhone, new Date(), foundingNumber]);

  return jsonOut({
    ok: true,
    code,
    name,
    foundingNumber,
    isFounding: foundingNumber <= 100,
  });
}

function handleGetCircle(params) {
  const code = (params.code || "").toString().toUpperCase().trim();
  if (!code) return jsonOut({ found: false });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const circleSheet = ss.getSheetByName(SHEET_NAMES.circle);
  if (!circleSheet || circleSheet.getLastRow() < 2) return jsonOut({ found: false });

  const rows = circleSheet.getRange(2, 1, circleSheet.getLastRow() - 1, 6).getValues();
  const match = rows.find((r) => String(r[0]).toUpperCase() === code);
  if (!match) return jsonOut({ found: false });

  const [, name, creatorName, , , foundingNumber] = match;

  // Aggregate what this circle has requested so far.
  const subSheet = ss.getSheetByName(SHEET_NAMES.submission);
  const catCounts = {};
  let memberCount = 0;

  if (subSheet && subSheet.getLastRow() > 1) {
    const subRows = subSheet.getRange(2, 1, subSheet.getLastRow() - 1, 8).getValues();
    subRows.forEach((row) => {
      if (String(row[7] || "").toUpperCase() === code) {
        memberCount += 1;
        String(row[1] || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((c) => {
          catCounts[c] = (catCounts[c] || 0) + 1;
        });
      }
    });
  }

  return jsonOut({
    found: true,
    code,
    name,
    creatorName,
    foundingNumber,
    isFounding: foundingNumber <= 100,
    memberCount,
    catCounts,
  });
}
