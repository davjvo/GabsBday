/**
 * Gabs' birthday — Google Apps Script backend.
 * Paste this whole file into Extensions > Apps Script of your Google Sheet.
 * See SETUP.md for the step-by-step.
 *
 * Tabs it creates on first use: RSVP, Notes, Songs, Gifts.
 * The site can read Notes, Songs and Gifts (taken or not). RSVP answers
 * are never sent back to the site, only you see them in the Sheet.
 */

// true = new notes stay hidden until you type TRUE in the "approved" column.
var MODERATE_NOTES = false;

var SHEETS = {
  rsvp:  ["time", "name", "attending", "guests", "note", "lang", "guest"],
  note:  ["time", "name", "message", "approved", "lang"],
  song:  ["time", "name", "title", "artist", "key", "lang"],
  gift:  ["time", "giftId", "name", "lang"]
};
var TAB_NAMES = { rsvp: "RSVP", note: "Notes", song: "Songs", gift: "Gifts" };
var MAX = { name: 80, note: 500, message: 400, title: 100, artist: 100, giftId: 40 };

function doGet(e) {
  var kind = (e.parameter.kind || "").toLowerCase();
  if (e.parameter.action !== "list" || ["note", "song", "gift"].indexOf(kind) < 0) {
    return json({ ok: false, error: "bad_request" });
  }
  var rows = readRows(kind);
  var items;
  if (kind === "note") {
    items = rows.filter(function (r) { return r.approved === true || String(r.approved).toUpperCase() === "TRUE"; })
                .map(function (r) { return { name: r.name, message: r.message }; });
  } else if (kind === "song") {
    items = rows.map(function (r) { return { name: r.name, title: r.title, artist: r.artist }; });
  } else {
    items = rows.map(function (r) { return { giftId: r.giftId }; });
  }
  return json({ ok: true, items: items });
}

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: "bad_json" }); }
  var kind = String(data.kind || "");
  if (!SHEETS[kind]) return json({ ok: false, error: "bad_kind" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var name = clean(data.name, MAX.name);
    var lang = data.lang === "es" ? "es" : "en";
    var now = new Date();

    if (kind === "rsvp") {
      if (!name || ["yes", "no"].indexOf(data.attending) < 0) return json({ ok: false, error: "missing" });
      var guests = Math.max(0, Math.min(10, parseInt(data.guests, 10) || 0));
      append(kind, [now, name, data.attending, data.attending === "yes" ? guests : 0, clean(data.note, MAX.note), lang, clean(data.guest, 40)]);
      return json({ ok: true });
    }

    if (kind === "note") {
      var message = clean(data.message, MAX.message);
      if (!name || !message) return json({ ok: false, error: "missing" });
      append(kind, [now, name, message, !MODERATE_NOTES, lang]);
      return json({ ok: true, approved: !MODERATE_NOTES });
    }

    if (kind === "song") {
      var title = clean(data.title, MAX.title), artist = clean(data.artist, MAX.artist);
      if (!name || !title || !artist) return json({ ok: false, error: "missing" });
      // One per person: by personal guest code when the link has ?g=..., otherwise by name.
      var key = normalize(data.guest || name);
      var dup = readRows("song").some(function (r) { return r.key === key; });
      if (dup) return json({ ok: false, error: "duplicate" });
      append(kind, [now, name, title, artist, key, lang]);
      return json({ ok: true });
    }

    if (kind === "gift") {
      var giftId = clean(data.giftId, MAX.giftId);
      if (!name || !giftId) return json({ ok: false, error: "missing" });
      var taken = readRows("gift").some(function (r) { return r.giftId === giftId; });
      if (taken) return json({ ok: false, error: "taken" });
      append(kind, [now, giftId, name, lang]);
      return json({ ok: true });
    }
  } finally {
    lock.releaseLock();
  }
  return json({ ok: false, error: "unknown" });
}

/* ---------- helpers ---------- */
function sheet(kind) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(TAB_NAMES[kind]);
  if (!sh) {
    sh = ss.insertSheet(TAB_NAMES[kind]);
    sh.appendRow(SHEETS[kind]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, SHEETS[kind].length).setFontWeight("bold");
  }
  return sh;
}
function append(kind, row) { sheet(kind).appendRow(row); }
function readRows(kind) {
  var values = sheet(kind).getDataRange().getValues();
  var head = values.shift() || [];
  return values.map(function (v) {
    var o = {};
    head.forEach(function (h, i) { o[h] = v[i]; });
    return o;
  });
}
function clean(v, max) {
  var s = String(v == null ? "" : v).replace(/[\u0000-\u0009\u000B-\u001F]/g, "").trim().slice(0, max);
  // Stop text that starts like a formula from running inside the Sheet.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function normalize(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
