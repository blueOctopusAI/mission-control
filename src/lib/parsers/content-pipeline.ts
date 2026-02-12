import fs from "fs";
import { FILES } from "../config";
import type { ContentPiece, ContentPipelineData, ContentStage, Platform } from "../types";

const PLATFORM_MAP: Record<string, Platform> = {
  "Blue Octopus Blog": "Blue Octopus Blog",
  "Blue Octopus LinkedIn": "Blue Octopus LinkedIn",
  "Blue Octopus X": "Blue Octopus X",
  "Blue Octopus YouTube": "Blue Octopus YouTube",
  "UtilitarianTechnology YouTube": "UtilitarianTechnology YouTube",
  "OpenClaw Posts": "OpenClaw Posts",
};

const VALID_STAGES: ContentStage[] = [
  "Idea",
  "Research",
  "Outline",
  "Draft",
  "Review",
  "Scheduled",
  "Published",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractField(block: string, field: string): string {
  const regex = new RegExp(`^- \\*\\*${field}:\\*\\*\\s*(.*)$`, "m");
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

export function parseContentPipeline(): ContentPipelineData {
  const content = fs.readFileSync(FILES.contentPipeline, "utf-8");

  const lastUpdatedMatch = content.match(/\*Last updated: (.+?)\*/);
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : "";

  const pieces: ContentPiece[] = [];
  const idCounts = new Map<string, number>();
  let currentPlatform: Platform = "Blue Octopus Blog";

  // Split by platform sections (## headings)
  const sections = content.split(/\n## /);

  for (const section of sections) {
    // Determine platform from section heading
    const headingMatch = section.match(/^(.+?)(?:\n|$)/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      if (PLATFORM_MAP[heading]) {
        currentPlatform = PLATFORM_MAP[heading];
      }
    }

    // Parse content pieces within section (### headings)
    const pieceBlocks = section.split(/(?=\n### )/);

    for (const block of pieceBlocks) {
      const titleMatch = block.match(/^### (.+)$/m);
      if (!titleMatch) continue;

      const title = titleMatch[1].trim();
      const stageRaw = extractField(block, "Stage");
      const stage = VALID_STAGES.includes(stageRaw as ContentStage)
        ? (stageRaw as ContentStage)
        : "Idea";

      // Generate unique ID by combining platform + title slug, with counter for true duplicates
      const baseId = `${slugify(currentPlatform)}-${slugify(title)}`;
      const count = idCounts.get(baseId) || 0;
      idCounts.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count}`;

      pieces.push({
        id,
        title,
        stage,
        priority: extractField(block, "Priority"),
        due: extractField(block, "Due"),
        source: extractField(block, "Source"),
        notes: extractField(block, "Notes"),
        platform: currentPlatform,
      });
    }
  }

  return { pieces, lastUpdated };
}
