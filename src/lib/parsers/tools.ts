import fs from "fs";
import path from "path";
import { FILES } from "../config";
import type { ToolEval, ToolStatus, ToolsData } from "../types";

function detectStatus(content: string): ToolStatus {
  const lower = content.toLowerCase();
  if (lower.includes("in use") || lower.includes("installed and tested"))
    return "In Use";
  if (lower.includes("tested")) return "Tested";
  if (lower.includes("installed")) return "Installed";
  if (lower.includes("rejected") || lower.includes("backburner"))
    return "Rejected";
  if (lower.includes("documented") || lower.includes("evaluation"))
    return "Documented";
  return "Pending";
}

function extractSection(content: string, heading: string): string {
  const regex = new RegExp(
    `## ${heading}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n## |$)`
  );
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

export function parseTools(): ToolsData {
  const tools: ToolEval[] = [];

  if (!fs.existsSync(FILES.toolsDir)) return { tools };

  const files = fs
    .readdirSync(FILES.toolsDir)
    .filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(FILES.toolsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const titleMatch = content.match(/^# (.+)$/m);
    const name = titleMatch ? titleMatch[1].trim() : file.replace(".md", "");

    const whatSection =
      extractSection(content, "What") ||
      extractSection(content, "Overview") ||
      extractSection(content, "Summary");

    const useCasesSection = extractSection(content, "Use Cases");
    const useCases = useCasesSection
      ? useCasesSection
          .split("\n")
          .filter((l) => l.trim().startsWith("-"))
          .map((l) => l.replace(/^-\s*/, "").trim())
      : [];

    tools.push({
      name,
      slug: file.replace(".md", ""),
      what: whatSection || content.slice(0, 200),
      status: detectStatus(content),
      maturity: extractSection(content, "Maturity") || "Unknown",
      installInstructions:
        extractSection(content, "Install") ||
        extractSection(content, "Installation"),
      useCases,
      securityNotes:
        extractSection(content, "Security") ||
        extractSection(content, "Security Notes"),
      filePath,
    });
  }

  return { tools };
}
