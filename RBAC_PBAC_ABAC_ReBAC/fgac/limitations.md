Fine-Grained Access Control Limitations
Limitation: Management complexity and performance overhead.
Scenario: Grant Alice access to 1,000 specific documents. You need a policy entry for each document, making the policy file huge and slow to evaluate.

Example
Using fine-grained-policy.json:

json

```bash

{
"permissions": [
{"user": "Alice", "resource": "doc1", "actions": ["read"]},
{"user": "Alice", "resource": "doc2", "actions": ["read"]},
// ... 998 more entries
{"user": "Alice", "resource": "doc1000", "actions": ["read"]}
]
}
```

The policy file grows large, slowing down evaluation (O(n) lookup for each check).
Updating permissions (e.g., adding doc1001) requires editing the JSON manually, prone to errors.
No way to group documents (e.g., by type or department) without external logic.
Impact: Fine-grained control is impractical for large-scale systems with many resources.
