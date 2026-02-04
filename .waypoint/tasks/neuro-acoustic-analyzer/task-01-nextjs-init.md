# Task 01: Initialize Next.js Project

> **Phase**: 1 - Foundation
> **Complexity**: Small
> **Dependencies**: None
> **Status**: Pending

## Description

Set up a new Next.js 14+ project with TypeScript, Tailwind CSS, and the App Router. This is the foundation for the entire frontend application.

## Acceptance Criteria

- [ ] Next.js project created with `create-next-app`
- [ ] TypeScript configured
- [ ] Tailwind CSS installed and configured
- [ ] App Router structure in place (`app/` directory)
- [ ] ESLint configured
- [ ] Project runs locally with `npm run dev`
- [ ] Basic folder structure created

## Implementation Steps

### 1. Create Next.js Project

```bash
npx create-next-app@latest neuro-acoustic-analyzer --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Or if adding to existing directory:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Verify Configuration

Ensure `tsconfig.json` has proper paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. Create Folder Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   ├── analysis/
│   ├── youtube/
│   └── api/
├── hooks/
├── providers/
└── config/
```

### 4. Update globals.css

Ensure Tailwind directives are present:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Install Additional Dependencies

```bash
npm install zod socket.io-client
npm install -D @types/node
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/page.tsx` | Modify (basic home page) |
| `src/app/layout.tsx` | Modify (root layout) |
| `src/components/.gitkeep` | Create |
| `src/lib/.gitkeep` | Create |
| `src/hooks/.gitkeep` | Create |
| `src/providers/.gitkeep` | Create |
| `src/config/env.ts` | Create |

## Testing

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes
- [ ] Homepage loads at `http://localhost:3000`

## Notes

- Use Next.js 14+ for best App Router support
- Keep `src/` directory for cleaner imports
- Set up path aliases (`@/`) from the start

---

_Task 01 of 28 - neuro-acoustic-analyzer_
