const xlsx = require("xlsx");
const path = require("path");

function writeResultCSV(assignments) {
  const ws = xlsx.utils.json_to_sheet(assignments);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "SecretSantaResults");

  const outputPath = path.join(__dirname, "../../uploads/output.csv");
  xlsx.writeFile(wb, outputPath);
  return outputPath;
}

module.exports = {
    writeResultCSV
}