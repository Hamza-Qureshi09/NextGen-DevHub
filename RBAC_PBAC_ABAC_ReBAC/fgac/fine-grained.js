const fs = require("fs");

function checkFineGrainedAccess(user, action, resource) {
  const policy = JSON.parse(fs.readFileSync("fine-grained-policy.json"));
  const permission = policy.permissions.find(
    (p) =>
      p.user === user &&
      p.actions.includes(action) &&
      (p.resource === resource ||
        (p.resource.includes("*") &&
          resource.startsWith(p.resource.slice(0, -1))))
  );
  return !!permission;
}

// Test
console.log(checkFineGrainedAccess("Alice", "read", "doc1")); // true
console.log(checkFineGrainedAccess("Alice", "read", "doc2")); // false
console.log(checkFineGrainedAccess("Bob", "write", "doc2")); // true
console.log(checkFineGrainedAccess("Bob", "read", "doc2")); // false
console.log(checkFineGrainedAccess("Hamza", "update", "doc3")); // true
console.log(checkFineGrainedAccess("Hamza", "write", "doc1")); // false
