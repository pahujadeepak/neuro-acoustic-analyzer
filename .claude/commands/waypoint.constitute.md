---
description: "Review and customize the project constitution"
---

# WayPoint: Constitute Phase

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

## Constitution Phase

Load the Architect Agent persona from `.waypoint/agents/architect.md`.

### Your Task

Review the generated constitution at `.waypoint/constitution.md`.

1. Verify the architecture principles align with project goals
2. Check that quality standards are appropriate
3. Review security principles
4. Confirm testing requirements

### If Changes Needed

Work with the user to update the constitution. Remember:
- Constitution should be **stable** throughout the project
- Changes require explicit justification
- All agents reference this document

### Output

Confirm the constitution is ready, or document required changes.

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Constitute command for Next.js (App Router) + Domain-Driven Design_
