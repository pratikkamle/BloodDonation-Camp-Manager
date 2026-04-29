const SHEET_NAME = 'DonorData';

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => 
    Object.fromEntries(headers.map((h, i) => [h, row[i]]))
  );
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const payload = JSON.parse(e.postData.contents);
  if (payload.action === 'add') {
    sheet.appendRow(Object.values(payload.donor));
  }
  if (payload.action === 'update') {
    const data = sheet.getDataRange().getValues();
    const idCol = data[0].indexOf('id');
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] == payload.donor.id) {
        Object.keys(payload.donor).forEach((key, ki) => {
          sheet.getRange(i + 1, data[0].indexOf(key) + 1).setValue(payload.donor[key]);
        });
        break;
      }
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
