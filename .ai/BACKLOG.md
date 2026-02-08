# Backlog

## High Priority

### 1. Fix build errors from first compilation
- [ ] Run `npm run build` and fix any TypeScript issues
- [ ] Test all parsers against real markdown data
**Why**: Must compile before anything else works

### 2. Test interactive features
- [ ] Verify kanban drag-and-drop writes to content-pipeline.md
- [ ] Verify recommendation voting writes to projects.md
- [ ] Verify new content modal adds to content-pipeline.md
**Why**: Write-back is the core value of the dashboard

## Medium Priority

### 3. Add responsive improvements
- [ ] Test on MacBook screen (1440px)
- [ ] Test on external monitor (2560px)
- [ ] Ensure sidebar collapses on narrow screens
**Why**: Dashboard must be usable on actual dev setup

### 4. Add loading states and transitions
- [ ] Page transitions between routes
- [ ] Loading skeletons for data-heavy components
- [ ] Error boundaries for parser failures
**Why**: Polish and robustness

### 5. Enhance octopus animations
- [ ] Celebration animation when content is published
- [ ] Ink cloud dismiss animation
- [ ] Connect tentacle movement to real-time data changes
**Why**: The octopus should be a functional data viz element, not just decoration

## Low Priority

### 6. Add search across all views
- [ ] Global search in header
- [ ] Search across bookmarks, projects, tools, content
**Why**: Quick access as data grows

### 7. Set up test infrastructure
- [ ] Install vitest
- [ ] Write parser tests
- [ ] Write API route tests
**Why**: Confidence in refactoring as dashboard evolves

---

## Completed
- [x] Scaffold Next.js project (2026-02-08)
- [x] Build all parsers and types (2026-02-08)
- [x] Build layout and navigation (2026-02-08)
- [x] Build all 5 pages (2026-02-08)
- [x] Build animated octopus (2026-02-08)
- [x] Build file watcher (2026-02-08)
- [x] Set up orchestration (2026-02-08)
