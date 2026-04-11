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
  try {
    const sheet = getSheet();
    ensureHeaders(sheet);

    const data = parseRequestData(e);
    saveResponse(sheet, data);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: "RSVP endpoint activo" });
}

function testDoPost() {
  const fakeEvent = {
    parameter: {
      name: "Prueba local",
      attendance: "yes",
      guests: "2",
      guestNames: JSON.stringify(["Acompanante de prueba"]),
      song: "Cancion de prueba",
      message: "Mensaje de prueba",
    },
  };

  doPost(fakeEvent);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const existingSheet = spreadsheet.getSheetByName(SHEET_NAME);

  return existingSheet || spreadsheet.insertSheet(SHEET_NAME);
}

function parseRequestData(e) {
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    return {
      name: e.parameter.name || "",
      attendance: e.parameter.attendance || "",
      guests: Number(e.parameter.guests || 0),
      guestNames: parseGuestNames(e.parameter.guestNames),
      song: e.parameter.song || "",
      message: e.parameter.message || "",
    };
  }

  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents || "{}");
  }

  return {
    name: "",
    attendance: "",
    guests: 0,
    guestNames: [],
    song: "",
    message: "",
  };
}

function parseGuestNames(value) {
  if (!value) return [];

  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    return String(value)
      .split(",")
      .map(function (name) {
        return name.trim();
      })
      .filter(Boolean);
  }
}

function saveResponse(sheet, data) {
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attendance === "yes" ? "Si asiste" : "No asiste",
    data.guests || 0,
    Array.isArray(data.guestNames) ? data.guestNames.join(", ") : "",
    data.song || "",
    data.message || "",
  ]);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
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
