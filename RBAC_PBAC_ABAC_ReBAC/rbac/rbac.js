const fs = require("fs");

// Load RBAC policy
const policy = JSON.parse(fs.readFileSync("rbac-policy.json"));

// Authorization function
function checkRBACAccess(userName, action, resource) {
  const userRoles = policy.users[userName] || [];
  console.info(userRoles);
  const permissions = userRoles.flatMap((role) => policy.roles[role] || []);
  console.info(permissions);
  return permissions.includes(action);
}

// Test the authorization
console.log(checkRBACAccess("Alice", "write", "doc1")); // true
console.log(checkRBACAccess("Alice", "update", "doc1")); // false
console.log(checkRBACAccess("Bob", "write", "doc1")); // false
console.log(checkRBACAccess("Bob", "read", "doc1")); // true
console.log(checkRBACAccess("Hamza", "update", "doc1")); // true
