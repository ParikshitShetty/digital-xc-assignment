// Utils
const { readEmployeeFile } = require("../utils/santa/employee");
const { writeResultCSV } = require("../utils/santa/csv");
const { generateAssignments } = require("../utils/santa/assignment");

async function processSecretSanta(currentPath, lastYearPath) {
  const currentEmployees = readEmployeeFile(currentPath);
  const lastYearAssignments = readEmployeeFile(lastYearPath);

  const lastYearMap = new Map();
  for (const record of lastYearAssignments) {
    lastYearMap.set(record.Employee_EmailID, record.Secret_Child_EmailID);
  }

  const result = generateAssignments(currentEmployees, lastYearMap);
  return writeResultCSV(result);
}

module.exports = { processSecretSanta };