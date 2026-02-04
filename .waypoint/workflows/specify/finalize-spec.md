---
workflow: specify
step: 3
total_steps: 3
id: finalize-spec
name: Finalize Specification
---

# Step 3/3: Finalize Specification

> Compile everything into the final spec document

## Objective

Create the complete specification document ready for architect review.

## Inputs Required

- All outputs from Steps 1-5

## Outputs Produced

- .waypoint/specs/{feature}.md

---

## Step 6: Finalize Specification

### Your Objective
Compile all the work from previous steps into a complete specification document.

### Document Structure
Use the template at `.waypoint/templates/spec-template.md` and fill in:

1. **Overview** - From Step 1 context gathering
2. **User Personas** - From Step 2
3. **User Scenarios** - From Step 3
4. **Functional Requirements** - From Step 4
5. **Non-Functional Requirements** - From Step 5
6. **Out of Scope** - What we explicitly won't do
7. **Open Questions** - Anything unresolved
8. **Appendix** - Supporting materials

### Final Checks
- [ ] All sections completed
- [ ] Requirements are numbered consistently
- [ ] Priorities are assigned
- [ ] Acceptance criteria are testable
- [ ] Out of scope is explicit
- [ ] Open questions are listed

### Output
Save to: `.waypoint/specs/{feature-name}.md`

Update the manifest:
- Add entry to `documents.specs`
- Include summary and keywords
- Set status to `draft`

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Is the spec complete? Are all sections filled in? Ready for architecture phase?**


## Tips

- 💡 Read through the whole spec - does it tell a coherent story?
- 💡 Have the user review before marking complete
- 💡 Note any items that need architect input


---

## Navigation

⬅️ Previous: [Define Functional Requirements](./functional-requirements.md)

➡️ Next: (End of workflow - finalize outputs)

---

_Specification workflow - Step 3 of 3_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: product-manager_
