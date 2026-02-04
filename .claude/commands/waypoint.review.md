---
description: "Review implementation for quality and compliance"
---

# WayPoint: Review Phase

**Project**: neuro-acoustic-analyzer
**Agent**: qa (`.claude/commands/waypoint/agents/`)

## Before You Begin

1. **Read the manifest** at `waypoint.manifest.yaml` to understand:
   - Current project state and active documents
   - What specs, plans, and tasks exist
   - Document summaries for quick context

2. **Check document status** in the manifest:
   - `specs`: Feature specifications
   - `plans`: Technical designs
   - `tasks`: Implementation tasks with status

## Review Phase

Load the QA Agent persona from `.waypoint/agents/qa.md`.

### Your Task

Review the implementation against requirements and standards.

1. **Check acceptance criteria** - Does the code meet requirements?
2. **Verify architecture compliance** - Does it follow the patterns?
3. **Review test coverage** - Are edge cases tested?
4. **Check security** - Any vulnerabilities introduced?
5. **Validate code quality** - Lint, types, formatting?

### Review Checklist

- [ ] Acceptance criteria met
- [ ] Architecture patterns followed
- [ ] No anti-patterns introduced
- [ ] Tests are comprehensive
- [ ] Security considerations addressed
- [ ] Code is readable and maintainable

### Output

Approval, or specific feedback for revision.

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Review command for Next.js (App Router) + Domain-Driven Design_
