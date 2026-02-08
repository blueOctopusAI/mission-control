import fs from "fs";

export function updateMarkdownField(
  filePath: string,
  sectionTitle: string,
  field: string,
  newValue: string
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let inSection = false;
  let found = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(new RegExp(`^###? ${escapeRegex(sectionTitle)}`))) {
      inSection = true;
      continue;
    }
    if (inSection && lines[i].match(/^###? /)) {
      break;
    }
    if (inSection && lines[i].match(new RegExp(`^- \\*\\*${escapeRegex(field)}:\\*\\*`))) {
      lines[i] = `- **${field}:** ${newValue}`;
      found = true;
      break;
    }
  }

  if (found) {
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  }
}

export function updateLastUpdated(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const today = new Date().toISOString().split("T")[0];
  const updated = content.replace(
    /\*Last updated: .+?\*/,
    `*Last updated: ${today}*`
  );
  fs.writeFileSync(filePath, updated, "utf-8");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
