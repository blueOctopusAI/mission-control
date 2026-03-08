import fs from "fs";
import { FILES } from "../config";
import type {
  OperationsData,
  ScheduledTask,
  RunHistoryEntry,
  QueueTask,
  MachineHealth,
  CalendarDay,
  RunStatus,
} from "../types";

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
    if (cells.length > 0 && cells[0] !== "") rows.push(cells);
  }
  return rows;
}

function findTableStart(lines: string[], sectionStart: number, sectionEnd: number): number {
  for (let i = sectionStart; i < sectionEnd; i++) {
    if (lines[i].trim().startsWith("|") && !lines[i].trim().startsWith("|--")) {
      // Found header row, skip header + separator
      return i + 2;
    }
  }
  return -1;
}

function findSection(lines: string[], heading: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === heading) return i;
  }
  return -1;
}

function findSubsection(lines: string[], heading: string, afterLine: number): number {
  for (let i = afterLine; i < lines.length; i++) {
    if (lines[i].trim() === heading) return i;
  }
  return -1;
}

function nextSectionBoundary(lines: string[], fromLine: number): number {
  for (let i = fromLine + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ") || lines[i].startsWith("### ")) return i;
  }
  return lines.length;
}

function toRunStatus(s: string): RunStatus {
  if (s === "pass" || s === "fail" || s === "skip" || s === "unknown") return s;
  return "unknown";
}

function parseScheduleTable(lines: string[], sectionStart: number, sectionEnd: number, machine: "mac" | "windows"): ScheduledTask[] {
  const tableStart = findTableStart(lines, sectionStart, sectionEnd);
  if (tableStart < 0) return [];

  const rows = parseTableRows(lines, tableStart);
  return rows.map((r) => ({
    name: r[0] || "",
    schedule: r[1] || "",
    timeout: r[2] || "-",
    lastRun: r[3] || "-",
    status: toRunStatus(r[4] || "unknown"),
    duration: r[5] || "-",
    machine,
  }));
}

export function parseOperations(): OperationsData {
  const empty: OperationsData = {
    lastGenerated: "",
    machineHealth: [],
    macSchedule: [],
    winSchedule: [],
    calendar: [],
    continuousNote: "",
    runHistory: [],
    pendingTasks: [],
    completedTasks: [],
    nasAvailable: true,
  };

  try {
    const filePath = FILES.operationsStatus;
    if (!fs.existsSync(filePath)) return empty;
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Last generated
    const genMatch = content.match(/\*Last generated: (.+?)\*/);
    const lastGenerated = genMatch ? genMatch[1] : "";

    // Machine Health
    const healthStart = findSection(lines, "## Machine Health");
    const healthEnd = healthStart >= 0 ? nextSectionBoundary(lines, healthStart) : 0;
    const machineHealth: MachineHealth[] = [];
    if (healthStart >= 0) {
      const tableStart = findTableStart(lines, healthStart, healthEnd);
      if (tableStart >= 0) {
        const rows = parseTableRows(lines, tableStart);
        for (const r of rows) {
          const passMatch = (r[3] || "").match(/(\d+)/);
          const failMatch = (r[3] || "").match(/(\d+)\s*✗/);
          machineHealth.push({
            machine: r[0] || "",
            status: r[1] || "unknown",
            lastActivity: r[2] || "-",
            passCount: passMatch ? parseInt(passMatch[1]) : 0,
            failCount: failMatch ? parseInt(failMatch[1]) : 0,
            notes: r[4] || "",
          });
        }
      }
    }

    // Schedule
    const schedStart = findSection(lines, "## Schedule");
    const schedEnd = schedStart >= 0 ? nextSectionBoundary(lines, schedStart) : 0;

    const macStart = findSubsection(lines, "### Mac", schedStart >= 0 ? schedStart : 0);
    const winStart = findSubsection(lines, "### Windows", schedStart >= 0 ? schedStart : 0);

    const macEnd = winStart >= 0 ? winStart : schedEnd;
    const winEnd = schedEnd;

    const macSchedule = macStart >= 0 ? parseScheduleTable(lines, macStart, macEnd, "mac") : [];
    const winSchedule = winStart >= 0 ? parseScheduleTable(lines, winStart, winEnd, "windows") : [];

    // Calendar
    const calStart = findSection(lines, "## Weekly Calendar");
    const calEnd = calStart >= 0 ? nextSectionBoundary(lines, calStart) : 0;
    const calendar: CalendarDay[] = [];
    let continuousNote = "";

    if (calStart >= 0) {
      // Check for continuous note
      for (let i = calStart; i < calEnd; i++) {
        if (lines[i].startsWith("*Plus")) {
          continuousNote = lines[i].replace(/^\*/, "").replace(/\*$/, "").trim();
        }
      }

      const tableStart = findTableStart(lines, calStart, calEnd);
      if (tableStart >= 0) {
        const rows = parseTableRows(lines, tableStart);
        for (const r of rows) {
          const dayStr = r[0] || "";
          const isToday = dayStr.includes("← today");
          const day = dayStr.replace(/\s*\*\*← today\*\*/, "").trim();
          const tasksStr = r[1] || "";
          const tasks = tasksStr === "*(none)*" ? [] : tasksStr.split(",").map((t) => t.trim());
          calendar.push({ day, isToday, tasks });
        }
      }
    }

    // Run History
    const histStart = findSection(lines, "## Run History");
    const histEnd = histStart >= 0 ? nextSectionBoundary(lines, histStart) : 0;
    const runHistory: RunHistoryEntry[] = [];
    if (histStart >= 0) {
      const tableStart = findTableStart(lines, histStart, histEnd);
      if (tableStart >= 0) {
        const rows = parseTableRows(lines, tableStart);
        for (const r of rows) {
          runHistory.push({
            timestamp: r[0] || "",
            task: r[1] || "",
            exitBadge: toRunStatus(r[2] || "unknown"),
            duration: r[3] || "-",
            scan: r[4] || "ok",
            flagged: parseInt(r[5] || "0") || 0,
          });
        }
      }
    }

    // Task Queue
    const queueStart = findSection(lines, "## Task Queue");
    const queueEnd = queueStart >= 0 ? nextSectionBoundary(lines, queueStart) : 0;
    const nasAvailable = !content.includes("NAS not mounted");

    const pendingStart = findSubsection(lines, "### Pending", queueStart >= 0 ? queueStart : 0);
    const completedStart = findSubsection(lines, "### Completed", queueStart >= 0 ? queueStart : 0);

    const pendingEnd = completedStart >= 0 ? completedStart : queueEnd;
    const completedEnd = queueEnd;

    const pendingTasks: QueueTask[] = [];
    if (pendingStart >= 0) {
      const tableStart = findTableStart(lines, pendingStart, pendingEnd);
      if (tableStart >= 0) {
        const rows = parseTableRows(lines, tableStart);
        for (const r of rows) {
          pendingTasks.push({
            id: r[0] || "",
            type: r[1] || "",
            priority: r[2] || "normal",
            created: r[3] || "",
            prompt: r[4] || "",
          });
        }
      }
    }

    const completedTasks: QueueTask[] = [];
    if (completedStart >= 0) {
      const tableStart = findTableStart(lines, completedStart, completedEnd);
      if (tableStart >= 0) {
        const rows = parseTableRows(lines, tableStart);
        for (const r of rows) {
          completedTasks.push({
            id: r[0] || "",
            type: r[1] || "",
            completed: r[2] || "",
            priority: "",
            created: "",
            prompt: r[3] || "",
          });
        }
      }
    }

    return {
      lastGenerated,
      machineHealth,
      macSchedule,
      winSchedule,
      calendar,
      continuousNote,
      runHistory,
      pendingTasks,
      completedTasks,
      nasAvailable,
    };
  } catch {
    return empty;
  }
}
