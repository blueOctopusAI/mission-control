# Codebase Reference

## Overview
Next.js 16 dashboard for Blue Octopus Technology's intelligence hub. Reads markdown files, provides interactive project management, content pipeline tracking, and animated octopus system health visualization.

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router pages (5 pages + 3 API routes) |
| `src/components/octopus/` | Animated SVG octopus (Octopus, Tentacle, Eyes) |
| `src/components/dashboard/` | Home page widgets (Metrics, Alerts, Recommendations, Feed, Focus) |
| `src/components/content/` | Kanban board, calendar, platform filter, new content modal |
| `src/components/projects/` | Project cards, tier grid, synergy graph |
| `src/components/research/` | Timeline, signals, bookmarks, people grid |
| `src/components/tools/` | Tool grid with evaluation status |
| `src/components/layout/` | Sidebar, Header, LiveRefresh |
| `src/lib/parsers/` | Markdown → TypeScript parsers (7 files) |
| `src/lib/writers/` | Dashboard → Markdown write-back (3 files) |
| `src/lib/` | types.ts, config.ts |
| `scripts/` | watch.ts (file watcher + WebSocket) |

## Routes

| Route | Component | Data Source |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | All parsers |
| `/projects` | `app/projects/page.tsx` | projects.md |
| `/content` | `app/content/page.tsx` | content-pipeline.md |
| `/research` | `app/research/page.tsx` | intake-log.md, intelligence-brief.md, bookmarks.md, people-to-watch.md |
| `/tools` | `app/tools/page.tsx` | knowledge/tools/*.md |
| `/api/content` | API route | content-pipeline.md (write) |
| `/api/recommendations` | API route | projects.md (write) |
| `/api/projects` | API route | projects.md (write) |

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/config.ts` | INTELLIGENCE_HUB_PATH + file path constants |
| `src/lib/types.ts` | All TypeScript interfaces (Project, ContentPiece, Signal, etc.) |
| `src/lib/parsers/index.ts` | Re-exports all parsers |
| `src/components/octopus/Octopus.tsx` | Main octopus SVG with Framer Motion |
| `src/components/content/KanbanBoard.tsx` | @dnd-kit kanban with write-back |
| `src/app/globals.css` | CSS custom properties + Tailwind v4 theme |

## Dependencies

| Package | Purpose |
|---------|---------|
| next 16 | Framework |
| react 19 | UI library |
| @dnd-kit/core + sortable | Drag and drop |
| framer-motion | SVG animations |
| gray-matter | Markdown frontmatter (available, not heavily used yet) |
| chokidar | File watching |
| ws | WebSocket server |
| recharts | Charts (available for future use) |

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `INTELLIGENCE_HUB_PATH` | `../intelligence-hub` (resolved relative to project root) | Path to data directory |

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npx tsx scripts/watch.ts # File watcher + WebSocket (localhost:3001)
```
