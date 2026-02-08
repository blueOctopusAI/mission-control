import fs from "fs";
import { FILES } from "../config";
import type { Bookmark, BookmarksData } from "../types";

export function parseBookmarks(): BookmarksData {
  const content = fs.readFileSync(FILES.bookmarks, "utf-8");
  const bookmarks: Bookmark[] = [];
  const categories = new Set<string>();

  let currentCategory = "Uncategorized";

  // Split by bookmark entries (### headings)
  const sections = content.split(/\n## /);

  for (const section of sections) {
    const catMatch = section.match(/^(.+?)(?:\n|$)/);
    if (catMatch) {
      const cat = catMatch[1].trim();
      if (cat && !cat.startsWith("#") && !cat.startsWith("X Bookmark")) {
        currentCategory = cat;
        categories.add(currentCategory);
      }
    }

    const entries = section.split(/(?=\n### )/);
    for (const entry of entries) {
      const titleMatch = entry.match(/^### (.+)$/m);
      if (!titleMatch) continue;

      const authorMatch = entry.match(
        /- \*\*Author:\*\*\s*(.+)/
      );
      const dateMatch = entry.match(
        /- \*\*Date:\*\*\s*(.+)/
      );
      const urlMatch = entry.match(
        /- \*\*URL:\*\*\s*(.+)/
      );
      const contentMatch = entry.match(
        /- \*\*Content:\*\*\s*([\s\S]*?)(?=\n- \*\*|$)/
      );
      const tagsMatch = entry.match(
        /- \*\*Tags:\*\*\s*(.+)/
      );
      const notesMatch = entry.match(
        /- \*\*Notes:\*\*\s*([\s\S]*?)(?=\n###|\n---|\n## |$)/
      );

      const tags = tagsMatch
        ? tagsMatch[1]
            .split(",")
            .map((t) => t.trim().replace(/`/g, ""))
        : [];

      bookmarks.push({
        title: titleMatch[1].trim(),
        author: authorMatch ? authorMatch[1].trim() : "",
        date: dateMatch ? dateMatch[1].trim() : "",
        url: urlMatch ? urlMatch[1].trim() : "",
        content: contentMatch ? contentMatch[1].trim() : "",
        tags,
        notes: notesMatch ? notesMatch[1].trim() : "",
        category: currentCategory,
      });
    }
  }

  return { bookmarks, categories: Array.from(categories) };
}
