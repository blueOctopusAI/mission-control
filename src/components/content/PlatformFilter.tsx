"use client";

import type { Platform } from "@/lib/types";

const PLATFORMS: { label: string; value: Platform | "all"; color?: string }[] = [
  { label: "All", value: "all" },
  { label: "Blog", value: "Blue Octopus Blog", color: "#60a5fa" },
  { label: "LinkedIn", value: "Blue Octopus LinkedIn", color: "#38bdf8" },
  { label: "X", value: "Blue Octopus X", color: "#94a3b8" },
  { label: "YouTube", value: "Blue Octopus YouTube", color: "#f87171" },
  { label: "UtilTech", value: "UtilitarianTechnology YouTube", color: "#fbbf24" },
  { label: "OpenClaw", value: "OpenClaw Posts", color: "#2dd4bf" },
];

interface PlatformFilterProps {
  selected: Platform | "all";
  onChange: (value: Platform | "all") => void;
}

export default function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {PLATFORMS.map((p) => {
        const isActive = selected === p.value;
        const color = p.color || "#60a5fa";
        return (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: isActive ? `${color}18` : "transparent",
              color: isActive ? color : "var(--text-muted)",
              border: `1px solid ${isActive ? `${color}30` : "var(--border-subtle)"}`,
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
