"use client";

import type { LogEntry } from "@/lib/types";

interface ActivityFeedProps {
  entries: LogEntry[];
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "processed"
      ? "var(--status-healthy)"
      : status === "actioned"
      ? "var(--accent-blue-light)"
      : "var(--status-stale)";
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
      style={{ background: color }}
    />
  );
}

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  const recent = entries.slice(0, 12);

  return (
    <div className="card-static">
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
          Recent Activity
        </h3>
        <span className="text-xs font-mono-data font-semibold ml-auto" style={{ color: "var(--text-muted)" }}>
          {entries.length} total
        </span>
      </div>
      <div className="space-y-1">
        {recent.map((entry, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 py-2 px-2.5 rounded-lg transition-colors"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <StatusDot status={entry.status} />
            <div className="min-w-0 flex-1">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm block truncate transition-colors"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                {entry.title}
              </a>
              <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                {entry.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
