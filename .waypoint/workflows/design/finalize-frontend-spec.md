---
workflow: design
step: 7
total_steps: 7
id: finalize-frontend-spec
name: Finalize Frontend Specification
---

# Step 7/7: Finalize Frontend Specification

> Compile into the complete frontend spec

## Objective

Create the comprehensive frontend specification.

## Inputs Required

- All outputs from Steps 1-6

## Outputs Produced

- .waypoint/specs/{feature}-frontend-spec.md

---

## Step 7: Finalize Frontend Specification

### Your Objective
Compile all design work into a complete frontend specification.

### Document Structure
```markdown
# Frontend Specification: {Feature Name}

## Executive Summary
[1-paragraph summary of the designed experience]

## User Understanding
[From Step 1 - emotional needs and priorities]

## Experience Principles
[From Step 2 - the 3-5 guiding principles]

## User Journeys
[From Step 3 - Mermaid diagrams with annotations]

## Visual Foundation
[From Step 4 - color, typography, spacing philosophy]

## Component Strategy
[From Step 5 - component inventory and priorities]

## Accessibility Requirements
[From Step 6 - WCAG compliance plan]

## Open Questions
[Anything that needs architect or developer input]

## AI UI Prompts
[Optional: prompts for v0/Lovable/Figma AI to generate initial UI]
```

### Output
Save to: `.waypoint/specs/{feature}-frontend-spec.md`

Update the manifest with the new document.

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Could a developer build from this? Could a designer refine from this?**


## Tips

- 💡 This document bridges product (spec) and engineering (architecture)
- 💡 Include enough for a designer to create high-fidelity mockups
- 💡 Include enough for a developer to understand the intent


---

## Navigation

⬅️ Previous: [Accessibility Audit](./accessibility-audit.md)

➡️ Next: (End of workflow - finalize outputs)

---

_UX Design workflow - Step 7 of 7_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: ux-designer_
