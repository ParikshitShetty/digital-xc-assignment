const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { shuffle } = require("../utils/shuffle");

function readEmployeeFile(filePath) {
  if (typeof filePath !== 'string') {
    throw new Error('Invalid file path: not a string');
  }
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

function writeResultCSV(assignments) {
  const ws = xlsx.utils.json_to_sheet(assignments);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "SecretSantaResults");

  const outputPath = path.join(__dirname, "../uploads/output.csv");
  xlsx.writeFile(wb, outputPath);
  return outputPath;
}

function isValidAssignment(employee, child, lastYearMap) {
  return (
    employee.Employee_EmailID !== child.Employee_EmailID &&
    lastYearMap.get(employee.Employee_EmailID) !== child.Employee_EmailID
  );
}

function generateAssignments(employees, lastYearMap) {
  const givers = [...employees];
  const receivers = shuffle([...employees]);

  let retries = 0;
  const maxRetries = 1000;
  while (retries < maxRetries) {
    const valid = givers.every((giver, i) =>
      isValidAssignment(giver, receivers[i], lastYearMap)
    );
    if (valid) break;
    retries++;
    shuffle(receivers);
  }

  if (retries === maxRetries) throw new Error("Could not generate valid assignments.");

  return givers.map((giver, i) => ({
    Employee_Name: giver.Employee_Name,
    Employee_EmailID: giver.Employee_EmailID,
    Secret_Child_Name: receivers[i].Employee_Name,
    Secret_Child_EmailID: receivers[i].Employee_EmailID,
  }));
}

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