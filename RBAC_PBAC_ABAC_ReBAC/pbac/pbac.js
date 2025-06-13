const fs = require("fs");

function checkPBACAccess(user, action, resource, context) {
  const policy = JSON.parse(fs.readFileSync("pbac-policy.json"));
  const allowed = policy.policies.some((p) => {
    const userMatch = p.user === user;
    const actionMatch = p.action === action;
    const resourceMatch = p.resource === resource;
    const conditionMatch =
      !p.conditions || p.conditions.department === context.department;
    return (
      p.effect === "allow" &&
      userMatch &&
      actionMatch &&
      resourceMatch &&
      conditionMatch
    );
  });
  return allowed;
}

// Test
const context = { department: "HR" };
console.log(checkPBACAccess("Alice", "read", "doc1", context)); // true
console.log(checkPBACAccess("Alice", "read", "doc1", { department: "IT" })); // false
