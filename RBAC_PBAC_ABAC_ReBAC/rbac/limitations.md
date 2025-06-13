BAC Limitations
Limitation: Role explosion and lack of flexibility for dynamic conditions.
Scenario: You need to restrict Alice’s access to doc1 during business hours only. RBAC doesn’t support dynamic conditions, so you’d need to create new roles (e.g., Editor_BusinessHours), leading to role explosion.
Example
Using rbac-policy.json:

Alice needs read access to doc1 only from 09:00 to 17:00.
RBAC can’t handle time-based conditions, so you must create a new role:
json

```bash
{
"roles": {
"Editor": ["read", "write"],
"Editor_BusinessHours": ["read"]
},
"users": {
"Alice": ["Editor_BusinessHours"]
}
}
```

You’d need separate logic to enforce time checks outside RBAC, complicating the system.
As conditions grow (e.g., location-based, department-based), the number of roles explodes, making management cumbersome.
Impact: RBAC becomes unwieldy for dynamic or fine-grained access needs.
