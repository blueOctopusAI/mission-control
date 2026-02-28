import fs from "fs";
import path from "path";
import { FILES } from "../config";
import type { IntakeLogData, LogEntry, LogStatus } from "../types";

const ENTRY_RE =
  /^- `\[(\d{4}-\d{2}-\d{2}[\s-]+[\d:]+)\]`\s*\|\s*([\w-]+(?:\/\d)?)\s*\|\s*(.+?)\s*\|\s*(https?:\/\/.+)$/;

function normalizeStatus(raw: string): LogStatus {
  if (raw === "pending" || raw === "processed" || raw === "actioned") return raw;
  if (raw === "deep-dive") return "processed";
  if (raw.startsWith("step-")) return "pending";
  return "processed";
}

function parseEntries(content: string): LogEntry[] {
  const entries: LogEntry[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(ENTRY_RE);
    if (match) {
      const dateMatch = match[1].match(/(\d{4}-\d{2}-\d{2})/);
      entries.push({
        timestamp: match[1],
        status: normalizeStatus(match[2]),
        title: match[3].trim(),
        url: match[4].trim(),
        date: dateMatch ? dateMatch[1] : "",
      });
    }
  }
  return entries;
}

export function parseIntakeLog(): IntakeLogData {
  const content = fs.readFileSync(FILES.intakeLog, "utf-8");
  const entries = parseEntries(content);

  // Also read archive if it exists
  const archivePath = path.join(path.dirname(FILES.intakeLog), "intake-log-archive.md");
  if (fs.existsSync(archivePath)) {
    const archiveContent = fs.readFileSync(archivePath, "utf-8");
    entries.push(...parseEntries(archiveContent));
  }

  return { entries };
}
