---
workflow: architect
step: 3
total_steps: 5
id: define-data-models
name: Define Data Models
---

# Step 3/5: Define Data Models

> Design the data structures and relationships

## Objective

Define entities, value objects, and their relationships.

## Inputs Required

- Components from Step 2
- Existing data models

## Outputs Produced

- Entity definitions
- Relationship diagram

---

## Step 3: Define Data Models

### Your Objective
Design the data structures that support the feature requirements.

### Process
1. Identify entities (things with identity)
2. Identify value objects (things defined by attributes)
3. Define relationships (1:1, 1:N, N:N)
4. Consider data lifecycle (create, update, delete)

### For Each Entity
```
**[Entity Name]**
Type: Entity | Value Object | Aggregate Root
Properties:
- [name]: [type] - [description]
Relationships:
- [relationship type] with [other entity]
Invariants:
- [business rule that must always be true]
```

### Guidelines
- Start with the domain model, not the database
- Identify aggregate boundaries
- Consider eventual consistency needs

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Are the data models normalized? Do they support all use cases?**



---

## Navigation

⬅️ Previous: [Design Components](./design-components.md)

➡️ Next: [Define API Contracts](./define-apis.md)

---

_Architecture workflow - Step 3 of 5_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: architect_
