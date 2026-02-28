"use client";

import { useState } from "react";
import type { ToolEval } from "@/lib/types";

interface ToolGridProps {
  tools: ToolEval[];
}

const STATUS_COLORS: Record<string, string> = {
  Documented: "#2563eb",
  Installed: "#0d9488",
  Tested: "#059669",
  "In Use": "#059669",
  Rejected: "#dc2626",
  Pending: "#475569",
};

function ToolCard({ tool }: { tool: ToolEval }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLORS[tool.status] || "#475569";

  return (
    <div
      className="rounded-xl p-4 cursor-pointer hover-lift"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderTop: `2px solid ${statusColor}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {tool.name}
        </h4>
        <span
          className="badge text-[9px]"
          style={{
            background: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}20`,
          }}
        >
          {tool.status}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {tool.what.slice(0, 150)}
        {tool.what.length > 150 ? "..." : ""}
      </p>

      {expanded && (
        <div
          className="mt-3 pt-3 space-y-2.5 text-xs"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          {tool.useCases.length > 0 && (
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Use Cases
              </span>
              <ul className="mt-1.5 space-y-1">
                {tool.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: statusColor }} />
                    <span style={{ color: "var(--text-secondary)" }}>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tool.securityNotes && (
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color: "var(--status-stale)" }}>
                Security
              </span>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>{tool.securityNotes}</p>
            </div>
          )}
          {tool.installInstructions && (
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Install
              </span>
              <p className="font-mono-data text-[10px] mt-1 p-2 rounded-lg" style={{ color: "var(--text-secondary)", background: "rgba(6, 9, 15, 0.5)" }}>
                {tool.installInstructions.slice(0, 200)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ToolGrid({ tools }: ToolGridProps) {
  const statusCounts = tools.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stages = ["Pending", "Documented", "Installed", "Tested", "In Use", "Rejected"];

  return (
    <div>
      {/* Progress bar */}
      <div className="card-static mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Evaluation Progress
          </h3>
        </div>
        <div className="flex gap-3">
          {stages.map((stage) => {
            const count = statusCounts[stage] || 0;
            const color = STATUS_COLORS[stage] || "#475569";
            return (
              <div
                key={stage}
                className="text-center flex-1 py-2 rounded-lg"
                style={{
                  background: count > 0 ? `${color}08` : "transparent",
                  border: `1px solid ${count > 0 ? `${color}12` : "transparent"}`,
                }}
              >
                <div
                  className="text-lg font-bold font-mono-data"
                  style={{ color: count > 0 ? color : "var(--text-muted)" }}
                >
                  {count}
                </div>
                <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                  {stage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
