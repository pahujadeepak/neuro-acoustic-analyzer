---
workflow: architect
step: 1
total_steps: 5
id: review-spec
name: Review Specification
---

# Step 1/5: Review Specification

> Understand the requirements to be architected

## Objective

Deeply understand the specification before designing.

## Inputs Required

- .waypoint/specs/{feature}.md
- .waypoint/constitution.md

## Outputs Produced

- Spec summary
- Architecture-relevant requirements identified

---

## Step 1: Review Specification

### Your Objective
Read the specification with an architect's eye - looking for what affects system design.

### Focus On
1. **Functional requirements** that affect component structure
2. **Non-functional requirements** (performance, security, scalability)
3. **Integration points** with existing systems
4. **Data requirements** (what needs to be stored, relationships)

### Questions to Answer
- What are the key entities/domain objects?
- What operations must the system perform?
- What are the critical quality attributes?
- What existing systems must this integrate with?

### Output
Summarize the architecture-relevant requirements in bullet points.

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Do I understand what needs to be built from an architecture perspective?**



---

## Navigation

⬅️ Previous: (Start of workflow)

➡️ Next: [Design Components](./design-components.md)

---

_Architecture workflow - Step 1 of 5_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: architect_
