import { readFileSync } from "fs";
import { FILES } from "@/lib/config";
import type { DiscoveryEntry } from "@/lib/types";

export function parseJobDiscovery(): DiscoveryEntry[] {
  let content: string;
  try {
    content = readFileSync(FILES.jobDiscovery, "utf-8");
  } catch {
    return [];
  }

  const entries: DiscoveryEntry[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Format: `[YYYY-MM-DD HH:MM]` | SOURCE | Query/Method | Results Summary | New TCs | New OPs
    const match = line.match(/^`\[(.+?)\]`\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/);
    if (!match) continue;

    entries.push({
      timestamp: match[1],
      source: match[2],
      query: match[3],
      results: match[4],
      newTCs: match[5],
      newOPs: match[6],
    });
  }

  return entries;
}
