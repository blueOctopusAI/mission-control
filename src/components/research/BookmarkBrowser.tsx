"use client";

import { useState, useMemo } from "react";
import type { Bookmark } from "@/lib/types";

interface BookmarkBrowserProps {
  bookmarks: Bookmark[];
  categories: string[];
}

export default function BookmarkBrowser({ bookmarks, categories }: BookmarkBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        b.content.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || b.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [bookmarks, search, selectedCategory]);

  return (
    <div className="card-static">
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
          Bookmarks
        </h3>
        <span className="text-xs font-mono-data font-bold ml-auto" style={{ color: "var(--accent-blue-light)" }}>
          {filtered.length}
        </span>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookmarks..."
          className="w-full px-3 py-2.5 rounded-lg text-sm"
          style={{
            background: "rgba(6, 9, 15, 0.6)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap mb-4">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
            style={{
              background: selectedCategory === cat ? "rgba(59, 130, 246, 0.18)" : "transparent",
              color: selectedCategory === cat ? "var(--accent-blue-light)" : "var(--text-muted)",
              border: `1px solid ${selectedCategory === cat ? "rgba(59, 130, 246, 0.25)" : "transparent"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((bookmark, i) => (
          <div
            key={i}
            className="py-2.5 px-3 rounded-lg transition-colors"
            style={{ background: "rgba(6, 9, 15, 0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(6, 9, 15, 0.4)")}
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold block transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            >
              {bookmark.title}
            </a>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {bookmark.author} &middot; {bookmark.date}
            </div>
            {bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {bookmark.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                    style={{
                      background: "rgba(123, 181, 255, 0.10)",
                      color: "var(--text-secondary)",
                      border: "1px solid rgba(123, 181, 255, 0.15)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
