import fs from "fs";
import { FILES } from "../config";
import type { IntakeLogData, LogEntry, LogStatus } from "../types";

export function parseIntakeLog(): IntakeLogData {
  const content = fs.readFileSync(FILES.intakeLog, "utf-8");
  const entries: LogEntry[] = [];

  const lines = content.split("\n");
  for (const line of lines) {
    // Format: `[2026-02-08 20:15]` | processed | Title | URL
    const match = line.match(
      /^- `\[(\d{4}-\d{2}-\d{2}[\s-]+[\d:]+)\]`\s*\|\s*(pending|processed|actioned)\s*\|\s*(.+?)\s*\|\s*(https?:\/\/.+)$/
    );
    if (match) {
      const dateMatch = match[1].match(/(\d{4}-\d{2}-\d{2})/);
      entries.push({
        timestamp: match[1],
        status: match[2] as LogStatus,
        title: match[3].trim(),
        url: match[4].trim(),
        date: dateMatch ? dateMatch[1] : "",
      });
    }
  }

  return { entries };
}
