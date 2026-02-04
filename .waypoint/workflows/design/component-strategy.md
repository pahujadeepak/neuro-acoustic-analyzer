---
workflow: design
step: 5
total_steps: 7
id: component-strategy
name: Define Component Strategy
---

# Step 5/7: Define Component Strategy

> Plan the reusable component library

## Objective

Identify patterns that can become reusable components.

## Inputs Required

- User journeys from Step 3
- Visual foundation from Step 4

## Outputs Produced

- Component inventory
- Pattern library plan

---

## Step 5: Define Component Strategy

### Your Objective
Identify UI patterns that should become reusable components.

### Facilitation Questions
1. **What elements appear in multiple journeys?** (buttons, cards, forms)
2. **What's the most complex interaction?** (might need a specialized component)
3. **What framework/library will we use?** (affects component architecture)
4. **Should we build from scratch or use a component library?**

### Component Categories
- **Primitives**: Button, Input, Icon, Typography
- **Composites**: Card, Modal, Dropdown, Table
- **Patterns**: Form layout, Navigation, Data display
- **Features**: Domain-specific complex components

### Component Inventory Format
```
**[Component Name]**
Category: [Primitive/Composite/Pattern/Feature]
Used in: [which journeys]
Variants: [different states/sizes]
Accessibility: [key a11y considerations]
```

### Output
Component inventory with prioritization (build first vs. later).

---

## Checkpoint

Before proceeding to the next step, confirm:

> **Do these components cover all the journeys? Are they truly reusable?**


## Tips

- 💡 Start with what you need, not what might be nice
- 💡 Every component needs loading, error, and empty states
- 💡 Accessibility requirements per component, not as an afterthought


---

## Navigation

⬅️ Previous: [Establish Visual Foundation](./visual-foundation.md)

➡️ Next: [Accessibility Audit](./accessibility-audit.md)

---

_UX Design workflow - Step 5 of 7_
_Project: neuro-acoustic-analyzer | Track: solo | Agent: ux-designer_
