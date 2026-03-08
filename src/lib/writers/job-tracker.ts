import fs from "fs";
import { FILES } from "../config";

export function markFollowUpDone(txId: string): void {
  const content = fs.readFileSync(FILES.jobTracker, "utf-8");
  const lines = content.split("\n");

  // Find the follow-up queue section and update the matching row
  let inFollowUpSection = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("| TX ") && lines[i].includes("Action Due")) {
      inFollowUpSection = true;
      continue;
    }
    if (inFollowUpSection && !lines[i].startsWith("|")) break;
    if (inFollowUpSection && lines[i].includes(txId)) {
      // Replace the status column (last column) with "Done"
      const cols = lines[i].split("|").map((c) => c.trim());
      // cols: ['', TX, Company, Contact, Action, Due, Status, '']
      if (cols.length >= 7) {
        cols[cols.length - 2] = " Done ";
        lines[i] = cols.join(" | ").replace(/^ \| /, "| ").replace(/ \| $/, " |");
      }
      break;
    }
  }

  fs.writeFileSync(FILES.jobTracker, lines.join("\n"), "utf-8");
}
