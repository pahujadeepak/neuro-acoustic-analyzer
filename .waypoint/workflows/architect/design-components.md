---
workflow: architect
step: 2
total_steps: 5
id: design-components
name: Design Components
---

# Step 2/5: Design Components

> Define the major components and their responsibilities

## Objective

Design the component structure following architecture patterns.

## Inputs Required

- Spec summary from Step 1
- Architecture pattern from constitution

## Outputs Produced

- Component diagram
- Component responsibilities

---

## Step 2: Design Components

### Your Objective
Break the feature into components that follow the project's architecture pattern.

### Process
1. Review the architecture pattern in constitution.md
2. Identify which layers are affected
3. Define components for each layer
4. Ensure dependencies point in the right direction

### For Each Component
```
**[Component Name]**
Layer: [Domain/Application/Infrastructure/Presentation]
Responsibility: [Single clear purpose]
Dependencies: [What it depends on]
Interface: [Key public methods/APIs]
```

### Guidelines
- One component = one responsibility
- Components should be testable in isolation
- Follow existing patterns in the codebase

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Do the components follow our architecture pattern? Clear boundaries?**



---

## Navigation

⬅️ Previous: [Review Specification](./review-spec.md)

➡️ Next: [Define Data Models](./define-data-models.md)

---

_Architecture workflow - Step 2 of 5_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: architect_
