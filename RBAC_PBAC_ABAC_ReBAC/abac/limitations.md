ABAC Limitations
Limitation: Attribute management and performance overhead.
Scenario: You need to check multiple attributes (e.g., user department, resource type, location, time) for every access request, slowing down the system.

Example
Using abac-policy-advanced.json:

Attributes include user.department, resource.department, resource.type, environment.time, and user.location.
Each access check requires fetching and evaluating all attributes:
javascript

```bash

const attributes = {
  'user.department': 'HR',
  'resource.department': 'HR',
  'action': 'read',
  'resource.type': 'document',
  'environment.time': '10:00',
  'user.location': 'office'
};
```

Fetching attributes (e.g., from a database or IdP) adds latency.
If attributes are missing or inconsistent (e.g., user.location not set), access may be denied incorrectly.
Large attribute sets increase evaluation time, especially with many policies.
Impact: ABAC is slow and complex for systems with many attributes or frequent access checks.
