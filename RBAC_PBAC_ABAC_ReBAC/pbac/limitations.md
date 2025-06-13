PBAC Limitations
Limitation: Policy complexity and potential for errors.
Scenario: You write a complex policy with conflicting rules, leading to unintended access.

Example
Using pbac-policy-advanced.json:

json

```bash

{
  "policies": [
    {
      "id": "policy1",
      "effect": "allow",
      "user": "Alice",
      "action": "read",
      "resource": "doc1",
      "priority": 2
    },
    {
      "id": "policy2",
      "effect": "deny",
      "user": "Alice",
      "action": "read",
      "resource": "doc*",
      "priority": 1
    }
  ]
}
```

The deny rule (doc\*) overrides the allow rule due to higher priority, denying Alice access to doc1 unexpectedly.
Debugging such conflicts is hard, especially with many policies.
Misconfigured priorities or wildcards can lead to security holes (e.g., accidental allows).
Impact: PBAC requires careful policy design and testing to avoid errors.
