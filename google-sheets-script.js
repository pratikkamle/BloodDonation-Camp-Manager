// ═══════════════════════════════════════════════════════════════
//  BLOOD DONATION CAMP MANAGER — Google Apps Script Backend
//  Maps to columns: First Name, Middle Name, Last Name, Mobile No.,
//  Address, Upasna Kendra, Group, New/Old Shraddhavan, Age,
//  Date of Birth, Gender, Status, Reasons for rejection
// ═══════════════════════════════════════════════════════════════

const SHEET_NAME = 'Sheet1'; // Change this to your actual sheet name

// Column mapping — MUST match your exact Google Sheet headers
const COLUMNS = [
  'First Name',
  'Middle Name',
  'Last Name',
  'Mobile No.',
  'Address',
  'Upasna Kendra',
  'Group',
  'New/Old Shraddhavan',
  'Age',
  'Date of Birth',
  'Gender',
  'Status',
  'Reasons for rejection'
];

// Auto-add ID and timestamp columns if not present
const ID_COL = 'id';
const TIMESTAMP_COL = 'addedAt';

/**
 * GET request — returns all donor data as JSON
 * Called by the app to load existing data
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return jsonResponse({ donors: [] });
    }
    
    const headers = data[0];
    const donors = [];
    
    // Convert rows to objects
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const donor = {};
      
      headers.forEach((header, index) => {
        donor[header] = row[index];
      });
      
      donors.push(donor);
    }
    
    return jsonResponse({ donors: donors });
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * POST request — handles add, update, and bulk operations
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    if (payload.action === 'add') {
      addDonor(sheet, payload.donor);
      return jsonResponse({ success: true, action: 'add' });
    }
    
    if (payload.action === 'update') {
      updateDonor(sheet, payload.donor);
      return jsonResponse({ success: true, action: 'update' });
    }
    
    if (payload.action === 'bulkAdd') {
      bulkAddDonors(sheet, payload.donors);
      return jsonResponse({ success: true, action: 'bulkAdd', count: payload.donors.length });
    }
    
    return jsonResponse({ error: 'Unknown action: ' + payload.action }, 400);
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Get or create the sheet with proper headers
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Check if headers exist, if not, add them
  const data = sheet.getDataRange().getValues();
  if (data.length === 0 || !data[0] || data[0].length === 0) {
    const allHeaders = [ID_COL, ...COLUMNS, TIMESTAMP_COL];
    sheet.getRange(1, 1, 1, allHeaders.length).setValues([allHeaders]);
    sheet.getRange(1, 1, 1, allHeaders.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

/**
 * Add a new donor row
 */
function addDonor(sheet, donor) {
  const row = donorToRow(donor);
  sheet.appendRow(row);
}

/**
 * Update an existing donor by ID
 */
function updateDonor(sheet, donor) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(ID_COL);
  
  if (idIndex === -1) {
    throw new Error('ID column not found');
  }
  
  // Find the row with matching ID
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(donor.id)) {
      const row = donorToRow(donor);
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  
  // If not found, add as new
  addDonor(sheet, donor);
}

/**
 * Bulk add multiple donors
 */
function bulkAddDonors(sheet, donors) {
  if (!donors || donors.length === 0) return;
  
  const rows = donors.map(donor => donorToRow(donor));
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

/**
 * Convert donor object to row array matching sheet column order
 */
function donorToRow(donor) {
  return [
    donor.id || '',
    donor['First Name'] || '',
    donor['Middle Name'] || '',
    donor['Last Name'] || '',
    donor['Mobile No.'] || '',
    donor['Address'] || '',
    donor['Upasna Kendra'] || '',
    donor['Group'] || '',
    donor['New/Old Shraddhavan'] || '',
    donor['Age'] || '',
    donor['Date of Birth'] || '',
    donor['Gender'] || '',
    donor['Status'] || 'Ongoing',
    donor['Reasons for rejection'] || '',
    donor['addedAt'] || new Date().toISOString()
  ];
}

/**
 * Return JSON response with proper headers
 */
function jsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function — run this from Apps Script editor to verify setup
 */
function testSetup() {
  const sheet = getOrCreateSheet();
  Logger.log('Sheet name: ' + sheet.getName());
  Logger.log('Headers: ' + sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]);
  Logger.log('Total rows: ' + sheet.getLastRow());
  Logger.log('✓ Setup verified successfully!');
}