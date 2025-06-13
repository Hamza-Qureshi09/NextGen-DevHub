const fs = require("fs");

function checkTimeCondition(condition) {
  const now = new Date().toTimeString().slice(0, 5);
  return now >= condition.gte && now <= condition.lte;
}

function checkABACAccess(attributes) {
  const policy = JSON.parse(fs.readFileSync("abac-policy-advanced.json"));
  const allowed = policy.policies.some((p) => {
    return Object.entries(p.conditions).every(([key, value]) => {
      if (key === "environment.time") {
        return checkTimeCondition(value);
      }
      return attributes[key] === value;
    });
  });
  return allowed;
}

// Test (assuming time is between 09:00 and 17:00)
const attributes = {
  "user.department": "HR",
  "resource.department": "HR",
  action: "read",
  "resource.type": "document",
};
console.log(checkABACAccess(attributes)); // true
console.log(checkABACAccess({ ...attributes, "resource.type": "image" })); // false
