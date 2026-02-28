import fs from "fs";
import { FILES } from "../config";
import type {
  Project,
  ProjectsData,
  Recommendation,
  SynergyFlow,
  Tier,
} from "../types";

const TIER_ORDER: Tier[] = [
  "ACTIVE",
  "READY",
  "INCUBATING",
  "SUPPORTING",
  "DORMANT",
  "PORTFOLIO",
];

function extractField(block: string, field: string): string {
  const regex = new RegExp(`^- \\*\\*${field}:\\*\\*\\s*(.+)$`, "m");
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

function extractNextActions(block: string): string[] {
  const actions: string[] = [];
  const lines = block.split("\n");
  let inActions = false;
  for (const line of lines) {
    if (line.includes("**Next actions:**")) {
      inActions = true;
      continue;
    }
    if (inActions) {
      const actionMatch = line.match(/^\s+-\s+\[ \]\s+(.+)$/);
      if (actionMatch) {
        actions.push(actionMatch[1]);
      } else if (line.match(/^- \*\*/)) {
        break;
      }
    }
  }
  return actions;
}

function isActuallyBlocked(blockers: string): boolean {
  if (!blockers) return false;
  const normalized = blockers.toLowerCase().trim();
  if (normalized === "none") return false;
  if (normalized.startsWith("none ")) return false;
  if (normalized.startsWith("none—") || normalized.startsWith("none —")) return false;
  if (normalized.startsWith("none.")) return false;
  if (normalized === "n/a" || normalized === "") return false;
  return true;
}

function parseProject(block: string, tier: Tier): Project {
  const nameMatch = block.match(/^### (.+)$/m);
  const blockers = extractField(block, "Blockers");
  return {
    name: nameMatch ? nameMatch[1].trim() : "Unknown",
    what: extractField(block, "What"),
    stack: extractField(block, "Stack"),
    path: extractField(block, "Path"),
    github: extractField(block, "GitHub"),
    status: extractField(block, "Status"),
    lane: extractField(block, "Lane"),
    synergies: extractField(block, "Synergies"),
    blockers,
    isBlocked: isActuallyBlocked(blockers),
    nextActions: extractNextActions(block),
    lastTouched: extractField(block, "Last touched"),
    tier,
  };
}

function parseRecommendations(content: string): Recommendation[] {
  const recs: Recommendation[] = [];
  const tableMatch = content.match(
    /## Recommendations[\s\S]*?\|[\s\S]*?\|[\s\S]*?\n([\s\S]*?)(?=\n---|\n##|$)/
  );
  if (!tableMatch) return recs;

  const lines = tableMatch[1].trim().split("\n");
  for (const line of lines) {
    const cols = line.split("|").map((c) => c.trim());
    if (cols.length >= 6 && cols[1].match(/^\d+$/)) {
      recs.push({
        number: parseInt(cols[1]),
        suggestion: cols[2],
        source: cols[3],
        votes: parseInt(cols[4]) || 0,
        status: cols[5],
      });
    }
  }
  return recs;
}

function parseSynergyFlows(content: string): SynergyFlow[] {
  const flows: SynergyFlow[] = [];
  const dataFlows = content.match(
    /\*\*Data flows:\*\*\n([\s\S]*?)(?=\n---|\n##|$)/
  );
  if (!dataFlows) return flows;

  const lines = dataFlows[1].trim().split("\n");
  for (const line of lines) {
    const match = line.match(
      /^- (.+?) → (.+?) \((.+?)\)$/
    );
    if (match) {
      flows.push({ from: match[1], to: match[2], label: match[3] });
    }
  }
  return flows;
}

export function parseProjects(): ProjectsData {
  const content = fs.readFileSync(FILES.projects, "utf-8");

  const lastUpdatedMatch = content.match(
    /\*Last updated: (.+?)\*/
  );
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : "";

  const projects: Project[] = [];

  for (const tier of TIER_ORDER) {
    const tierRegex = new RegExp(
      `## ${tier}\\b[\\s\\S]*?(?=\\n## [A-Z]|\\n## Synergy|\\n## Recommendation|$)`
    );
    const tierMatch = content.match(tierRegex);
    if (!tierMatch) continue;

    const tierContent = tierMatch[0];
    const projectBlocks = tierContent.split(/(?=\n### )/);

    for (const block of projectBlocks) {
      if (block.includes("### ") && !block.startsWith("## ")) {
        projects.push(parseProject(block, tier));
      }
    }
  }

  return {
    projects,
    recommendations: parseRecommendations(content),
    synergyFlows: parseSynergyFlows(content),
    lastUpdated,
  };
}
