---
workflow: specify
step: 2
total_steps: 3
id: functional-requirements
name: Define Functional Requirements
---

# Step 2/3: Define Functional Requirements

> Document what the system must do

## Objective

Create a prioritized list of functional requirements that directly support user scenarios.

## Inputs Required

- User scenarios from Step 3

## Outputs Produced

- Prioritized functional requirements (must/should/could)

---

## Step 4: Define Functional Requirements

### Your Objective
Transform user scenarios into specific, testable functional requirements.

### Requirement Format
```
**FR-[Number]: [Title]**
Priority: Must Have | Should Have | Could Have
Scenario: [Which scenario this supports]
Description: [What the system must do]
Acceptance Criteria:
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
```

### Prioritization (MoSCoW)
- **Must Have**: Feature doesn't work without this
- **Should Have**: Important but not critical for MVP
- **Could Have**: Nice to have if time permits
- **Won't Have**: Explicitly out of scope (document these!)

### Guidelines
- Each requirement should be testable
- Avoid implementation details (HOW)
- Focus on behavior (WHAT)
- One requirement = one thing the system does

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Does each requirement trace back to a user scenario? Are priorities clear?**


## Tips

- 💡 If a requirement has "and" in it, split it
- 💡 Ask: "How would I test this?" for each requirement
- 💡 Group related requirements together


---

## Navigation

⬅️ Previous: [Gather Context](./gather-context.md)

➡️ Next: [Finalize Specification](./finalize-spec.md)

---

_Specification workflow - Step 2 of 3_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: product-manager_
