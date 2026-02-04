---
description: "Break down a plan into executable tasks"
---

# WayPoint: Plan Phase

**Project**: neuro-acoustic-analyzer
**Agent**: scrum-master (`.claude/commands/waypoint/agents/`)

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

**Flow file**: `.waypoint/workflows/plan/_flow.yaml`
**Steps**: 4

### Step Overview

   1. **Review Technical Plan** - Understand the plan to be broken into tasks
   2. **Identify Tasks** - Break the plan into atomic tasks
   3. **Sequence & Dependencies** - Order tasks and identify dependencies
   4. **Write Task Files** - Create detailed task files for each task

### How to Execute

**Option A: Follow steps interactively**
1. Read each step file in `.waypoint/workflows/plan/`
2. Complete the step's objective
3. Confirm the checkpoint before proceeding
4. Move to the next step

**Option B: Quick reference (experienced users)**
- Step 1: `.waypoint/workflows/plan/review-plan.md`
- Step 2: `.waypoint/workflows/plan/identify-tasks.md`
- Step 3: `.waypoint/workflows/plan/sequence-tasks.md`
- Step 4: `.waypoint/workflows/plan/write-tasks.md`

### Checkpoints

Each step has a checkpoint question. Only proceed when you can answer "yes":

- **Step 1**: Do I understand what needs to be implemented?
- **Step 2**: Does this task list cover everything in the plan?
- **Step 3**: Is the sequence logical? Are all dependencies identified?
- **Step 4**: Does each task have complete context? No assumptions?

### Entry Conditions

- Approved technical plan from /waypoint.architect

### Final Outputs

- .waypoint/tasks/{feature}/task-*.md

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Plan command for Next.js (App Router) + Domain-Driven Design_
