import fs from "fs";
import { FILES } from "../config";
import { updateLastUpdated } from "./markdown-utils";

export function updateRecommendationVote(
  recNumber: number,
  delta: number
): void {
  const content = fs.readFileSync(FILES.projects, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /^\| (\d+) \|(.+?)\|(.+?)\|(.+?)\|(.+?)\|$/
    );
    if (match && parseInt(match[1]) === recNumber) {
      const currentVotes = parseInt(match[4].trim()) || 0;
      const newVotes = currentVotes + delta;
      const sign = newVotes >= 0 ? "+" : "";
      lines[i] = `| ${match[1]} |${match[2]}|${match[3]}| ${sign}${newVotes} |${match[5]}|`;
      break;
    }
  }

  fs.writeFileSync(FILES.projects, lines.join("\n"), "utf-8");
  updateLastUpdated(FILES.projects);
}

export function updateRecommendationStatus(
  recNumber: number,
  newStatus: string
): void {
  const content = fs.readFileSync(FILES.projects, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /^\| (\d+) \|(.+?)\|(.+?)\|(.+?)\|(.+?)\|$/
    );
    if (match && parseInt(match[1]) === recNumber) {
      lines[i] = `| ${match[1]} |${match[2]}|${match[3]}|${match[4]}| ${newStatus} |`;
      break;
    }
  }

  fs.writeFileSync(FILES.projects, lines.join("\n"), "utf-8");
  updateLastUpdated(FILES.projects);
}
