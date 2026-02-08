# Decisions

## ADR-001: Separate Project Architecture
**Date**: 2026-02-08
**Status**: Implemented

### Context
Mission Control needs a Next.js runtime (node_modules, build system, dev server) but intelligence-hub is a pure markdown data repository. Need to decide whether to embed the dashboard or keep it separate.

### Decision
Keep mission-control as a separate project at `/Developer/projects/mission-control/`. It reads from intelligence-hub via configurable path in `lib/config.ts`.

### Consequences
- **Positive**: intelligence-hub stays clean (no node_modules, no build artifacts), dashboard can be stopped/started independently, clear separation of data vs. visual layer
- **Negative**: Two directories to manage, config path must be maintained

## ADR-002: Markdown as Database
**Date**: 2026-02-08
**Status**: Implemented

### Context
Dashboard needs structured data. Options: SQLite, JSON files, or parse existing markdown.

### Decision
Parse markdown files directly. No database. Custom parsers in `lib/parsers/` extract structured TypeScript data from markdown files at request time.

### Consequences
- **Positive**: Single source of truth (markdown), Claude Code commands and dashboard share the same data, no migration needed, works offline
- **Negative**: Parsing overhead on each request (mitigated by server components), regex-based parsing is fragile

## ADR-003: Orchestration Bootstrap Integration
**Date**: 2026-02-08
**Status**: Implemented

### Context
Need structured development workflow for multi-session dashboard development.

### Decision
Adopt orchestration-bootstrap patterns: `/orchestrate`, `/frontend`, `/test`, `/docs` commands + `.ai/` state files for session persistence.

### Consequences
- **Positive**: Consistent workflow, session continuity, clear skill boundaries
- **Negative**: Additional files to maintain
