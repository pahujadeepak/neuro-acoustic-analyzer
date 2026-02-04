---
workflow: architect
step: 5
total_steps: 5
id: finalize-plan
name: Finalize Technical Plan
---

# Step 5/5: Finalize Technical Plan

> Compile into the final technical plan document

## Objective

Create the complete technical plan ready for task breakdown.

## Inputs Required

- All outputs from Steps 1-4

## Outputs Produced

- .waypoint/plans/{feature}.md

---

## Step 5: Finalize Technical Plan

### Your Objective
Compile all architecture decisions into a complete technical plan.

### Document Structure
Use the template at `.waypoint/templates/plan-template.md`:

1. **Overview** - Summary of what we're building
2. **Architecture Alignment** - How this fits the overall architecture
3. **Components** - From Step 2
4. **Data Models** - From Step 3
5. **API Contracts** - From Step 4
6. **Implementation Phases** - Suggested build order
7. **Risks & Mitigations** - Technical risks
8. **ADRs** - Any architecture decision records

### Output
Save to: `.waypoint/plans/{feature-name}.md`

Update manifest with plan entry.

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Is the plan complete enough for task breakdown? Any gaps?**



---

## Navigation

⬅️ Previous: [Define API Contracts](./define-apis.md)

➡️ Next: (End of workflow - finalize outputs)

---

_Architecture workflow - Step 5 of 5_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: architect_
