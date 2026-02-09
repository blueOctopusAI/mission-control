import fs from "fs";
import { FILES } from "../config";

export interface PipelineJob {
  id: string;
  type: string;
  source: string;
  status: string;
  progress: string;
  route: string;
  started: string;
  output?: string;
  duration?: string;
  completed?: string;
  error?: string;
}

export interface PipelineStats {
  total: number;
  completed: number;
  failed: number;
  active: number;
}

export interface VideoPipelineData {
  lastUpdated: string;
  activeJobs: PipelineJob[];
  recentCompleted: PipelineJob[];
  failedJobs: PipelineJob[];
  stats: PipelineStats;
}

function parseTableRows(lines: string[], startIdx: number): string[][] {
  const rows: string[][] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("|")) break;
    if (line.startsWith("|--") || line.startsWith("|-")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

export function parseVideoPipeline(): VideoPipelineData {
  const filePath = FILES.videoPipeline;
  const empty: VideoPipelineData = {
    lastUpdated: "",
    activeJobs: [],
    recentCompleted: [],
    failedJobs: [],
    stats: { total: 0, completed: 0, failed: 0, active: 0 },
  };

  try {
    if (!fs.existsSync(filePath)) return empty;
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Last updated
    const updatedMatch = content.match(/\*Last updated: (.+?)\*/);
    const lastUpdated = updatedMatch ? updatedMatch[1] : "";

    // Find sections
    let activeStart = -1;
    let completedStart = -1;
    let failedStart = -1;
    let statsStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "## Active Jobs") activeStart = i;
      else if (line === "## Recent Completed") completedStart = i;
      else if (line === "## Failed") failedStart = i;
      else if (line === "## Stats") statsStart = i;
    }

    // Parse active jobs
    const activeJobs: PipelineJob[] = [];
    if (activeStart >= 0) {
      // Find header row
      for (let i = activeStart + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith("| ID")) {
          const rows = parseTableRows(lines, i + 2); // skip header + separator
          for (const row of rows) {
            if (row.length >= 7) {
              activeJobs.push({
                id: row[0],
                type: row[1],
                source: row[2],
                status: row[3],
                progress: row[4],
                route: row[5],
                started: row[6],
              });
            }
          }
          break;
        }
      }
    }

    // Parse completed jobs
    const recentCompleted: PipelineJob[] = [];
    if (completedStart >= 0) {
      for (let i = completedStart + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith("| ID")) {
          const rows = parseTableRows(lines, i + 2);
          for (const row of rows) {
            if (row.length >= 6) {
              recentCompleted.push({
                id: row[0],
                type: row[1],
                source: row[2],
                status: "completed",
                progress: "100%",
                route: "",
                started: "",
                output: row[3],
                duration: row[4],
                completed: row[5],
              });
            }
          }
          break;
        }
      }
    }

    // Parse failed jobs
    const failedJobs: PipelineJob[] = [];
    if (failedStart >= 0) {
      for (let i = failedStart + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith("| ID")) {
          const rows = parseTableRows(lines, i + 2);
          for (const row of rows) {
            if (row.length >= 4) {
              failedJobs.push({
                id: row[0],
                type: "pipeline",
                source: row[1],
                status: "failed",
                progress: "0%",
                route: "",
                started: "",
                error: row[2],
                completed: row[3],
              });
            }
          }
          break;
        }
      }
    }

    // Parse stats
    const stats: PipelineStats = { total: 0, completed: 0, failed: 0, active: 0 };
    if (statsStart >= 0) {
      for (let i = statsStart; i < lines.length; i++) {
        const line = lines[i];
        const totalMatch = line.match(/\*\*Total jobs:\*\*\s*(\d+)/);
        const compMatch = line.match(/\*\*Completed:\*\*\s*(\d+)/);
        const failMatch = line.match(/\*\*Failed:\*\*\s*(\d+)/);
        const actMatch = line.match(/\*\*Active:\*\*\s*(\d+)/);
        if (totalMatch) stats.total = parseInt(totalMatch[1]);
        if (compMatch) stats.completed = parseInt(compMatch[1]);
        if (failMatch) stats.failed = parseInt(failMatch[1]);
        if (actMatch) stats.active = parseInt(actMatch[1]);
      }
    }

    return { lastUpdated, activeJobs, recentCompleted, failedJobs, stats };
  } catch {
    return empty;
  }
}
