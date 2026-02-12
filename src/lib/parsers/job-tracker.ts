import { readFileSync } from "fs";
import { FILES } from "@/lib/config";
import type { Touchpoint, Contact, FollowUp, TrackerData } from "@/lib/types";

function parseTable(lines: string[], startIdx: number): string[][] {
  const rows: string[][] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("|")) break;
    if (line.startsWith("|---") || line.startsWith("| ---")) continue;
    const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cols.length > 0) rows.push(cols);
  }
  return rows;
}

export function parseJobTracker(): TrackerData {
  let content: string;
  try {
    content = readFileSync(FILES.jobTracker, "utf-8");
  } catch {
    return { touchpoints: [], contacts: [], followUps: [] };
  }

  const lines = content.split("\n");
  const touchpoints: Touchpoint[] = [];
  const contacts: Contact[] = [];
  const followUps: FollowUp[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Touchpoint Log table
    if (line.startsWith("| TX ") && line.includes("Date")) {
      // Skip header, find separator, then data rows
      const sepIdx = lines.findIndex((l, idx) => idx > i && l.startsWith("|---"));
      if (sepIdx === -1) continue;
      const rows = parseTable(lines, sepIdx + 1);
      for (const cols of rows) {
        if (cols.length >= 9) {
          touchpoints.push({
            id: cols[0],
            date: cols[1],
            company: cols[2],
            contact: cols[3],
            channel: cols[4],
            action: cols[5],
            result: cols[6],
            nextStep: cols[7],
            due: cols[8],
          });
        }
      }
    }

    // Contact Directory table
    if (line.startsWith("| Name ") && line.includes("Company")) {
      const sepIdx = lines.findIndex((l, idx) => idx > i && l.startsWith("|---"));
      if (sepIdx === -1) continue;
      const rows = parseTable(lines, sepIdx + 1);
      for (const cols of rows) {
        if (cols.length >= 5) {
          contacts.push({
            name: cols[0],
            company: cols[1],
            title: cols[2],
            channel: cols[3],
            notes: cols[4],
          });
        }
      }
    }

    // Follow-Up Queue table
    if (line.startsWith("| TX ") && line.includes("Action Due")) {
      const sepIdx = lines.findIndex((l, idx) => idx > i && l.startsWith("|---"));
      if (sepIdx === -1) continue;
      const rows = parseTable(lines, sepIdx + 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (const cols of rows) {
        if (cols.length >= 6) {
          const dueDate = new Date(cols[4]);
          dueDate.setHours(0, 0, 0, 0);
          const daysUntil = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          followUps.push({
            txId: cols[0],
            company: cols[1],
            contact: cols[2],
            actionDue: cols[3],
            dueDate: cols[4],
            daysUntil,
          });
        }
      }
    }
  }

  return { touchpoints, contacts, followUps };
}
