---
workflow: design
step: 6
total_steps: 7
id: accessibility-audit
name: Accessibility Audit
---

# Step 6/7: Accessibility Audit

> Ensure WCAG 2.1 AA compliance by design

## Objective

Bake accessibility into the design, not bolt it on later.

## Inputs Required

- Component strategy from Step 5
- User journeys

## Outputs Produced

- Accessibility requirements
- Testing approach

---

## Step 6: Accessibility Audit

### Your Objective
Ensure the design is accessible from the start, not as a remediation.

### WCAG 2.1 AA Checklist

**Perceivable**
- [ ] Color contrast ratio >= 4.5:1 for text
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss
- [ ] Alt text strategy for images

**Operable**
- [ ] All functionality keyboard accessible
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip navigation available

**Understandable**
- [ ] Labels clearly associated with inputs
- [ ] Error messages identify the issue and suggest fix
- [ ] Consistent navigation patterns
- [ ] No unexpected context changes

**Robust**
- [ ] Valid, semantic HTML structure
- [ ] ARIA used correctly (when needed)
- [ ] Works with assistive technologies

### Testing Approach
- Keyboard-only navigation test
- Screen reader testing (VoiceOver/NVDA)
- Color contrast automated checks
- Reduced motion preference respect

### Output
Accessibility requirements document with specific criteria per component.

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Would a user with disabilities have an equivalent experience?**


## Tips

- 💡 Accessibility is not just for disabled users - it helps everyone
- 💡 Test with real assistive technology, not just automated tools
- 💡 Document the a11y tree structure for key pages


---

## Navigation

⬅️ Previous: [Define Component Strategy](./component-strategy.md)

➡️ Next: [Finalize Frontend Specification](./finalize-frontend-spec.md)

---

_UX Design workflow - Step 6 of 7_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: ux-designer_
