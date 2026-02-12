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
  "Blue Octopus Blog": "#7bb5ff",
  "Blue Octopus LinkedIn": "#38bdf8",
  "Blue Octopus X": "#cbd5e1",
  "Blue Octopus YouTube": "#fb7185",
  "UtilitarianTechnology YouTube": "#fcd34d",
  "OpenClaw Posts": "#5eead4",
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
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{
            background: `${platformColor}20`,
            color: platformColor,
          }}
        >
          {PLATFORM_ICONS[piece.platform] || "?"}
        </span>
        {piece.priority && (
          <span
            className={`text-[10px] font-bold ${
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
      <div className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
        {piece.title}
      </div>
      {piece.due && (
        <div className="text-xs mt-1.5 font-mono-data" style={{ color: "var(--text-muted)" }}>
          Due: {piece.due}
        </div>
      )}
    </div>
  );
}
