---
description: "Resolve ambiguities in a specification"
---

# WayPoint: Clarify Phase

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

## Clarification Phase

Load the Analyst Agent persona from `.waypoint/agents/analyst.md`.

### Your Task

Review the specification and identify ambiguities.

1. Read the spec at `.waypoint/specs/[feature-name].md`
2. Identify unclear requirements
3. Find edge cases not covered
4. Check for conflicting requirements
5. Validate against constitution principles

### Questions to Ask

- What happens when [edge case]?
- How should the system behave if [error condition]?
- Is [requirement A] consistent with [requirement B]?
- Does this align with [constitution principle]?

### Output

Update the specification with clarifications, or document open questions.

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Clarify command for Next.js (App Router) + Domain-Driven Design_
