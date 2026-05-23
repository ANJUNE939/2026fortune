function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('responses');
  if (!sheet) {
    sheet = ss.insertSheet('responses');
    sheet.appendRow(['timestamp','name','birth','time','gender','calendar','concern','partnerName','partnerBirth','families','reportType','userAgent']);
  }
  var data = {};
  try { data = JSON.parse(e.postData.contents || '{}'); } catch (err) { data = {}; }
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.birth || '',
    data.time || '',
    data.gender || '',
    data.calendar || '',
    data.concern || '',
    data.partnerName || '',
    data.partnerBirth || '',
    data.families || '',
    data.reportType || '',
    data.userAgent || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
