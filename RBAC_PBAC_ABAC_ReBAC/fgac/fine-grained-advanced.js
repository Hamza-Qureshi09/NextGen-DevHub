const fs = require("fs");

function checkTimeCondition(condition) {
  const now = new Date().toTimeString().slice(0, 5);
  return now >= condition.gte && now <= condition.lte;
}

function checkFineGrainedAccess(user, action, resource) {
  const policy = JSON.parse(
    fs.readFileSync("fine-grained-policy-advanced.json")
  );
  const permission = policy.permissions.find((p) => {
    const resourceMatch =
      p.resource === resource ||
      (p.resource.includes("*") &&
        resource.startsWith(p.resource.slice(0, -1)));
    const actionMatch = p.actions.includes(action);
    const conditionMatch =
      !p.conditions ||
      (p.conditions.time && checkTimeCondition(p.conditions.time));
    return p.user === user && resourceMatch && actionMatch && conditionMatch;
  });
  return !!permission;
}

// Test (assuming time is between 09:00 and 17:00)
console.log(checkFineGrainedAccess("Alice", "read", "doc1")); // true
console.log(checkFineGrainedAccess("Alice", "read", "doc2")); // true
console.log(checkFineGrainedAccess("Bob", "write", "doc2")); // true
console.log(checkFineGrainedAccess("Alice", "write", "doc1")); // false
console.log(checkFineGrainedAccess("Alice", "read", "doc3")); // true
