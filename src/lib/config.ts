import path from "path";

export const INTELLIGENCE_HUB_PATH =
  process.env.INTELLIGENCE_HUB_PATH ||
  path.resolve("/Users/jashanno/Developer/projects/intelligence-hub");

export const FILES = {
  projects: path.join(INTELLIGENCE_HUB_PATH, "projects.md"),
  contentPipeline: path.join(INTELLIGENCE_HUB_PATH, "content-pipeline.md"),
  intakeLog: path.join(INTELLIGENCE_HUB_PATH, "intake-log.md"),
  intelligenceBrief: path.join(INTELLIGENCE_HUB_PATH, "intelligence-brief.md"),
  bookmarks: path.join(INTELLIGENCE_HUB_PATH, "bookmarks.md"),
  people: path.join(INTELLIGENCE_HUB_PATH, "people-to-watch.md"),
  toolsDir: path.join(INTELLIGENCE_HUB_PATH, "knowledge/tools"),
  strategiesDir: path.join(INTELLIGENCE_HUB_PATH, "knowledge/strategies"),
} as const;

export const WS_PORT = 3001;
