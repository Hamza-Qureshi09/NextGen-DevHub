const fs = require("fs");

function checkPBACAccess(user, action, resource, context) {
  const policy = JSON.parse(fs.readFileSync("pbac-policy-advanced.json"));

  if (!context) return false;

  const sortedPolicies = policy.policies.sort(
    (a, b) => (b.priority || 0) - (a.priority || 0)
  );
  for (const p of sortedPolicies) {
    const userMatch = p.user === user || p.user === "*";
    const actionMatch = p.action === action;
    const resourceMatch =
      p.resource === resource ||
      (p.resource.includes("*") &&
        resource.startsWith(p.resource.slice(0, -1)));
    const conditionMatch =
      !p.conditions || p.conditions.department === context.department;
    if (userMatch && actionMatch && resourceMatch && conditionMatch) {
      return p.effect === "allow";
    }
  }
  return false;
}

// Test
const context = { department: "HR" };
console.log(checkPBACAccess("Alice", "read", "doc1", context)); // true
console.log(checkPBACAccess("Alice", "delete", "doc1", context)); // false
console.log(checkPBACAccess("Alice", "delete", "doc1")); // false
console.log(checkPBACAccess("Bob", "read", "doc1", context)); // false
