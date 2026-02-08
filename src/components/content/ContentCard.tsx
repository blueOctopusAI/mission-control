"use client";

import type { ContentPiece } from "@/lib/types";

interface ContentCardProps {
  piece: ContentPiece;
}

const PLATFORM_ICONS: Record<string, string> = {
  "Blue Octopus Blog": "B",
  "Blue Octopus LinkedIn": "in",
  "Blue Octopus X": "X",
  "Blue Octopus YouTube": "YT",
  "UtilitarianTechnology YouTube": "UT",
  "OpenClaw Posts": "OC",
};

const PLATFORM_COLORS: Record<string, string> = {
  "Blue Octopus Blog": "#60a5fa",
  "Blue Octopus LinkedIn": "#38bdf8",
  "Blue Octopus X": "#94a3b8",
  "Blue Octopus YouTube": "#f87171",
  "UtilitarianTechnology YouTube": "#fbbf24",
  "OpenClaw Posts": "#2dd4bf",
};

export default function ContentCard({ piece }: ContentCardProps) {
  const platformColor = PLATFORM_COLORS[piece.platform] || "#475569";

  return (
    <div
      className="rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-all"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `2px solid ${platformColor}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
          style={{
            background: `${platformColor}15`,
            color: platformColor,
          }}
        >
          {PLATFORM_ICONS[piece.platform] || "?"}
        </span>
        {piece.priority && (
          <span
            className={`text-[9px] font-bold ${
              piece.priority === "High"
                ? "priority-high"
                : piece.priority === "Medium"
                ? "priority-medium"
                : "priority-low"
            }`}
          >
            {piece.priority}
          </span>
        )}
      </div>
      <div className="text-[11px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
        {piece.title}
      </div>
      {piece.due && (
        <div className="text-[9px] mt-1.5 font-mono-data" style={{ color: "var(--text-muted)" }}>
          Due: {piece.due}
        </div>
      )}
    </div>
  );
}
