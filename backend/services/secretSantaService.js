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
  const maxRetries = 1000;

  let retries = 0;
  while (retries < maxRetries) {
    const receivers = shuffle([...employees]);
    const assigned = new Set();
    const assignments = [];

    let valid = true;
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i];

      const child = receivers.find((candidate) => {
        return (
          candidate.Employee_EmailID !== giver.Employee_EmailID && // not self
          lastYearMap.get(giver.Employee_EmailID) !== candidate.Employee_EmailID && // not same as last year
          !assigned.has(candidate.Employee_EmailID) // not already assigned
        );
      });

      if (!child) {
        valid = false;
        break;
      }

      assignments.push({
        Employee_Name: giver.Employee_Name,
        Employee_EmailID: giver.Employee_EmailID,
        Secret_Child_Name: child.Employee_Name,
        Secret_Child_EmailID: child.Employee_EmailID,
      });
      assigned.add(child.Employee_EmailID);
    }

    if (valid) return assignments;
    retries++;
  }

  throw new Error("Could not generate valid and unique assignments.");
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