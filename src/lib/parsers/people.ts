import fs from "fs";
import { FILES } from "../config";
import type { FollowPriority, Person, PeopleData } from "../types";

const PRIORITY_MAP: Record<string, FollowPriority> = {
  "HIGH PRIORITY": "HIGH",
  "MEDIUM-HIGH PRIORITY": "MEDIUM-HIGH",
  "MEDIUM PRIORITY": "MEDIUM",
  "LOW PRIORITY": "LOW",
};

export function parsePeople(): PeopleData {
  const content = fs.readFileSync(FILES.people, "utf-8");
  const people: Person[] = [];

  let currentPriority: FollowPriority = "MEDIUM";

  const sections = content.split(/\n## /);

  for (const section of sections) {
    const headerMatch = section.match(/^(.+?)(?:\n|$)/);
    if (headerMatch) {
      const header = headerMatch[1].trim();
      if (PRIORITY_MAP[header]) {
        currentPriority = PRIORITY_MAP[header];
      }
    }

    const entries = section.split(/(?=\n### )/);
    for (const entry of entries) {
      const handleMatch = entry.match(/^### (@\S+)/m);
      if (!handleMatch) continue;

      const nameMatch = entry.match(
        /^### @\S+\s*—\s*(.+)$/m
      );
      const whoMatch = entry.match(
        /\*\*Who:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/
      );
      const whyMatch = entry.match(
        /\*\*Why:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/
      );

      const channelsMatch = entry.match(
        /\*\*Channels:\*\*\n([\s\S]*?)(?=\n\*\*|$)/
      );
      const channels = channelsMatch
        ? channelsMatch[1]
            .split("\n")
            .filter((l) => l.trim().startsWith("-"))
            .map((l) => l.replace(/^-\s*/, "").trim())
        : [];

      const readsMatch = entry.match(
        /\*\*Key reads:\*\*\n([\s\S]*?)(?=\n###|\n## |$)/
      );
      const keyReads = readsMatch
        ? readsMatch[1]
            .split("\n")
            .filter((l) => l.trim().startsWith("-"))
            .map((l) => l.replace(/^-\s*/, "").trim())
        : [];

      people.push({
        handle: handleMatch[1],
        name: nameMatch ? nameMatch[1].trim() : "",
        who: whoMatch ? whoMatch[1].trim() : "",
        why: whyMatch ? whyMatch[1].trim() : "",
        channels,
        keyReads,
        priority: currentPriority,
      });
    }
  }

  return { people };
}
