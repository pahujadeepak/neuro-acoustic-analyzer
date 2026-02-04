---
description: "Add new stacks, architectures, or modules to WayPoint"
---

# WayPoint: Extend Phase

**Project**: neuro-acoustic-analyzer
**Agent**: module-architect (`.claude/commands/waypoint/agents/`)

## Before You Begin

1. **Read the manifest** at `waypoint.manifest.yaml` to understand:
   - Current project state and active documents
   - What specs, plans, and tasks exist
   - Document summaries for quick context

2. **Check document status** in the manifest:
   - `specs`: Feature specifications
   - `plans`: Technical designs
   - `tasks`: Implementation tasks with status

## Extension Phase

Load the Module Architect Agent persona from `.waypoint/agents/module-architect.md`.

### Your Task

Extend WayPoint with new capabilities.

#### Adding a New Stack

1. Create stack definition in `stacks/[stack-name].yaml`
2. Include:
   - Layer configurations
   - Compatible ORMs
   - Compatible auth strategies
   - File structure conventions
   - Few-shot code examples

#### Adding a New Architecture

1. Create architecture definition in `architectures/[arch-name].yaml`
2. Include:
   - Core principles
   - Layer definitions with rules
   - Anti-patterns to avoid
   - Stack-specific implementations
   - Few-shot examples per stack

#### Adding a New Module

1. Create module definition
2. Define compatibility constraints
3. Provide example implementations

### Output

New module files with complete documentation and examples.

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Extend command for Next.js (App Router) + Domain-Driven Design_
