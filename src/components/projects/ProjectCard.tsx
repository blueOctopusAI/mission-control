"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#7bb5ff",
  READY: "#5eead4",
  INCUBATING: "#c4b5fd",
  SUPPORTING: "#94a3b8",
  DORMANT: "#64748b",
  PORTFOLIO: "#475569",
};

function getMomentum(project: Project): { label: string; color: string } {
  if (project.blockers && project.blockers !== "None") {
    return { label: "Blocked", color: "var(--status-blocked)" };
  }
  const lastDate = new Date(project.lastTouched);
  const daysSince = Math.floor(
    (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSince > 14) return { label: "Stale", color: "var(--status-blocked)" };
  if (daysSince > 7) return { label: "Cooling", color: "var(--status-stale)" };
  return { label: "Active", color: "var(--status-healthy)" };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const momentum = getMomentum(project);
  const tierColor = TIER_COLORS[project.tier] || "#60a5fa";

  return (
    <div
      className="rounded-xl p-4 cursor-pointer hover-lift"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--border-subtle)`,
        borderTop: `2px solid ${tierColor}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </h4>
          <span className={`badge badge-${project.tier.toLowerCase()} text-[9px] flex-shrink-0`}>
            {project.tier}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: momentum.color, boxShadow: `0 0 6px ${momentum.color}60` }}
          />
          <span className="text-xs font-semibold" style={{ color: momentum.color }}>
            {momentum.label}
          </span>
        </div>
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {project.what}
      </p>

      {project.stack && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.stack.split(",").map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{
                background: `${tierColor}18`,
                color: "var(--text-secondary)",
                border: `1px solid ${tierColor}25`,
              }}
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      {project.blockers && project.blockers !== "None" && (
        <div
          className="text-xs px-3 py-2 rounded-lg mb-2 font-medium"
          style={{
            background: "rgba(251, 113, 133, 0.10)",
            color: "var(--status-blocked)",
            border: "1px solid rgba(251, 113, 133, 0.20)",
          }}
        >
          Blocker: {project.blockers}
        </div>
      )}

      {expanded && (
        <div
          className="mt-3 pt-3 space-y-2.5 text-xs"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          {project.lane && (
            <div className="flex gap-2">
              <span className="font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>Lane</span>
              <span style={{ color: "var(--text-primary)" }}>{project.lane}</span>
            </div>
          )}
          {project.synergies && (
            <div className="flex gap-2">
              <span className="font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>Synergies</span>
              <span style={{ color: "var(--text-secondary)" }}>{project.synergies}</span>
            </div>
          )}
          {project.status && (
            <div className="flex gap-2">
              <span className="font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>Status</span>
              <span style={{ color: "var(--text-secondary)" }}>{project.status}</span>
            </div>
          )}
          {project.github && (
            <div className="flex gap-2">
              <span className="font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>GitHub</span>
              <span style={{ color: "var(--accent-blue-light)" }}>{project.github}</span>
            </div>
          )}
          {project.nextActions.length > 0 && (
            <div>
              <span className="font-medium" style={{ color: "var(--text-muted)" }}>Next actions</span>
              <ul className="mt-1.5 space-y-1">
                {project.nextActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: tierColor }} />
                    <span style={{ color: "var(--text-secondary)" }}>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="font-mono-data text-xs pt-1" style={{ color: "var(--text-muted)" }}>
            Last touched: {project.lastTouched}
          </div>
        </div>
      )}
    </div>
  );
}
