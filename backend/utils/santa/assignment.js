const { shuffle } = require("../shuffle");

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

module.exports = {
    generateAssignments
}