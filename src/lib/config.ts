import path from "path";

export const INTELLIGENCE_HUB_PATH =
  process.env.INTELLIGENCE_HUB_PATH ||
  path.resolve("/Users/jashanno/Developer/projects/intelligence-hub");

export const JOB_SEARCH_PATH =
  process.env.JOB_SEARCH_PATH ||
  path.resolve("/Users/jashanno/Developer/projects/2026JobSearch");

export const FILES = {
  projects: path.join(INTELLIGENCE_HUB_PATH, "portfolio", "projects.md"),
  contentPipeline: path.join(INTELLIGENCE_HUB_PATH, "portfolio", "content-pipeline.md"),
  implementationBacklog: path.join(INTELLIGENCE_HUB_PATH, "portfolio", "implementation-backlog.md"),
  intakeLog: path.join(INTELLIGENCE_HUB_PATH, "research", "intake-log.md"),
  intelligenceBrief: path.join(INTELLIGENCE_HUB_PATH, "research", "intelligence-brief.md"),
  bookmarks: path.join(INTELLIGENCE_HUB_PATH, "research", "bookmarks.md"),
  people: path.join(INTELLIGENCE_HUB_PATH, "research", "people-to-watch.md"),
  toolsDir: path.join(INTELLIGENCE_HUB_PATH, "knowledge/tools"),
  strategiesDir: path.join(INTELLIGENCE_HUB_PATH, "knowledge/strategies"),
  videoPipeline: path.join(INTELLIGENCE_HUB_PATH, "status", "video-pipeline-status.md"),
  // Job search pipeline files
  jobCompanies: path.join(JOB_SEARCH_PATH, "Pipeline", "companies.md"),
  jobOpportunities: path.join(JOB_SEARCH_PATH, "Pipeline", "opportunities.md"),
  jobTracker: path.join(JOB_SEARCH_PATH, "Pipeline", "tracker.md"),
  jobResults: path.join(JOB_SEARCH_PATH, "Pipeline", "results.md"),
  jobDiscovery: path.join(JOB_SEARCH_PATH, "Pipeline", "discovery-log.md"),
} as const;

export const WS_PORT = 3001;
