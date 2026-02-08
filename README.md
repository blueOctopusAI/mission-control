# Mission Control

Localhost dashboard for [Blue Octopus Technology](https://blueoctopus.tech)'s intelligence hub. Visualizes project portfolio, content pipeline, research intelligence, and tool evaluations — all powered by markdown files as the database.

## Quick Start

```bash
npm install
npm run dev          # Dashboard at localhost:3000
npx tsx scripts/watch.ts  # File watcher + WebSocket (optional, enables live refresh)
```

## Pages

| Route | What |
|-------|------|
| `/` | Dashboard — metrics, active project cards, recommendations, activity feed |
| `/projects` | Project registry — tier-grouped cards, synergy graph |
| `/content` | Content pipeline — kanban board with drag-and-drop, calendar, platform filters |
| `/research` | Research — intake timeline, key signals, bookmarks, people to watch |
| `/tools` | Tool evaluations — status-badged cards, evaluation progress |

## Architecture

```
intelligence-hub/       <- DATA (markdown source of truth)
  projects.md, content-pipeline.md, intelligence-brief.md,
  intake-log.md, bookmarks.md, people-to-watch.md, knowledge/

mission-control/        <- VISUAL LAYER (this project)
  src/app/              Next.js App Router pages + API routes
  src/components/       React components by domain
  src/lib/parsers/      7 markdown parsers
  src/lib/writers/      3 write-back modules
  scripts/watch.ts      chokidar + WebSocket file watcher
```

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, @dnd-kit (drag & drop), Framer Motion, chokidar + WebSocket, recharts.

## Write-back

The dashboard writes changes back to markdown files:
- Kanban drag-and-drop updates Stage in `content-pipeline.md`
- Recommendation voting updates Votes in `projects.md`
- New content pieces append to `content-pipeline.md`

## Design

Dark glassmorphism command-center aesthetic. Grid background pattern, glow effects, backdrop-filter blur cards, tier-based color coding (blue=ACTIVE, teal=READY, purple=INCUBATING).
