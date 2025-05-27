const xlsx = require("xlsx");

function readEmployeeFile(filePath) {
  if (typeof filePath !== 'string') {
    throw new Error('Invalid file path: not a string');
  }
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = {
    readEmployeeFile
}