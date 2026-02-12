import { readFileSync } from "fs";
import { FILES } from "@/lib/config";
import type {
  ResultsData,
  ResultsStat,
  IndustryResult,
  VariantResult,
  ChannelResult,
  Lesson,
} from "@/lib/types";

function parseTableInSection(sectionLines: string[]): string[][] {
  const rows: string[][] = [];
  let inTable = false;
  for (const line of sectionLines) {
    if (line.startsWith("|") && !line.startsWith("|---") && !line.startsWith("| ---")) {
      if (!inTable) {
        // Skip the header row
        inTable = true;
        continue;
      }
      const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cols.length > 0) rows.push(cols);
    } else if (line.startsWith("|---") || line.startsWith("| ---")) {
      // separator — skip, table data follows
      continue;
    } else if (inTable) {
      // End of table
      break;
    }
  }
  return rows;
}

export function parseJobResults(): ResultsData {
  let content: string;
  try {
    content = readFileSync(FILES.jobResults, "utf-8");
  } catch {
    return { stats: [], byIndustry: [], byVariant: [], byChannel: [], lessons: [] };
  }

  const stats: ResultsStat[] = [];
  const byIndustry: IndustryResult[] = [];
  const byVariant: VariantResult[] = [];
  const byChannel: ChannelResult[] = [];
  const lessons: Lesson[] = [];

  // Split into sections by ## headers
  const sections = content.split(/^(?=## )/m);

  for (const section of sections) {
    const sectionLines = section.split("\n");
    const header = sectionLines[0]?.trim() || "";

    if (header.startsWith("## Summary Stats")) {
      const rows = parseTableInSection(sectionLines);
      for (const cols of rows) {
        if (cols.length >= 2) {
          stats.push({ metric: cols[0], count: cols[1] });
        }
      }
    } else if (header.startsWith("## By Industry")) {
      const rows = parseTableInSection(sectionLines);
      for (const cols of rows) {
        if (cols.length >= 5) {
          byIndustry.push({
            industry: cols[0],
            applied: cols[1],
            responses: cols[2],
            interviews: cols[3],
            notes: cols[4],
          });
        }
      }
    } else if (header.startsWith("## By Resume Variant")) {
      const rows = parseTableInSection(sectionLines);
      for (const cols of rows) {
        if (cols.length >= 4) {
          byVariant.push({
            variant: cols[0],
            used: cols[1],
            responses: cols[2],
            notes: cols[3],
          });
        }
      }
    } else if (header.startsWith("## By Channel")) {
      const rows = parseTableInSection(sectionLines);
      for (const cols of rows) {
        if (cols.length >= 4) {
          byChannel.push({
            channel: cols[0],
            applied: cols[1],
            responses: cols[2],
            notes: cols[3],
          });
        }
      }
    } else if (header.startsWith("## Lessons Learned")) {
      // Parse ### subsections
      for (let i = 1; i < sectionLines.length; i++) {
        const lessonMatch = sectionLines[i].match(/^### (\d{4}-\d{2}-\d{2})(?: \(.+?\))? — (.+)$/);
        if (lessonMatch) {
          const lesson: Lesson = {
            date: lessonMatch[1],
            company: lessonMatch[2],
            points: [],
          };
          for (let j = i + 1; j < sectionLines.length; j++) {
            if (sectionLines[j].startsWith("### ")) break;
            if (sectionLines[j].startsWith("- **")) {
              lesson.points.push(sectionLines[j].replace(/^- /, ""));
            }
          }
          lessons.push(lesson);
        }
      }
    }
  }

  return { stats, byIndustry, byVariant, byChannel, lessons };
}
