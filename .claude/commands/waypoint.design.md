---
description: "Create UX/UI design from a specification"
---

# WayPoint: Design Phase

**Project**: neuro-acoustic-analyzer
**Agent**: ux-designer (`.claude/commands/waypoint/agents/`)

## Before You Begin

1. **Read the manifest** at `waypoint.manifest.yaml` to understand:
   - Current project state and active documents
   - What specs, plans, and tasks exist
   - Document summaries for quick context

2. **Check document status** in the manifest:
   - `specs`: Feature specifications
   - `plans`: Technical designs
   - `tasks`: Implementation tasks with status

3. **Check for in-progress workflows** in the manifest under `workflows.active`
   - If resuming, continue from the current step
   - If starting fresh, begin at Step 1

## Workflow: Step-by-Step

This phase uses a **step-file workflow** for better control and checkpointing.

**Flow file**: `.waypoint/workflows/design/_flow.yaml`
**Steps**: 7

### Step Overview

   1. **Understand Users Deeply** - Go beyond personas to understand emotional needs
   2. **Define Core Experience** - Articulate the experience principles
   3. **Map User Journeys** - Create visual flow diagrams for key interactions
   4. **Establish Visual Foundation** - Define the visual language philosophy
   5. **Define Component Strategy** - Plan the reusable component library
   6. **Accessibility Audit** - Ensure WCAG 2.1 AA compliance by design
   7. **Finalize Frontend Specification** - Compile into the complete frontend spec

### How to Execute

**Option A: Follow steps interactively**
1. Read each step file in `.waypoint/workflows/design/`
2. Complete the step's objective
3. Confirm the checkpoint before proceeding
4. Move to the next step

**Option B: Quick reference (experienced users)**
- Step 1: `.waypoint/workflows/design/understand-users.md`
- Step 2: `.waypoint/workflows/design/define-experience.md`
- Step 3: `.waypoint/workflows/design/map-user-journeys.md`
- Step 4: `.waypoint/workflows/design/visual-foundation.md`
- Step 5: `.waypoint/workflows/design/component-strategy.md`
- Step 6: `.waypoint/workflows/design/accessibility-audit.md`
- Step 7: `.waypoint/workflows/design/finalize-frontend-spec.md`

### Checkpoints

Each step has a checkpoint question. Only proceed when you can answer "yes":

- **Step 1**: Do I understand what success FEELS like for each user type?
- **Step 2**: Could someone else design to these principles and get a similar feel?
- **Step 3**: Do these journeys cover the critical paths? Happy and unhappy?
- **Step 4**: Would someone see this visual language and "get" the experience principles?
- **Step 5**: Do these components cover all the journeys? Are they truly reusable?
- **Step 6**: Would a user with disabilities have an equivalent experience?
- **Step 7**: Could a developer build from this? Could a designer refine from this?

### Entry Conditions

- Approved specification from /waypoint.specify
- User personas and scenarios defined

### Final Outputs

- .waypoint/specs/{feature}-frontend-spec.md

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Design command for Next.js (App Router) + Domain-Driven Design_
