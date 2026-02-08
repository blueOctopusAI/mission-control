# CLAUDE.md — Mission Control Dashboard

## What This Is

A localhost-only Next.js dashboard for Blue Octopus Technology's intelligence hub. Reads markdown files from `/Users/jashanno/Developer/projects/intelligence-hub` and provides interactive project management, content pipeline tracking, and research visualization.

**No database. No cloud. No auth.** Markdown files are the database. Localhost only.

## Architecture

```
intelligence-hub/       ← DATA (markdown source of truth)
  projects.md
  content-pipeline.md
  intelligence-brief.md
  intake-log.md
  bookmarks.md
  people-to-watch.md
  knowledge/

mission-control/        ← VISUAL LAYER (this project)
  app/                  # Next.js App Router pages
  components/           # React components by domain
  lib/parsers/          # Markdown → TypeScript parsers
  lib/writers/          # Dashboard → Markdown write-back
  scripts/watch.ts      # File watcher + WebSocket server
```

## Commands

```bash
npm run dev          # Start dashboard at localhost:3000
npx tsx scripts/watch.ts  # Start file watcher (WebSocket on :3001)
```

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Styling:** Tailwind CSS v4 with custom CSS variables
- **Drag & drop:** @dnd-kit/core + @dnd-kit/sortable
- **Animations:** Framer Motion (octopus SVG)
- **Markdown parsing:** Custom parsers (gray-matter available for future use)
- **File watching:** chokidar + WebSocket (ws)
- **Charts:** recharts
- **TypeScript:** strict mode

## Pages

| Route | What | Data Source |
|-------|------|-------------|
| `/` | Dashboard home — metrics, project cards, recommendations, activity | All files |
| `/projects` | Project registry — tier grid, synergy graph | projects.md |
| `/content` | Content pipeline — kanban board, calendar | content-pipeline.md |
| `/research` | Research — timeline, signals, bookmarks, people | intake-log.md, intelligence-brief.md, bookmarks.md, people-to-watch.md |
| `/tools` | Tool evaluations — card grid with status badges | knowledge/tools/*.md |

## Write-back Paths (Dashboard → Markdown)

- **Kanban drag & drop** → updates Stage in content-pipeline.md
- **Recommendation vote** → updates Votes in projects.md
- **New content piece** → appends to content-pipeline.md

## Data Flow

1. Server Components read markdown files at request time
2. Custom parsers extract structured TypeScript data
3. Data flows to React components as props
4. Client components handle interaction (drag, vote, expand)
5. API routes write changes back to markdown files
6. File watcher detects changes → WebSocket → client refresh

## Color Palette

- Background: `#0a0e1a` (dark navy)
- Cards: `#131830`
- Accent: `#2563eb` → `#3b82f6` (blue gradient)
- Teal: `#14b8a6` (READY tier)
- Purple: `#8b5cf6` (INCUBATING tier)
- Status: green (healthy), amber (stale), red (blocked)

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/config.ts` | Path to intelligence-hub (configurable via env) |
| `src/lib/types.ts` | All TypeScript interfaces |
| `src/lib/parsers/` | One parser per markdown file type |
| `src/lib/writers/` | Write-back functions for content + projects |
| `src/components/octopus/` | SVG octopus (legacy, not rendered on dashboard) |
| `scripts/watch.ts` | chokidar + WebSocket file watcher |

## Related Projects

- **intelligence-hub** — Data source (markdown files)
- **blue-octopus-website** — Storefront (content flows from pipeline to blog)
- **GitHub:** github.com/blueOctopusAI/mission-control
