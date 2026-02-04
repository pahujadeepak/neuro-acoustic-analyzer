---
workflow: plan
step: 3
total_steps: 4
id: sequence-tasks
name: Sequence & Dependencies
---

# Step 3/4: Sequence & Dependencies

> Order tasks and identify dependencies

## Objective

Create a logical sequence that respects dependencies.

## Inputs Required

- Task list from Step 2

## Outputs Produced

- Sequenced task list with dependencies

---

## Step 3: Sequence & Dependencies

### Your Objective
Order tasks so dependencies are built before dependents.

### Dependency Types
- **Hard**: Task B cannot start until Task A is complete
- **Soft**: Task B is easier if Task A is done first
- **None**: Tasks can be done in parallel

### Sequencing Rules
1. Foundation tasks first
2. Domain before Application
3. Application before Infrastructure (in Clean Architecture)
4. Tests alongside or immediately after implementation

### Output Format
```
Phase 1: Foundation
- Task 001: [title] (no dependencies)
- Task 002: [title] (no dependencies)

Phase 2: Domain
- Task 003: [title] (depends on: 001)
- Task 004: [title] (depends on: 001)

Phase 3: Application
- Task 005: [title] (depends on: 003, 004)
...
```

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Is the sequence logical? Are all dependencies identified?**



---

## Navigation

⬅️ Previous: [Identify Tasks](./identify-tasks.md)

➡️ Next: [Write Task Files](./write-tasks.md)

---

_Planning workflow - Step 3 of 4_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: scrum-master_
