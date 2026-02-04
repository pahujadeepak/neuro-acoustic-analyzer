---
description: "Analyze existing codebase or explore problem space"
---

# WayPoint: Discover Phase

**Project**: neuro-acoustic-analyzer
**Agent**: analyst (`.claude/commands/waypoint/agents/`)

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

**Flow file**: `.waypoint/workflows/discover/_flow.yaml`
**Steps**: 4

### Step Overview

   1. **Understand Context** - Gather initial context about what we are exploring
   2. **Explore Landscape** - Survey the technical or problem landscape
   3. **Identify Risks & Constraints** - Surface risks, constraints, and hidden assumptions
   4. **Document Findings** - Compile discovery into actionable document

### How to Execute

**Option A: Follow steps interactively**
1. Read each step file in `.waypoint/workflows/discover/`
2. Complete the step's objective
3. Confirm the checkpoint before proceeding
4. Move to the next step

**Option B: Quick reference (experienced users)**
- Step 1: `.waypoint/workflows/discover/understand-context.md`
- Step 2: `.waypoint/workflows/discover/explore-landscape.md`
- Step 3: `.waypoint/workflows/discover/identify-risks.md`
- Step 4: `.waypoint/workflows/discover/document-findings.md`

### Checkpoints

Each step has a checkpoint question. Only proceed when you can answer "yes":

- **Step 1**: Do I understand what we are trying to discover?
- **Step 2**: Do I have a high-level map of the territory?
- **Step 3**: Have I surfaced the key risks and constraints?
- **Step 4**: Does this document give a clear picture and actionable next steps?

### Entry Conditions

- New project or feature area to explore

### Final Outputs

- .waypoint/specs/discovery.md

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Discover command for Next.js (App Router) + Domain-Driven Design_
