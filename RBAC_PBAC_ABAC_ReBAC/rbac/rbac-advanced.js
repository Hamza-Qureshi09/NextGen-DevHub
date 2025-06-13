const fs = require("fs");

function getPermissions(role, policy, visited = new Set()) {
  if (visited.has(role)) return [];
  visited.add(role);
  let permissions = policy.roles[role] || [];
  permissions = permissions.flatMap((perm) => {
    if (typeof perm === "object" && perm.inherit) {
      return getPermissions(perm.inherit, policy, visited);
    }
    return perm;
  });
  return permissions;
}

function checkRBACAccess(user, action, resource) {
  const policy = JSON.parse(fs.readFileSync("rbac-policy-advanced.json"));
  const userRoles = policy.users[user] || [];
  const permissions = userRoles.flatMap((role) => getPermissions(role, policy));
  return permissions.includes(action);
}

// Test
console.log(checkRBACAccess("Alice", "delete", "doc1")); // true
console.log(checkRBACAccess("Alice", "write", "doc1")); // true
console.log(checkRBACAccess("Bob", "write", "doc1")); // false
console.log(checkRBACAccess("Charlie", "write", "doc1")); // true
console.log(checkRBACAccess("Hamza", "update", "doc1")); // true
console.log(checkRBACAccess("Hamza", "delete", "doc1")); // false
