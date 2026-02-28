"use client";

import { useState } from "react";
import type { Opportunity } from "@/lib/types";

interface OpportunityCardsProps {
  opportunities: Opportunity[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  discovered: { bg: "rgba(100, 116, 139, 0.08)", text: "#475569" },
  analyzing: { bg: "rgba(124, 58, 237, 0.08)", text: "#7c3aed" },
  identified: { bg: "rgba(37, 99, 235, 0.08)", text: "#2563eb" },
  tailoring: { bg: "rgba(217, 119, 6, 0.08)", text: "#d97706" },
  applied: { bg: "rgba(2, 132, 199, 0.08)", text: "#0284c7" },
  "phone-screen": { bg: "rgba(13, 148, 136, 0.08)", text: "#0d9488" },
  technical: { bg: "rgba(5, 150, 105, 0.10)", text: "#059669" },
  final: { bg: "rgba(5, 150, 105, 0.12)", text: "#059669" },
  offer: { bg: "rgba(4, 120, 87, 0.15)", text: "#047857" },
  rejected: { bg: "rgba(220, 38, 38, 0.08)", text: "#dc2626" },
  ghosted: { bg: "rgba(71, 85, 105, 0.08)", text: "#475569" },
  withdrawn: { bg: "rgba(71, 85, 105, 0.08)", text: "#475569" },
  expired: { bg: "rgba(71, 85, 105, 0.08)", text: "#475569" },
};

function getMatchColor(match: string): string {
  const lower = match.toLowerCase();
  if (lower.includes("strong")) return "#059669";
  if (lower.includes("bonus")) return "#2563eb";
  if (lower.includes("gap")) return "#dc2626";
  if (lower.includes("adjacent") || lower.includes("ai-assisted")) return "#d97706";
  return "var(--text-secondary)";
}

function OpportunityCard({ op }: { op: Opportunity }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLORS[op.status] || STATUS_COLORS.discovered;

  return (
    <div
      className="rounded-xl p-5 cursor-pointer transition-all"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--border-primary)`,
        borderLeft: `4px solid ${statusColor.text}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-mono-data font-semibold" style={{ color: statusColor.text }}>
            {op.id}
          </span>
          <h4 className="text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
            {op.company}
          </h4>
          <span
            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold flex-shrink-0"
            style={{ background: statusColor.bg, color: statusColor.text }}
          >
            {op.status}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-secondary)" strokeWidth="2"
          className="flex-shrink-0 ml-2 transition-transform"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Role */}
      <p className="text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
        {op.role}
      </p>

      {/* Location + Salary + Variant */}
      <div className="flex items-center gap-4 text-sm">
        {op.location && <span style={{ color: "var(--text-secondary)" }}>{op.location}</span>}
        {op.salary && (
          <span className="font-mono-data font-bold" style={{ color: "#059669" }}>
            {op.salary}
          </span>
        )}
        {op.variant && (
          <span style={{ color: "var(--text-secondary)" }}>{op.variant}</span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="mt-4 pt-4 space-y-4"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          {/* Fit assessment table */}
          {op.fitAssessment.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                Fit Assessment
              </div>
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)" }}>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Requirement</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Level</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {op.fitAssessment.map((row, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                        <td className="py-2 px-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {row.requirement}
                        </td>
                        <td className="py-2 px-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {row.level}
                        </td>
                        <td className="py-2 px-3 text-sm font-bold" style={{ color: getMatchColor(row.match) }}>
                          {row.match}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Overall */}
          {op.overall && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {op.overall}
            </p>
          )}

          {/* Strategy */}
          {op.strategy && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
                Strategy
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {op.strategy}
              </p>
            </div>
          )}

          {/* Materials */}
          {op.materials.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Materials
              </div>
              <div className="space-y-1">
                {op.materials.map((m, i) => {
                  const done = m.startsWith("- [x]");
                  const label = m.replace(/^- \[[ x]\]\s*/, "");
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span style={{ color: done ? "#059669" : "var(--text-muted)" }}>
                        {done ? "✓" : "○"}
                      </span>
                      <span style={{ color: done ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Source + Applied date */}
          <div className="flex gap-4 text-xs font-mono-data pt-1" style={{ color: "var(--text-secondary)" }}>
            {op.applied && <span>Applied: {op.applied}</span>}
            {op.source && <span>Source: {op.source}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpportunityCards({ opportunities }: OpportunityCardsProps) {
  return (
    <div className="space-y-3">
      {opportunities.map((op) => (
        <OpportunityCard key={op.id} op={op} />
      ))}
    </div>
  );
}
