import { readFileSync } from "fs";
import { FILES } from "@/lib/config";
import type { Opportunity, OpportunityStatus, FitRow } from "@/lib/types";

export function parseJobOpportunities(): Opportunity[] {
  let content: string;
  try {
    content = readFileSync(FILES.jobOpportunities, "utf-8");
  } catch {
    return [];
  }

  const opportunities: Opportunity[] = [];
  const lines = content.split("\n");

  // Find the summary table first — this is the authoritative source for status
  const summaryMap = new Map<string, { fit: string; status: string; variant: string; source: string }>();
  let inSummaryTable = false;
  for (const line of lines) {
    if (line.startsWith("| OP ")) { inSummaryTable = true; continue; }
    if (inSummaryTable && line.startsWith("|---")) continue;
    if (inSummaryTable && line.startsWith("| OP-")) {
      const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 9) {
        summaryMap.set(cols[0], { fit: cols[5], status: cols[6], variant: cols[7], source: cols[8] });
      }
    } else if (inSummaryTable && !line.startsWith("|")) {
      inSummaryTable = false;
    }
  }

  // Parse detailed assessments
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect OP header: ### OP-NNN | Company — Role
    const opMatch = line.match(/^### (OP-\d+) \| (.+?) — (.+)$/);
    if (!opMatch) continue;

    const summary = summaryMap.get(opMatch[1]);
    const op: Opportunity = {
      id: opMatch[1],
      companyId: "",
      company: opMatch[2],
      role: opMatch[3],
      location: "",
      salary: "",
      fit: summary?.fit || "",
      status: (summary?.status || "discovered") as OpportunityStatus,
      variant: summary?.variant || "",
      source: summary?.source || "",
      applied: "",
      overall: "",
      fitAssessment: [],
      materials: [],
      strategy: "",
    };

    // Parse fields and tables until next OP or end
    let inFitTable = false;
    let inMaterials = false;
    for (let j = i + 1; j < lines.length; j++) {
      const fl = lines[j];
      if (fl.startsWith("### OP-")) break;

      // Bullet fields
      const fieldMatch = fl.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
      if (fieldMatch) {
        const [, key, value] = fieldMatch;
        switch (key) {
          case "Company": {
            const tcMatch = value.match(/\((TC-\d+)\)/);
            op.companyId = tcMatch ? tcMatch[1] : "";
            break;
          }
          case "Location": op.location = value; break;
          case "Salary": op.salary = value; break;
          case "Status": if (!summary?.status) op.status = value as OpportunityStatus; break;
          case "Variant": if (!summary?.variant) op.variant = value; break;
          case "Source": if (!summary?.source) op.source = value; break;
          case "Applied": op.applied = value; break;
        }
        continue;
      }

      // Fit assessment table
      if (fl.startsWith("| Requirement ")) { inFitTable = true; continue; }
      if (inFitTable && fl.startsWith("|---")) continue;
      if (inFitTable && fl.startsWith("|")) {
        const cols = fl.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 3) {
          op.fitAssessment.push({
            requirement: cols[0],
            level: cols[1],
            match: cols[2],
          });
        }
        continue;
      }
      if (inFitTable && !fl.startsWith("|")) inFitTable = false;

      // Overall summary
      if (fl.startsWith("**Overall:**")) {
        op.overall = fl.replace("**Overall:**", "").trim();
        continue;
      }

      // Materials checklist
      if (fl.startsWith("**Materials")) { inMaterials = true; continue; }
      if (inMaterials && fl.startsWith("- [")) {
        op.materials.push(fl);
        continue;
      }
      if (inMaterials && !fl.startsWith("- [") && fl.trim() !== "") inMaterials = false;

      // Strategy / Key challenge
      if (fl.startsWith("**Strategy:**") || fl.startsWith("**Key challenge:**")) {
        op.strategy = fl.replace(/\*\*.*?\*\*\s*/, "");
      }
    }

    opportunities.push(op);
  }

  return opportunities;
}
