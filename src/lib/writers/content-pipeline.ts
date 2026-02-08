import fs from "fs";
import { FILES } from "../config";
import type { ContentStage } from "../types";
import { updateLastUpdated } from "./markdown-utils";

export function updateContentStage(
  title: string,
  newStage: ContentStage
): void {
  const content = fs.readFileSync(FILES.contentPipeline, "utf-8");
  const lines = content.split("\n");
  let inPiece = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(new RegExp(`^### ${escapeRegex(title)}\\s*$`))) {
      inPiece = true;
      continue;
    }
    if (inPiece && lines[i].match(/^### /)) {
      break;
    }
    if (inPiece && lines[i].match(/^- \*\*Stage:\*\*/)) {
      lines[i] = `- **Stage:** ${newStage}`;
      break;
    }
  }

  fs.writeFileSync(FILES.contentPipeline, lines.join("\n"), "utf-8");
  updateLastUpdated(FILES.contentPipeline);
}

export function addContentPiece(
  platform: string,
  title: string,
  priority: string,
  source: string,
  notes: string
): void {
  const content = fs.readFileSync(FILES.contentPipeline, "utf-8");

  const newEntry = `\n### ${title}\n- **Stage:** Idea\n- **Priority:** ${priority}\n- **Due:**\n- **Source:** ${source}\n- **Notes:** ${notes}\n`;

  // Find the platform section and add before next section
  const sectionRegex = new RegExp(
    `(## ${escapeRegex(platform)}[\\s\\S]*?)(?=\\n---\\n|\\n## |$)`
  );
  const updated = content.replace(sectionRegex, `$1${newEntry}`);

  fs.writeFileSync(FILES.contentPipeline, updated, "utf-8");
  updateLastUpdated(FILES.contentPipeline);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
