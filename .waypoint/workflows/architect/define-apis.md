---
workflow: architect
step: 4
total_steps: 5
id: define-apis
name: Define API Contracts
---

# Step 4/5: Define API Contracts

> Design the interfaces between components

## Objective

Define clear contracts for component interactions.

## Inputs Required

- Components from Step 2
- User scenarios from spec

## Outputs Produced

- API contracts
- Sequence diagrams for key flows

---

## Step 4: Define API Contracts

### Your Objective
Define how components communicate with each other.

### API Types to Consider
- **External APIs** - REST/GraphQL endpoints for clients
- **Internal APIs** - Service interfaces between layers
- **Events** - Async communication between components

### For Each API
```
**[API Name]**
Type: REST | GraphQL | Internal | Event
Endpoint/Method: [path or method signature]
Input: [request body/parameters]
Output: [response structure]
Errors: [possible error responses]
Auth: [authentication requirements]
```

### Sequence Diagrams
For complex flows, show the sequence:
```
User -> Controller -> Service -> Repository -> Database
```

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Do these APIs support all user scenarios? Clear contracts?**



---

## Navigation

⬅️ Previous: [Define Data Models](./define-data-models.md)

➡️ Next: [Finalize Technical Plan](./finalize-plan.md)

---

_Architecture workflow - Step 4 of 5_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: architect_
