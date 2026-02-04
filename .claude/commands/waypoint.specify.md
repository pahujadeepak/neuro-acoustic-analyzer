---
description: "Create a specification document for a feature"
---

# WayPoint: Specify Phase

**Project**: neuro-acoustic-analyzer
**Agent**: product-manager (`.claude/commands/waypoint/agents/`)

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

**Flow file**: `.waypoint/workflows/specify/_flow.yaml`
**Steps**: 7

### Step Overview

   1. **Gather Context** - Understand what the user wants to build
   2. **Define User Personas** - Identify and describe the users of this feature
   3. **Map User Scenarios** - Define how each persona will interact with the feature
   4. **Define Functional Requirements** - Document what the system must do
   5. **Define Non-Functional Requirements** - Document quality attributes and constraints
   6. **Finalize Specification** - Compile everything into the final spec document
   7. **Compliance & Security Review** - Review specification for compliance and security considerations

### How to Execute

**Option A: Follow steps interactively**
1. Read each step file in `.waypoint/workflows/specify/`
2. Complete the step's objective
3. Confirm the checkpoint before proceeding
4. Move to the next step

**Option B: Quick reference (experienced users)**
- Step 1: `.waypoint/workflows/specify/gather-context.md`
- Step 2: `.waypoint/workflows/specify/define-personas.md`
- Step 3: `.waypoint/workflows/specify/user-scenarios.md`
- Step 4: `.waypoint/workflows/specify/functional-requirements.md`
- Step 5: `.waypoint/workflows/specify/non-functional-requirements.md`
- Step 6: `.waypoint/workflows/specify/finalize-spec.md`
- Step 7: `.waypoint/workflows/specify/compliance-review.md`

### Checkpoints

Each step has a checkpoint question. Only proceed when you can answer "yes":

- **Step 1**: Do I understand what we are building and why? Ready to define user personas?
- **Step 2**: Are these personas realistic? Do they cover all user types for this feature?
- **Step 3**: Do these scenarios cover the main use cases? Are there gaps in the user journey?
- **Step 4**: Does each requirement trace back to a user scenario? Are priorities clear?
- **Step 5**: Are quality attributes measurable? Do they align with constitution principles?
- **Step 6**: Is the spec complete? Are all sections filled in? Ready for architecture phase?
- **Step 7**: Have all compliance requirements been addressed? Are security considerations documented?

### Entry Conditions

- Feature request or idea from user
- Optional: Discovery document from /waypoint.discover

### Final Outputs

- .waypoint/specs/{feature}.md

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Specify command for Next.js (App Router) + Domain-Driven Design_
