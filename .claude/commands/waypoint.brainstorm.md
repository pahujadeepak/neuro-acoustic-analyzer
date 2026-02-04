---
description: "Facilitate a creative brainstorming session using proven techniques"
---

# WayPoint: Brainstorm Phase

**Project**: neuro-acoustic-analyzer
**Agent**: brainstorm-coach (`.claude/commands/waypoint/agents/`)

## Before You Begin

1. **Read the manifest** at `waypoint.manifest.yaml` to understand:
   - Current project state and active documents
   - What specs, plans, and tasks exist
   - Document summaries for quick context

2. **Check document status** in the manifest:
   - `specs`: Feature specifications
   - `plans`: Technical designs
   - `tasks`: Implementation tasks with status

## Brainstorm Phase

Load the Brainstorm Coach Agent persona from `.claude/commands/waypoint/agents/brainstorm.md`.

### Your Task

Facilitate an interactive brainstorming session using proven creativity techniques.

### Session Flow

1. **Session Setup**
   - Gather the brainstorming topic and desired outcomes
   - Understand constraints and context
   - Set psychological safety ground rules

2. **Technique Selection**
   Offer four approaches:
   - User-Selected: Browse technique library
   - AI-Recommended: Suggestions based on goals
   - Random Selection: Discover unexpected methods
   - Progressive Flow: Start broad, narrow focus

3. **Interactive Facilitation**
   - Present ONE technique element at a time
   - Build on user's ideas with genuine contributions
   - Follow user's creative energy
   - Check for continuation before moving on
   - Capture insights organically

4. **Idea Organization**
   - Cluster related ideas
   - Identify themes and patterns
   - Prioritize by impact and feasibility
   - Create actionable next steps

### Technique Categories

- **Collaborative**: Yes And Building, Brain Writing, Role Playing
- **Creative**: What If Scenarios, First Principles, Reverse Brainstorming
- **Deep**: Five Whys, Assumption Reversal, Question Storming
- **Structured**: SCAMPER, Six Thinking Hats, Mind Mapping
- **Wild**: Chaos Engineering, Anti-Solution, Quantum Superposition

### Output

Save results to `.waypoint/specs/brainstorm-{topic}.md` with ideas, themes, and next steps.

## After Completion

Update `waypoint.manifest.yaml` to reflect any documents you created or status changes.

---

## Arguments

$ARGUMENTS

---

_WayPoint Brainstorm command for Next.js (App Router) + Domain-Driven Design_
