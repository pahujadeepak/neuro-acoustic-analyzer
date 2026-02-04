---
workflow: plan
step: 2
total_steps: 4
id: identify-tasks
name: Identify Tasks
---

# Step 2/4: Identify Tasks

> Break the plan into atomic tasks

## Objective

Create a comprehensive list of tasks covering all implementation work.

## Inputs Required

- Plan summary from Step 1

## Outputs Produced

- Task list with titles and brief descriptions

---

## Step 2: Identify Tasks

### Your Objective
Break the plan into tasks that can each be completed in a single focused session.

### Task Sizing Guidelines
- **Too big**: "Implement authentication" (multiple sessions)
- **Just right**: "Create User entity with password hashing" (1 session)
- **Too small**: "Add import statement" (not standalone)

### Task Categories
- **Foundation**: Setup, configuration, base classes
- **Domain**: Entities, value objects, domain services
- **Application**: Use cases, application services
- **Infrastructure**: Repositories, external integrations
- **Presentation**: Controllers, views, API endpoints
- **Testing**: Unit tests, integration tests, E2E tests

### Output Format
```
1. [Task title] - [Category] - [Brief description]
2. [Task title] - [Category] - [Brief description]
...
```

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Does this task list cover everything in the plan?**



---

## Navigation

⬅️ Previous: [Review Technical Plan](./review-plan.md)

➡️ Next: [Sequence & Dependencies](./sequence-tasks.md)

---

_Planning workflow - Step 2 of 4_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: scrum-master_
