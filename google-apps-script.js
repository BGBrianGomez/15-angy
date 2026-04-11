const SPREADSHEET_ID = "1O2Wp0bP8MEaYwv1tNcNJfYoj1zZq1ZJh4yEXvXrIr8I";
const SHEET_NAME = "Respuestas";

const HEADERS = [
  "Fecha de respuesta",
  "Nombre",
  "Asistencia",
  "Cantidad de personas",
  "Acompanantes",
  "Cancion",
  "Mensaje",
];

function doPost(e) {
  const sheet = getSheet();
  ensureHeaders(sheet);

  const data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attendance === "yes" ? "Si asiste" : "No asiste",
    data.guests || 0,
    Array.isArray(data.guestNames) ? data.guestNames.join(", ") : "",
    data.song || "",
    data.message || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const existingSheet = spreadsheet.getSheetByName(SHEET_NAME);

  return existingSheet || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getValues()[0];

  const hasHeaders = HEADERS.every((header, index) => currentHeaders[index] === header);

  if (!hasHeaders) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}
