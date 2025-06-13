const fs = require("fs");

function checkABACAccess(attributes) {
  const policy = JSON.parse(fs.readFileSync("abac-policy.json"));
  const allowed = policy.policies.some((p) => {
    return Object.entries(p.conditions).every(
      ([key, value]) => attributes[key] === value
    );
  });
  return allowed;
}

// Test
const attributes = {
  "user.department": "HR",
  "resource.department": "HR",
  action: "read",
};
console.log(checkABACAccess(attributes)); // true
console.log(checkABACAccess({ ...attributes, "user.department": "IT" })); // false
