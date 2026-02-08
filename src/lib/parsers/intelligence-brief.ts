import fs from "fs";
import { FILES } from "../config";
import type { ActionItem, IntelligenceBriefData, Signal } from "../types";

function parseSignals(content: string): Signal[] {
  const signals: Signal[] = [];
  const signalsSection = content.match(
    /## Key Signals\n([\s\S]*?)(?=\n---|\n## Action)/
  );
  if (!signalsSection) return signals;

  const blocks = signalsSection[1].split(/(?=### \d+\.)/);
  for (const block of blocks) {
    const headerMatch = block.match(/### (\d+)\. (.+)/);
    if (!headerMatch) continue;

    const positionMatch = block.match(
      /\*\*Our position:\*\*\s*([\s\S]*?)(?=\n###|\n$|$)/
    );

    // Get the description (everything between the header and "Our position")
    const descStart = block.indexOf("\n", block.indexOf(headerMatch[0]));
    const posStart = block.indexOf("**Our position:**");
    const description =
      posStart > -1
        ? block.slice(descStart, posStart).trim()
        : block.slice(descStart).trim();

    signals.push({
      number: parseInt(headerMatch[1]),
      title: headerMatch[2].trim(),
      description,
      position: positionMatch ? positionMatch[1].trim() : "",
    });
  }

  return signals;
}

function parseActionTable(
  content: string,
  sectionHeader: string,
  category: ActionItem["category"]
): ActionItem[] {
  const items: ActionItem[] = [];
  const sectionRegex = new RegExp(
    `### ${sectionHeader}[\\s\\S]*?\\|[\\s\\S]*?\\|[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n### |\\n---)`
  );
  const section = content.match(sectionRegex);
  if (!section) return items;

  const lines = section[1].trim().split("\n");
  for (const line of lines) {
    const cols = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length >= 4 && !cols[0].startsWith("---") && !cols[0].startsWith("Action")) {
      items.push({
        action: cols[0].replace(/~~(.+?)~~/g, "$1"),
        source: cols[1],
        priority: cols[2],
        status: cols[3],
        category,
      });
    }
  }
  return items;
}

export function parseIntelligenceBrief(): IntelligenceBriefData {
  const content = fs.readFileSync(FILES.intelligenceBrief, "utf-8");

  const lastUpdatedMatch = content.match(/\*Last updated: (.+?)\*/);
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : "";

  const signals = parseSignals(content);

  const implementActions = parseActionTable(
    content,
    "IMPLEMENT",
    "implement"
  );
  const offerActions = parseActionTable(content, "OFFER", "offer");
  const toolActions = parseActionTable(content, "TOOL", "tool");
  const contentIdeas = parseActionTable(content, "CONTENT", "content");

  return {
    lastUpdated,
    signals,
    actions: [...implementActions, ...offerActions, ...toolActions],
    contentIdeas,
  };
}
