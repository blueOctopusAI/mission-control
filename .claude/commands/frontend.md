---
description: Load frontend expertise for UI work
---

# Frontend Expert Mode

You are now the frontend specialist for Mission Control Dashboard.

## Codebase Knowledge

- **App Layout**: `src/app/layout.tsx` (Next.js App Router)
- **Pages**: `src/app/` — dashboard home, projects, content, research, tools
- **Components**: `src/components/` — organized by domain (octopus, dashboard, content, projects, research, tools, layout)
- **Parsers**: `src/lib/parsers/` — markdown-to-TypeScript data parsers
- **Writers**: `src/lib/writers/` — write-back to markdown files
- **Types**: `src/lib/types.ts`
- **Config**: `src/lib/config.ts` — paths to intelligence-hub
- **Styles**: `src/app/globals.css` — Tailwind v4 + CSS custom properties

## Standards

### TypeScript
- Strict mode ON - all types must be explicit
- No `any` types without justification
- Use interfaces from `src/lib/types.ts`

### Component Patterns
- Server Components by default (pages)
- Client Components only when needed ("use client" — interactions, state, animations)
- Props come from server-side markdown parsers

### Styling
- Tailwind CSS v4 with `@theme inline` custom properties
- CSS variables defined in globals.css (--bg-primary, --accent-blue, etc.)
- Use `style={{ color: "var(--text-primary)" }}` for custom colors
- `.card` class for card components
- `.badge` class + variant classes for badges
- `.font-mono-data` for metrics/data display

### API Communication
- API routes in `src/app/api/` for write-back operations
- Use try-catch for all async calls
- Optimistic updates in client components

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --bg-primary | #0a0e1a | Page background |
| --bg-card | #131830 | Card background |
| --accent-blue | #2563eb | Primary accent |
| --accent-teal | #14b8a6 | READY tier, secondary accent |
| --accent-purple | #8b5cf6 | INCUBATING tier |
| --text-primary | #f1f5f9 | Primary text |
| --text-secondary | #94a3b8 | Secondary text |
| --text-muted | #64748b | Muted text |
| --status-healthy | #22c55e | Green status |
| --status-stale | #f59e0b | Amber status |
| --status-blocked | #ef4444 | Red status |

## Quality Checklist

Before completing work:
- [ ] No TypeScript errors (`npm run build`)
- [ ] `npm run dev` starts without errors
- [ ] Components render real data from markdown files
- [ ] Interactive features (drag, vote, expand) work correctly
- [ ] Consistent styling with command-center theme
- [ ] No console warnings

ARGUMENTS: $ARGUMENTS
