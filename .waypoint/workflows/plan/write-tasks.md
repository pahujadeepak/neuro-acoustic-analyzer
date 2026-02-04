---
workflow: plan
step: 4
total_steps: 4
id: write-tasks
name: Write Task Files
---

# Step 4/4: Write Task Files

> Create detailed task files for each task

## Objective

Produce self-contained task files that developers can execute.

## Inputs Required

- Sequenced task list from Step 3
- Task template

## Outputs Produced

- .waypoint/tasks/{feature}/task-*.md

---

## Step 4: Write Task Files

### Your Objective
Create task files that contain EVERYTHING a developer needs to execute the task.

### Task File Template
Use `.waypoint/templates/task-template.md`:

```markdown
# Task [NNN]: [Title]

## Context
[Why this task exists, what it's part of]

## Objective
[Single clear goal]

## Dependencies
- [x] Task [NNN]: [title] - completed
- [ ] Task [NNN]: [title] - required

## Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
- [ ] Tests written and passing

## Technical Notes
[Implementation hints, patterns to follow, files to reference]

## Files to Create/Modify
- `path/to/file.ts` - [what to do]
```

### Critical Rule
**NO ASSUMPTIONS** - If a developer needs information, it must be in the task file.

### Output
Save to: `.waypoint/tasks/{feature}/task-001.md`, etc.

Update manifest with task entries.

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Does each task have complete context? No assumptions?**



---

## Navigation

⬅️ Previous: [Sequence & Dependencies](./sequence-tasks.md)

➡️ Next: (End of workflow - finalize outputs)

---

_Planning workflow - Step 4 of 4_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: scrum-master_
