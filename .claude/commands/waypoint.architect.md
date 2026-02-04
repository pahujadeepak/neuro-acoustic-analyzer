---
description: "Create a technical plan for a specification"
---

# WayPoint: Architect Phase

**Project**: neuro-acoustic-analyzer
**Agent**: architect (`.claude/commands/waypoint/agents/`)

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

**Flow file**: `.waypoint/workflows/architect/_flow.yaml`
**Steps**: 5

### Step Overview

   1. **Review Specification** - Understand the requirements to be architected
   2. **Design Components** - Define the major components and their responsibilities
   3. **Define Data Models** - Design the data structures and relationships
   4. **Define API Contracts** - Design the interfaces between components
   5. **Finalize Technical Plan** - Compile into the final technical plan document

### How to Execute

**Option A: Follow steps interactively**
1. Read each step file in `.waypoint/workflows/architect/`
2. Complete the step's objective
3. Confirm the checkpoint before proceeding
4. Move to the next step

**Option B: Quick reference (experienced users)**
- Step 1: `.waypoint/workflows/architect/review-spec.md`
- Step 2: `.waypoint/workflows/architect/design-components.md`
- Step 3: `.waypoint/workflows/architect/define-data-models.md`
- Step 4: `.waypoint/workflows/architect/define-apis.md`
- Step 5: `.waypoint/workflows/architect/finalize-plan.md`

### Checkpoints

Each step has a checkpoint question. Only proceed when you can answer "yes":

- **Step 1**: Do I understand what needs to be built from an architecture perspective?
- **Step 2**: Do the components follow our architecture pattern? Clear boundaries?
- **Step 3**: Are the data models normalized? Do they support all use cases?
- **Step 4**: Do these APIs support all user scenarios? Clear contracts?
- **Step 5**: Is the plan complete enough for task breakdown? Any gaps?

### Entry Conditions

- Approved specification from /waypoint.specify

### Final Outputs

- .waypoint/plans/{feature}.md

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Architect command for Next.js (App Router) + Domain-Driven Design_
