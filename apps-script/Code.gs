/**
 * Scout — Google Apps Script backend
 * -----------------------------------
 * Free backend for the Scout PWA. Every visit, tap, and completed
 * request lands as a row in this spreadsheet. Completed requests
 * also trigger an email to you.
 *
 * SETUP (one time):
 * 1. Create a new Google Sheet (sheets.new).
 * 2. Extensions -> Apps Script.
 * 3. Delete anything in the editor and paste this whole file in.
 * 4. Click Deploy -> New deployment -> type: "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize when prompted, then copy the Web App URL.
 * 6. Paste that URL into config.js as SCRIPT_URL.
 *
 * That's it — no billing, no server, no npm install.
 */

const SHEET_NAMES = {
  visit: "Visits",
  interest: "Interested",
  submission: "Submissions",
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
        "Timestamp", "Categories", "Details", "Budget", "Name", "Phone", "Area",
      ]);
      sheet.appendRow([
        new Date(),
        (body.categories || []).join(", "),
        body.want || "",
        body.budget || "",
        body.name || "",
        body.phone || "",
        body.area || "",
      ]);
      notifyNewRequest(body);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function notifyNewRequest(body) {
  try {
    const to = Session.getActiveUser().getEmail();
    if (!to) return; // no owner email available, skip silently
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
    ];
    MailApp.sendEmail(to, subject, lines.join("\n"));
  } catch (err) {
    // Don't let a failed email break the submission
  }
}

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || "stats";
  if (action !== "stats") {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  function countRows(name) {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return 0;
    const last = sheet.getLastRow();
    return Math.max(0, last - 1); // minus header row
  }

  const visits = countRows(SHEET_NAMES.visit);
  const interested = countRows(SHEET_NAMES.interest);

  const subSheet = ss.getSheetByName(SHEET_NAMES.submission);
  const catCounts = {};
  const budgetCounts = {};
  let total = 0;

  if (subSheet && subSheet.getLastRow() > 1) {
    const rows = subSheet.getRange(2, 1, subSheet.getLastRow() - 1, 7).getValues();
    total = rows.length;
    rows.forEach((row) => {
      const categories = String(row[1] || "").split(",").map((s) => s.trim()).filter(Boolean);
      categories.forEach((c) => {
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      const budget = row[3];
      if (budget) budgetCounts[budget] = (budgetCounts[budget] || 0) + 1;
    });
  }

  const stats = { visits, interested, total, catCounts, budgetCounts };

  return ContentService.createTextOutput(JSON.stringify(stats))
    .setMimeType(ContentService.MimeType.JSON);
}
