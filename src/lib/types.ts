// ============================================================
// Project Registry (projects.md)
// ============================================================

export type Tier =
  | "ACTIVE"
  | "READY"
  | "INCUBATING"
  | "SUPPORTING"
  | "DORMANT"
  | "PORTFOLIO";

export type Lane = "Product" | "Proof" | "Pipeline";

export interface Project {
  name: string;
  what: string;
  stack: string;
  path: string;
  github: string;
  status: string;
  lane: string;
  synergies: string;
  blockers: string;
  nextActions: string[];
  lastTouched: string;
  tier: Tier;
}

export interface Recommendation {
  number: number;
  suggestion: string;
  source: string;
  votes: number;
  status: string;
}

export interface SynergyFlow {
  from: string;
  to: string;
  label: string;
}

export interface ProjectsData {
  projects: Project[];
  recommendations: Recommendation[];
  synergyFlows: SynergyFlow[];
  lastUpdated: string;
}

// ============================================================
// Content Pipeline (content-pipeline.md)
// ============================================================

export type ContentStage =
  | "Idea"
  | "Research"
  | "Outline"
  | "Draft"
  | "Review"
  | "Scheduled"
  | "Published";

export type Platform =
  | "Blue Octopus Blog"
  | "Blue Octopus LinkedIn"
  | "Blue Octopus X"
  | "Blue Octopus YouTube"
  | "UtilitarianTechnology YouTube"
  | "OpenClaw Posts";

export interface ContentPiece {
  id: string;
  title: string;
  stage: ContentStage;
  priority: string;
  due: string;
  source: string;
  notes: string;
  platform: Platform;
}

export interface ContentPipelineData {
  pieces: ContentPiece[];
  lastUpdated: string;
}

// ============================================================
// Intake Log (intake-log.md)
// ============================================================

export type LogStatus = "pending" | "processed" | "actioned";

export interface LogEntry {
  timestamp: string;
  status: LogStatus;
  title: string;
  url: string;
  date: string;
}

export interface IntakeLogData {
  entries: LogEntry[];
}

// ============================================================
// Intelligence Brief (intelligence-brief.md)
// ============================================================

export interface Signal {
  number: number;
  title: string;
  description: string;
  position: string;
}

export interface ActionItem {
  action: string;
  source: string;
  priority: string;
  status: string;
  category: "implement" | "offer" | "tool" | "monitor" | "content";
}

export interface IntelligenceBriefData {
  lastUpdated: string;
  signals: Signal[];
  actions: ActionItem[];
  contentIdeas: ActionItem[];
}

// ============================================================
// Bookmarks (bookmarks.md)
// ============================================================

export interface Bookmark {
  title: string;
  author: string;
  date: string;
  url: string;
  content: string;
  tags: string[];
  notes: string;
  category: string;
}

export interface BookmarksData {
  bookmarks: Bookmark[];
  categories: string[];
}

// ============================================================
// People to Watch (people-to-watch.md)
// ============================================================

export type FollowPriority = "HIGH" | "MEDIUM-HIGH" | "MEDIUM" | "LOW";

export interface Person {
  handle: string;
  name: string;
  who: string;
  why: string;
  channels: string[];
  keyReads: string[];
  priority: FollowPriority;
}

export interface PeopleData {
  people: Person[];
}

// ============================================================
// Tool Evaluations (knowledge/tools/*.md)
// ============================================================

export type ToolStatus =
  | "Documented"
  | "Installed"
  | "Tested"
  | "In Use"
  | "Rejected"
  | "Pending";

export interface ToolEval {
  name: string;
  slug: string;
  what: string;
  status: ToolStatus;
  maturity: string;
  installInstructions: string;
  useCases: string[];
  securityNotes: string;
  filePath: string;
}

export interface ToolsData {
  tools: ToolEval[];
}

// ============================================================
// Dashboard Metrics
// ============================================================

export interface DashboardMetrics {
  linksProcessed: number;
  contentInPipeline: number;
  activeProjects: number;
  daysSinceLastBlogPost: number;
  toolsEvaluated: number;
  peopleTracked: number;
  strategiesDocumented: number;
  recommendations: number;
}

export interface Alert {
  type: "stale" | "blocker" | "overdue";
  project: string;
  message: string;
  severity: "warning" | "error";
}
